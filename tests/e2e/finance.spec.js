const { test, expect } = require('@playwright/test');

const baseState = () => ({
  version: 2,
  transactions: [],
  accounts: [{
    id: 'account-1',
    name: 'Conta Principal',
    type: 'checking',
    balance: 1000,
    color: '#2563eb',
    bank: 'Nubank',
    bankKey: 'nubank'
  }],
  cards: [{
    id: 'credit-1',
    name: 'Cartao Credito',
    digits: '1111',
    limit: 1000,
    used: 0,
    close: 10,
    due: 20,
    brand: 'visa',
    color: '#7c3aed',
    type: 'credit_card',
    accountId: 'account-1',
    bank: 'Nubank',
    bankKey: 'nubank'
  }, {
    id: 'debit-1',
    name: 'Cartao Debito',
    digits: '2222',
    limit: 0,
    used: 0,
    close: null,
    due: null,
    brand: 'visa',
    color: '#2563eb',
    type: 'debit',
    accountId: 'account-1',
    bank: 'Nubank',
    bankKey: 'nubank'
  }],
  goals: [],
  subscriptions: [],
  monthlyBills: [],
  settings: {
    name: 'Teste',
    currency: 'BRL',
    theme: 'dark',
    categories: ['Alimentacao', 'Moradia', 'Streaming', 'Compras', 'Outros']
  }
});

async function seed(page, state = baseState()) {
  await page.goto('/');
  await page.evaluate(value => {
    localStorage.setItem('fluxa_v2', JSON.stringify(value));
    localStorage.setItem('fluxa_tour_done', '1');
  }, state);
  await page.reload();
  await page.waitForFunction(() => typeof saveInvoicePayment === 'function');
}

test('paga a fatura e libera limite debitando a conta', async ({ page }) => {
  const date = new Date().toISOString().slice(0, 10);
  const state = baseState();
  state.transactions.push({
    id: 'purchase-1',
    type: 'expense',
    desc: 'Compra no credito',
    value: 250,
    date,
    cat: 'Compras',
    method: 'credit_card',
    cardId: 'credit-1',
    accountId: '',
    fromAccountId: '',
    toAccountId: '',
    tags: [],
    status: 'pending'
  });
  await seed(page, state);
  const result = await page.evaluate(() => {
    const period = new Date().toISOString().slice(0, 7);
    const before = {used: getCardUsed(state.cards[0]), balance: getAccountBalance(state.accounts[0])};
    openInvoicePaymentModal('credit-1');
    document.getElementById('invoice-account-id').value = 'account-1';
    saveInvoicePayment();
    return {
      before,
      after: {used: getCardUsed(state.cards[0]), balance: getAccountBalance(state.accounts[0])},
      invoice: getCreditInvoiceTotal('credit-1', period)
    };
  });
  expect(result.before).toEqual({used: 250, balance: 1000});
  expect(result.after).toEqual({used: 0, balance: 750});
  expect(result.invoice).toBe(0);
});

test('assinatura no credito e conta mensal no debito respeitam suas origens', async ({ page }) => {
  await seed(page);
  const result = await page.evaluate(() => {
    const set = (id, value) => { document.getElementById(id).value = value; };
    openSubscriptionModal();
    set('sub-name', 'Streaming');
    set('sub-value', '75');
    set('sub-due-day', '28');
    set('sub-category', 'Streaming');
    set('sub-card-id', 'credit-1');
    set('sub-account-id', '');
    set('sub-status', 'active');
    saveSubscription();

    openMonthlyBillModal();
    set('mb-name', 'Compra no debito');
    set('mb-value', '100');
    set('mb-due-day', '10');
    set('mb-card-id', 'debit-1');
    set('mb-account-id', '');
    set('mb-category', 'Outros');
    set('mb-status', 'active');
    saveMonthlyBill();
    markBillAsPaid(state.monthlyBills[0].id);

    const subscriptionTx = state.transactions.find(tx => tx.subscriptionId);
    const billTx = state.transactions.find(tx => tx.monthlyBillId);
    return {
      subscription: {method: subscriptionTx.method, cardId: subscriptionTx.cardId},
      bill: {method: billTx.method, cardId: billTx.cardId, accountId: billTx.accountId},
      balance: getAccountBalance(state.accounts[0]),
      creditUsed: getCardUsed(state.cards.find(card => card.id === 'credit-1'))
    };
  });
  expect(result.subscription).toEqual({method: 'credit_card', cardId: 'credit-1'});
  expect(result.bill).toEqual({method: 'debit', cardId: 'debit-1', accountId: 'account-1'});
  expect(result.balance).toBe(900);
  expect(result.creditUsed).toBe(75);
});

test('backup inclui contas mensais e estado versionado', async ({ page }) => {
  await seed(page);
  const result = await page.evaluate(() => {
    const original = JSON.parse(localStorage.getItem('fluxa_v2'));
    exportJSON();
    return {version: original.version, hasBills: Array.isArray(original.monthlyBills)};
  });
  expect(result).toEqual({version: 2, hasBills: true});
});
