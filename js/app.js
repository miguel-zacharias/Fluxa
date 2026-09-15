
document.getElementById('footer-year').textContent = new Date().getFullYear();


const CATS_DEFAULT = ['Alimentação','Transporte','Moradia','Saúde','Educação','Lazer','Streaming','Compras','Investimentos','Salário','Freelance','Outros'];
const CAT_COLORS = {'Alimentação':'#D6A33A','Transporte':'#9AA1A8','Moradia':'#35B779','Saúde':'#D95C5C','Educação':'#6F777F','Lazer':'#D6A33A','Streaming':'#35B779','Compras':'#D95C5C','Investimentos':'#35B779','Salário':'#9AA1A8','Freelance':'#D6A33A','Outros':'#9AA1A8'};
const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const ACCOUNT_BANKS = [
  { value: 'nubank', label: 'Nubank' },
  { value: 'itau', label: 'Itaú' },
  { value: 'bradesco', label: 'Bradesco' },
  { value: 'santander', label: 'Santander' },
  { value: 'bb', label: 'Banco do Brasil' },
  { value: 'caixa', label: 'Caixa' },
  { value: 'inter', label: 'Inter' },
  { value: 'c6', label: 'C6 Bank' },
  { value: 'btg', label: 'BTG Pactual' },
  { value: 'safra', label: 'Banco Safra' },
  { value: 'sicredi', label: 'Sicredi' },
  { value: 'sicoob', label: 'Sicoob' },
  { value: 'banco-original', label: 'Banco Original' },
  { value: 'banco-pan', label: 'Banco Pan' },
  { value: 'pagbank', label: 'PagBank' },
  { value: 'mercado-pago', label: 'Mercado Pago' },
  { value: 'bmg', label: 'Banco BMG' },
  { value: 'bnb', label: 'Banco Nordeste (BNB)' },
  { value: 'banrisul', label: 'Banrisul' },
  { value: 'xp-investimentos', label: 'XP Investimentos' },
  { value: 'neon', label: 'Neon' },
  { value: 'picpay', label: 'PicPay' },
  { value: 'next', label: 'Next' },
  { value: 'hsbc', label: 'HSBC' },
  { value: 'mercantil', label: 'Mercantil' },
  { value: 'sofis', label: 'Sofisa' },
  { value: 'american-express', label: 'American Express' }
];
const BANK_COLOR_MAP = {
  nubank: '#8b5cf6',
  itau: '#f97316',
  bradesco: '#dc2626',
  santander: '#ef4444',
  bb: '#facc15',
  caixa: '#2563eb',
  inter: '#f97316',
  c6: '#111827',
  'american-express': '#1f2937',
  btg: '#1d4ed8',
  safra: '#1e3a8a',
  sicredi: '#22c55e',
  sicoob: '#16a34a',
  'banco-original': '#22c55e',
  'banco-pan': '#2563eb',
  pagbank: '#22c55e',
  'mercado-pago': '#2563eb',
  bmg: '#f59e0b',
  bnb: '#dc2626',
  banrisul: '#2563eb',
  'xp-investimentos': '#111827',
  neon: '#22d3ee',
  picpay: '#22c55e',
  next: '#ec4899',
  hsbc: '#0369a1',
  mercantil: '#7f1d1d',
  sofis: '#c026d3',
  'custom-bank': '#64748b'
};
const ACCOUNT_COLOR_PALETTE = ['#2563eb','#10b981','#8b5cf6','#f59e0b','#ef4444','#ec4899','#14b8a6','#0ea5e9','#f97316','#22c55e','#7c3aed','#0f172a'];
const GOAL_MODAL_NEW_TITLE = 'Uau! Uma Nova Meta?';
const CARD_COLOR_PALETTE = [
  ['#f8fafc','#e2e8f0','#cbd5e1','#94a3b8','#64748b','#334155','#1f2937','#000000'],
  ['#fff1f2','#fecdd3','#fda4af','#fb7185','#f43f5e','#be123c','#7f1d1d','#4c0519'],
  ['#fff7ed','#fed7aa','#fdba74','#fb923c','#f97316','#c2410c','#9a4d12','#7c2d12'],
  ['#fefce8','#fef3c7','#fde68a','#facc15','#fbbf24','#f59e0b','#d97706','#b45309'],
  ['#f0fdf4','#dcfce7','#bbf7d0','#86efac','#4ade80','#22c55e','#15803d','#14532d'],
  ['#eff6ff','#dbeafe','#bfdbfe','#93c5fd','#60a5fa','#3b82f6','#2563eb','#1d4ed8'],
  ['#faf5ff','#f3e8ff','#e9d5ff','#c4b5fd','#a78bfa','#8b5cf6','#6d28d9','#4c1d95']
];

let state = {
  version: 2,
  transactions: [],
  accounts: [],
  cards: [],
  goals: [],
  subscriptions: [],
  monthlyBills: [],
  settings: { name: 'Usuário', currency: 'BRL', theme: 'dark', categories: [...CATS_DEFAULT] },
  editingTx: null,
  editingGoal: null,
  selectedGoalId: null,
  txType: 'expense',
  accColor: '#3b82f6',
  cardColor: '#7c3aed',
  cardColorCustomized: false
};

function load() {
  try {
    const d = localStorage.getItem('fluxa_v2');
    if(d) {
      const p = JSON.parse(d);
      state.transactions = p.transactions||[];
      state.accounts = p.accounts||[];
      state.cards = p.cards||[];
      state.goals = p.goals||[];
      state.subscriptions = p.subscriptions||[];
      state.monthlyBills = p.monthlyBills||[];
      if(p.settings) state.settings = {...state.settings,...p.settings};
      state.version = Number(p.version || 1);
      migrateState();
      restoreBankAndCardColors();
    }
  } catch(e){}
}

function restoreBankAndCardColors() {
  state.accounts.forEach(account => {
    if (account.color === '#2F80ED' && BANK_COLOR_MAP[account.bankKey]) {
      account.color = BANK_COLOR_MAP[account.bankKey];
    }
  });
  state.cards.forEach(card => {
    if (card.color !== '#2F80ED') return;
    const account = state.accounts.find(item => item.id === card.accountId);
    const bankKey = card.bankKey || account?.bankKey;
    if (bankKey && BANK_COLOR_MAP[bankKey]) card.color = BANK_COLOR_MAP[bankKey];
  });
}

function save() {
  try {
    localStorage.setItem('fluxa_v2', JSON.stringify({
      version: 2,
      transactions: state.transactions,
      accounts: state.accounts,
      cards: state.cards,
      goals: state.goals,
      subscriptions: state.subscriptions,
      monthlyBills: state.monthlyBills,
      settings: state.settings
    }));
  } catch(e){}
}

function migrateState() {
  state.transactions = Array.isArray(state.transactions) ? state.transactions : [];
  state.accounts = Array.isArray(state.accounts) ? state.accounts : [];
  state.cards = Array.isArray(state.cards) ? state.cards : [];
  state.goals = Array.isArray(state.goals) ? state.goals : [];
  state.subscriptions = Array.isArray(state.subscriptions) ? state.subscriptions : [];
  state.monthlyBills = Array.isArray(state.monthlyBills) ? state.monthlyBills : [];
  state.settings.categories = Array.isArray(state.settings.categories) && state.settings.categories.length
    ? state.settings.categories : [...CATS_DEFAULT];
  state.transactions.forEach(tx => {
    tx.value = Math.abs(Number(tx.value) || 0);
    tx.tags = Array.isArray(tx.tags) ? tx.tags : [];
    tx.cardInvoicePeriod = tx.cardInvoicePeriod || '';
    if(tx.type === 'expense' && tx.method === 'bank_transfer' && tx.cardId && !tx.toAccountId && tx.cardPayment === undefined) {
      tx.cardPayment = true;
    }
  });
  state.monthlyBills.forEach(bill => {
    bill.payments = Array.isArray(bill.payments) ? bill.payments : [];
  });
  state.version = 2;
}

function seedDefaults() {
  // App starts completely empty - no demo data
  save();
}

function uid() { return Date.now().toString(36)+Math.random().toString(36).slice(2,7); }
function fmt(d) { return d.toISOString().slice(0,10); }
function fmtCur(v) {
  const sym = state.settings.currency==='USD'?'$':state.settings.currency==='EUR'?'€':'R$';
  return sym+' '+Math.abs(v).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
}
function fmtDate(s) { if(!s)return''; const p=s.split('-'); return p[2]+'/'+p[1]+'/'+p[0]; }

function normalizeMethod(method) {
  if(!method) return '';
  return method==='cartao_debito' ? 'debit' : method==='cartao_credito' ? 'credit_card' : method==='transferencia' ? 'bank_transfer' : method;
}

function toggleCardDueRow(){
  const type = document.getElementById('card-type')?.value;
  const dueRow = document.getElementById('card-due-row');
  const limitRow = document.getElementById('card-limit-row');
  if(dueRow) dueRow.style.display = type==='debit' ? 'none' : 'block';
  if(limitRow) limitRow.style.display = type==='debit' ? 'none' : 'block';
}

function formatMethodLabel(method) {
  const labels = {
    pix: 'PIX',
    cash: 'Dinheiro',
    debit: 'Cartão Débito',
    credit_card: 'Cartão Crédito',
    bank_transfer: 'Transferência',
    boleto: 'Boleto'
  };
  return labels[method] || method.replace(/_/g, ' ');
}

function isCreditCardPurchase(tx) {
  return tx && tx.type==='expense' && tx.method==='credit_card' && tx.cardId;
}

function isCardPayment(tx) {
  return tx && tx.type==='expense' && tx.method==='bank_transfer' && tx.cardId && !tx.toAccountId && tx.cardPayment === true;
}

function isTransfer(tx) {
  return tx && tx.method==='bank_transfer' && tx.fromAccountId && tx.toAccountId;
}

function isOperationalExpense(tx) {
  return tx && tx.type === 'expense' && !isCardPayment(tx);
}

function getCardUsed(card) {
  const type = card.type || 'credit_card';
  if(type==='debit') {
    return Number(state.transactions
      .filter(t => t.type==='expense' && t.method==='debit' && t.cardId===card.id)
      .reduce((s,t) => s + t.value, 0).toFixed(2));
  }
  const purchases = state.transactions
    .filter(t => isCreditCardPurchase(t) && t.cardId===card.id)
    .reduce((s,t) => s + t.value, 0);
  const payments = state.transactions
    .filter(t => isCardPayment(t) && t.cardId===card.id)
    .reduce((s,t) => s + t.value, 0);
  return Number(Math.max(0, purchases - payments).toFixed(2));
}

function getPeriodFromDate(date) {
  return (date || '').slice(0, 7);
}

function getCreditInvoiceTotal(cardId, period) {
  const purchases = state.transactions
    .filter(t => isCreditCardPurchase(t) && t.cardId === cardId && getPeriodFromDate(t.date) === period)
    .reduce((sum, t) => sum + Number(t.value || 0), 0);
  const payments = state.transactions
    .filter(t => isCardPayment(t) && t.cardId === cardId && t.cardInvoicePeriod === period)
    .reduce((sum, t) => sum + Number(t.value || 0), 0);
  return Number(Math.max(0, purchases - payments).toFixed(2));
}

function shouldConfirmCardLimit(cardId, value, isEditingTx) {
  if (!cardId || !value || value <= 0) return false;
  const card = state.cards.find(c => c.id === cardId);
  if (!card || card.type !== 'credit_card' || !Number(card.limit)) return false;

  const currentTx = isEditingTx ? state.transactions.find(t => t.id === isEditingTx) : null;
  const currentValue = (currentTx && currentTx.cardId === cardId && currentTx.type === 'expense' && currentTx.method === 'credit_card') ? currentTx.value : 0;
  const usedWithoutCurrent = Math.max(0, getCardUsed(card) - currentValue);
  return usedWithoutCurrent + Number(value) > Number(card.limit);
}

function getAccountBalance(account) {
  const opening = Number(account.balance || 0);
  return Number(state.transactions.reduce((sum, tx) => {
    if(tx.type==='income' && tx.accountId===account.id) return sum + tx.value;
    if(tx.method==='credit_card' && tx.type==='expense') return sum;
    if(isTransfer(tx)) {
      if(tx.fromAccountId===account.id) return sum - tx.value;
      if(tx.toAccountId===account.id) return sum + tx.value;
      return sum;
    }
    if(tx.type==='expense' && tx.accountId===account.id) return sum - tx.value;
    return sum;
  }, opening).toFixed(2));
}

function getAccountTotals(account) {
  let income = 0;
  let expense = 0;
  state.transactions.forEach(tx => {
    if(tx.type==='income' && tx.accountId===account.id) income += tx.value;
    if(tx.type==='expense' && tx.accountId===account.id && tx.method!=='credit_card') expense += tx.value;
    if(isTransfer(tx)) {
      if(tx.fromAccountId===account.id) expense += tx.value;
      if(tx.toAccountId===account.id) income += tx.value;
    }
  });
  return { income, expense };
}

function getTxStatusLabel(status) {
  return status==='pending' ? 'Pendente' : 'Pago';
}

function getTxStatusColor(status) {
  return status==='pending' ? 'var(--yellow)' : 'var(--green2)';
}

function updateTransactionFields() {
  const method = document.getElementById('tx-method').value;
  const transferRow = document.getElementById('tx-transfer-row');
  const accountRow = document.getElementById('tx-account-row');
  const statusSel = document.getElementById('tx-status');
  if(method==='bank_transfer') {
    transferRow.style.display='grid';
    accountRow.style.display='none';
  } else if(method==='credit_card' || method==='debit') {
    transferRow.style.display='none';
    accountRow.style.display='none';
  } else {
    transferRow.style.display='none';
    accountRow.style.display='block';
  }
  if(statusSel && !statusSel.value) {
    statusSel.value = method==='credit_card' ? 'pending' : 'paid';
  }
}

function updateTransactionCardType() {
  const cardId = document.getElementById('tx-card-modal').value;
  if(!cardId) return;
  const card = state.cards.find(c => c.id===cardId);
  if(!card) return;
  if(card.type === 'debit') {
    document.getElementById('tx-method').value = 'debit';
  } else if(card.type === 'credit_card') {
    document.getElementById('tx-method').value = 'credit_card';
  }
  updateTransactionFields();
}

function generateInstallmentTransactions(tx) {
  if(!tx.installment || !tx.installment.groupId || !tx.installment.total || !tx.installment.current) return;
  const { groupId, current, total } = tx.installment;
  const baseDate = new Date(tx.date + 'T12:00:00');
  const existing = state.transactions.filter(t => t.installment && t.installment.groupId===groupId);
  const existingIndexes = existing.map(t => t.installment?.current).filter(Boolean);
  for(let next = current + 1; next <= total; next++) {
    if(existingIndexes.includes(next)) continue;
    const future = { ...tx };
    future.id = uid();
    future.installment = { ...tx.installment, current: next };
    future.date = fmt(new Date(baseDate.getFullYear(), baseDate.getMonth() + (next - current), baseDate.getDate()));
    future.status = 'pending';
    future.tags = [...(tx.tags||[]), 'parcela'];
    state.transactions.push(future);
  }
}

function syncRecurringTransactions() {
  const today = new Date();
  let hasNewTx = false;
  state.subscriptions.forEach(sub => {
    if(sub.status !== 'active') return;
    const dueDate = getSubscriptionNextDueDate(sub);
    const card = state.cards.find(c => c.id===sub.cardId);
    const method = card?.type==='debit' ? 'debit' : sub.cardId ? 'credit_card' : 'bank_transfer';
    const recurringPeriod = `${dueDate.getFullYear()}-${String(dueDate.getMonth()+1).padStart(2,'0')}`;
    const recurringTx = state.transactions.find(t => t.subscriptionId===sub.id && (t.recurringPeriod===recurringPeriod || t.date===fmt(dueDate)));
    if(recurringTx) {
      recurringTx.desc = sub.name;
      recurringTx.value = sub.value;
      recurringTx.cat = sub.category;
      recurringTx.method = method;
      recurringTx.cardId = sub.cardId || '';
      recurringTx.accountId = card?.type==='debit' ? (card.accountId || '') : (sub.cardId ? '' : (sub.accountId || ''));
      recurringTx.fromAccountId = card?.type==='debit' || sub.cardId ? '' : (sub.accountId || '');
      recurringTx.tags = ['assinatura'];
      recurringTx.recurringPeriod = recurringPeriod;
    } else {
      state.transactions.push({
        id: uid(),
        type: 'expense',
        desc: sub.name,
        value: sub.value,
        date: fmt(dueDate),
        cat: sub.category,
        method,
        cardId: sub.cardId || '',
        accountId: card?.type==='debit' ? (card.accountId || '') : (sub.cardId ? '' : (sub.accountId || '')),
        fromAccountId: card?.type==='debit' || sub.cardId ? '' : (sub.accountId || ''),
        toAccountId: '',
        tags: ['assinatura'],
        status: 'pending',
        subscriptionId: sub.id,
        installment: null,
        recurringPeriod
      });
      hasNewTx = true;
    }
  });
  if(hasNewTx) save();
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const burger  = document.getElementById('burger-btn');
  const isOpen  = sidebar.classList.contains('open');
  if(isOpen) {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    burger && burger.classList.remove('open');
  } else {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    burger && burger.classList.add('open');
  }
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('active');
  const burger = document.getElementById('burger-btn');
  burger && burger.classList.remove('open');
}

function navigate(page) {
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  document.querySelectorAll('.bnav-item').forEach(n=>n.classList.remove('active'));
  document.getElementById('page-'+page).classList.add('active');
  document.querySelector('[onclick="navigate(\''+page+'\')"]').classList.add('active');
  const bottomMap = {
    dashboard: 'bn-dashboard',
    transactions: 'bn-transactions',
    goals: 'bn-goals',
    reports: 'bn-reports',
    alerts: 'bn-alerts'
  };
  if(bottomMap[page]) document.getElementById(bottomMap[page])?.classList.add('active');
  if(page==='dashboard') renderDashboard();
  else if(page==='transactions') renderTransactions();
  else if(page==='accounts') renderAccounts();
  else if(page==='cards') renderCards();
  else if(page==='goals') renderGoals();
  else if(page==='subscriptions') renderSubscriptions();
  else if(page==='monthlybills') renderMonthlyBills();
  else if(page==='reports') renderReports();
  else if(page==='alerts') renderAlerts();
  else if(page==='settings') renderSettings();
  closeSidebar();
}

function toggleTheme() {
  const isDark = !document.documentElement.hasAttribute('data-theme');
  if(isDark) { document.documentElement.setAttribute('data-theme','light'); state.settings.theme='light'; }
  else { document.documentElement.removeAttribute('data-theme'); state.settings.theme='dark'; }
  document.getElementById('theme-icon').className = isDark?'ti ti-moon':'ti ti-sun';
  document.getElementById('theme-label').textContent = isDark?'Modo Escuro':'Modo Claro';
  save();
}

function getMonthTxs(month, year) {
  return state.transactions.filter(t=>{
    const d = new Date(t.date+'T12:00:00');
    return d.getMonth()===month && d.getFullYear()===year;
  });
}

function renderDashboard() {
  const now = new Date();
  const txs = getMonthTxs(now.getMonth(), now.getFullYear());
  const income = txs.filter(t=>t.type==='income').reduce((s,t)=>s+t.value,0);
  const expense = txs.filter(isOperationalExpense).reduce((s,t)=>s+t.value,0);
  const balance = state.accounts.reduce((s,a)=>s+getAccountBalance(a),0);
  const patrimony = balance;
  const prevTxs = getMonthTxs(now.getMonth()-1<0?11:now.getMonth()-1, now.getMonth()-1<0?now.getFullYear()-1:now.getFullYear());
  const prevExp = prevTxs.filter(isOperationalExpense).reduce((s,t)=>s+t.value,0);
  const expDiff = prevExp>0?((expense-prevExp)/prevExp*100).toFixed(1):0;

  const activeSubs = state.subscriptions.filter(s=>s.status==='active');
  const totalSubs = activeSubs.reduce((s,sub)=>s+sub.value,0);
  
  const activeBills = state.monthlyBills.filter(b=>b.status==='active');
  const totalBills = activeBills.reduce((s,bill)=>s+bill.value,0);

  document.getElementById('stat-cards').innerHTML = `
    <div class="stat-card"><div class="stat-label">Saldo Total</div><div class="stat-value">${fmtCur(balance)}</div><div class="stat-sub" style="margin-top:6px"><span class="stat-badge badge-blue">${state.accounts.length} contas</span></div></div>
    <div class="stat-card"><div class="stat-label">Receita do Mês</div><div class="stat-value" style="color:var(--green2)">${fmtCur(income)}</div><div class="stat-sub" style="margin-top:6px"><span class="stat-badge badge-green"><i class="ti ti-trending-up" style="font-size:11px"></i> Receitas</span></div></div>
    <div class="stat-card"><div class="stat-label">Despesas do Mês</div><div class="stat-value" style="color:var(--red2)">${fmtCur(expense)}</div><div class="stat-sub" style="margin-top:6px"><span class="stat-badge ${Number(expDiff)>0?'badge-red':'badge-green'}">${Number(expDiff)>0?'↑':'↓'} ${Math.abs(expDiff)}%</span></div></div>
    <div class="stat-card"><div class="stat-label">Saldo do Mês</div><div class="stat-value" style="color:${income-expense>=0?'var(--green2)':'var(--red2)'}">${fmtCur(income-expense)}</div><div class="stat-sub" style="margin-top:6px"><span class="stat-badge ${income-expense>=0?'badge-green':'badge-red'}">${income-expense>=0?'Positivo':'Negativo'}</span></div></div>
    <div class="stat-card"><div class="stat-label">Contas Mensais</div><div class="stat-value" style="color:var(--red2)">${fmtCur(totalBills)}</div><div class="stat-sub" style="margin-top:6px"><span class="stat-badge badge-red"><i class="ti ti-calendar-due" style="font-size:11px"></i> ${activeBills.length} ativas</span></div></div>
  `;

  renderPieChart(txs);
  renderLineChart();
  renderBarChart();

  const recent = [...state.transactions].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,6);
  document.getElementById('recent-transactions').innerHTML = recent.length ? recent.map(t=>`
    <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border)">
      <div style="display:flex;align-items:center;gap:10px">
        <div style="width:34px;height:34px;border-radius:8px;background:${t.type==='income'?'rgba(22,163,74,0.12)':'rgba(220,38,38,0.12)'};display:flex;align-items:center;justify-content:center">
          <i class="ti ${t.type==='income'?'ti-arrow-down-right':'ti-arrow-up-right'}" style="font-size:16px;color:${t.type==='income'?'var(--green2)':'var(--red2)'}"></i>
        </div>
        <div><div style="font-size:13px;font-weight:500">${t.desc}</div><div style="font-size:11px;color:var(--text3)">${t.cat} · ${fmtDate(t.date)}</div></div>
      </div>
      <div style="font-size:14px;font-weight:600;color:${t.type==='income'?'var(--green2)':'var(--red2)'}">${t.type==='income'?'+':'-'}${fmtCur(t.value)}</div>
    </div>`).join('')+'<div style="padding-top:12px"><button class="btn btn-ghost" onclick="navigate(\'transactions\')" style="width:100%;justify-content:center">Ver todas <i class="ti ti-arrow-right"></i></button></div>'
    : '<div class="empty-state"><i class="ti ti-receipt-off"></i><p>Sem transações</p></div>';

  const top3Goals = state.goals.slice(0,3);
  document.getElementById('goals-summary').innerHTML = top3Goals.length ? top3Goals.map(g=>{
    const pct = Math.min(100,(g.current/g.target*100)).toFixed(0);
    return `<div style="margin-bottom:16px">
      <div style="display:flex;justify-content:space-between;margin-bottom:6px">
        <span style="font-size:13px;font-weight:500">${g.emoji||'🎯'} ${g.name}</span>
        <span style="font-size:12px;color:var(--text3)">${pct}%</span>
      </div>
      <div class="progress-bar"><div class="progress-fill" style="width:${pct}%;background:${pct>=100?'var(--green)':pct>=50?'var(--text2)':'var(--yellow)'}"></div></div>
      <div style="display:flex;justify-content:space-between;margin-top:4px;font-size:11px;color:var(--text3)">
        <span>${fmtCur(g.current)}</span><span>${fmtCur(g.target)}</span>
      </div>
    </div>`;
  }).join('')+'<button class="btn btn-ghost" onclick="navigate(\'goals\')" style="width:100%;justify-content:center;margin-top:4px">Ver metas <i class="ti ti-arrow-right"></i></button>'
  : '<div class="empty-state"><i class="ti ti-target"></i><p>Nenhuma meta criada</p></div>';

  renderAlertsSummary();
}

function renderPieChart(txs) {
  const el = document.getElementById('pie-chart');
  const expenses = txs.filter(isOperationalExpense);
  if(!expenses.length){el.innerHTML='<div class="empty-state"><i class="ti ti-chart-pie"></i><p>Sem dados</p></div>';return;}
  const byCat = {};
  expenses.forEach(t=>{ byCat[t.cat]=(byCat[t.cat]||0)+t.value; });
  const sorted = Object.entries(byCat).sort((a,b)=>b[1]-a[1]).slice(0,7);
  const total = sorted.reduce((s,c)=>s+c[1],0);
  let svg=`<svg viewBox="0 0 300 220" width="100%" height="100%">`;
  let angle=-Math.PI/2;
  sorted.forEach(([cat,val])=>{
    const pct=val/total; const sweep=pct*Math.PI*2;
    const x1=100+80*Math.cos(angle), y1=110+80*Math.sin(angle);
    const x2=100+80*Math.cos(angle+sweep), y2=110+80*Math.sin(angle+sweep);
    const large=sweep>Math.PI?1:0;
    const col=CAT_COLORS[cat]||'#94a3b8';
    svg+=`<path d="M100,110 L${x1},${y1} A80,80 0 ${large},1 ${x2},${y2} Z" fill="${col}" opacity="0.85" stroke="var(--bg)" stroke-width="2"/>`;
    angle+=sweep;
  });
  svg+=`<circle cx="100" cy="110" r="42" fill="var(--card-bg)"/>`;
  svg+=`<text x="100" y="105" text-anchor="middle" fill="var(--text)" font-size="11" font-weight="600">Total</text>`;
  svg+=`<text x="100" y="122" text-anchor="middle" fill="var(--text2)" font-size="10">${fmtCur(total)}</text>`;
  let ly=30;
  sorted.slice(0,6).forEach(([cat,val])=>{
    const pct=(val/total*100).toFixed(0);
    const col=CAT_COLORS[cat]||'#94a3b8';
    svg+=`<rect x="195" y="${ly-8}" width="10" height="10" rx="2" fill="${col}"/>`;
    svg+=`<text x="210" y="${ly+1}" fill="var(--text2)" font-size="10">${cat}</text>`;
    svg+=`<text x="290" y="${ly+1}" text-anchor="end" fill="var(--text3)" font-size="10">${pct}%</text>`;
    ly+=22;
  });
  svg+=`</svg>`;
  el.innerHTML=svg;
}

function renderLineChart() {
  const el = document.getElementById('line-chart');
  const now = new Date();
  const months=[]; const incomes=[]; const expenses=[];
  for(let i=5;i>=0;i--){
    const m=new Date(now.getFullYear(),now.getMonth()-i,1);
    months.push(MONTHS[m.getMonth()].slice(0,3));
    const txs=getMonthTxs(m.getMonth(),m.getFullYear());
    incomes.push(txs.filter(t=>t.type==='income').reduce((s,t)=>s+t.value,0));
    expenses.push(txs.filter(isOperationalExpense).reduce((s,t)=>s+t.value,0));
  }
  const maxV=Math.max(...incomes,...expenses,1);
  const W=560,H=180,PL=40,PR=20,PT=20,PB=30;
  const iW=W-PL-PR, iH=H-PT-PB;
  let svg=`<svg viewBox="0 0 ${W} ${H}" width="100%" height="100%">`;
  svg+=`<defs><linearGradient id="gi" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#35B779" stop-opacity="0.15"/><stop offset="100%" stop-color="#35B779" stop-opacity="0"/></linearGradient><linearGradient id="ge" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#D95C5C" stop-opacity="0.15"/><stop offset="100%" stop-color="#D95C5C" stop-opacity="0"/></linearGradient></defs>`;
  [0,0.25,0.5,0.75,1].forEach(v=>{
    const y=PT+iH*(1-v);
    svg+=`<line x1="${PL}" y1="${y}" x2="${W-PR}" y2="${y}" stroke="var(--border)" stroke-width="0.5"/>`;
    const lv=(maxV*v);
    svg+=`<text x="${PL-6}" y="${y+4}" text-anchor="end" fill="var(--text3)" font-size="9">${lv>=1000?(lv/1000).toFixed(0)+'k':lv.toFixed(0)}</text>`;
  });
  const pts=(arr,col)=>{
    const points=arr.map((v,i)=>{
      const x=PL+(i/(arr.length-1||1))*iW;
      const y=PT+iH*(1-v/maxV);
      return [x,y];
    });
    const areaPath='M'+points.map(p=>p[0]+','+p[1]).join(' L')+` L${points[points.length-1][0]},${PT+iH} L${points[0][0]},${PT+iH} Z`;
    const linePath='M'+points.map(p=>p[0]+','+p[1]).join(' L');
    return {points,areaPath,linePath};
  };
  const {points:ip,areaPath:ia,linePath:il}=pts(incomes,'#35B779');
  const {points:ep,areaPath:ea,linePath:el2}=pts(expenses,'#D95C5C');
  svg+=`<path d="${ia}" fill="url(#gi)"/>`;
  svg+=`<path d="${ea}" fill="url(#ge)"/>`;
  svg+=`<path d="${il}" fill="none" stroke="#35B779" stroke-width="2" stroke-linejoin="round"/>`;
  svg+=`<path d="${el2}" fill="none" stroke="#D95C5C" stroke-width="2" stroke-linejoin="round"/>`;
  ip.forEach(([x,y])=>{ svg+=`<circle cx="${x}" cy="${y}" r="3" fill="#35B779"/>`; });
  ep.forEach(([x,y])=>{ svg+=`<circle cx="${x}" cy="${y}" r="3" fill="#D95C5C"/>`; });
  months.forEach((m,i)=>{
    const x=PL+(i/(months.length-1||1))*iW;
    svg+=`<text x="${x}" y="${H-6}" text-anchor="middle" fill="var(--text3)" font-size="9">${m}</text>`;
  });
  svg+=`<rect x="${W-110}" y="4" width="8" height="8" rx="2" fill="#35B779"/><text x="${W-98}" y="12" fill="var(--text2)" font-size="9">Receita</text>`;
  svg+=`<rect x="${W-60}" y="4" width="8" height="8" rx="2" fill="#D95C5C"/><text x="${W-48}" y="12" fill="var(--text2)" font-size="9">Despesa</text>`;
  svg+=`</svg>`;
  el.innerHTML=svg;
}

function renderBarChart() {
  const el = document.getElementById('bar-chart');
  const now = new Date();
  const months=[]; const incomes=[]; const expenses=[];
  for(let i=5;i>=0;i--){
    const m=new Date(now.getFullYear(),now.getMonth()-i,1);
    months.push(MONTHS[m.getMonth()].slice(0,3));
    const txs=getMonthTxs(m.getMonth(),m.getFullYear());
    incomes.push(txs.filter(t=>t.type==='income').reduce((s,t)=>s+t.value,0));
    expenses.push(txs.filter(isOperationalExpense).reduce((s,t)=>s+t.value,0));
  }
  const maxV=Math.max(...incomes,...expenses,1);
  const W=560,H=180,PL=40,PR=20,PT=20,PB=30;
  const iW=W-PL-PR, iH=H-PT-PB;
  const bw=(iW/6-6)/2, gap=iW/6;
  let svg=`<svg viewBox="0 0 ${W} ${H}" width="100%" height="100%">`;
  [0,0.25,0.5,0.75,1].forEach(v=>{
    const y=PT+iH*(1-v);
    svg+=`<line x1="${PL}" y1="${y}" x2="${W-PR}" y2="${y}" stroke="var(--border)" stroke-width="0.5"/>`;
    const lv=(maxV*v);
    svg+=`<text x="${PL-6}" y="${y+4}" text-anchor="end" fill="var(--text3)" font-size="9">${lv>=1000?(lv/1000).toFixed(0)+'k':lv.toFixed(0)}</text>`;
  });
  months.forEach((m,i)=>{
    const cx=PL+i*gap+gap/2;
    const ih=incomes[i]/maxV*iH; const eh=expenses[i]/maxV*iH;
    svg+=`<rect x="${cx-bw-2}" y="${PT+iH-ih}" width="${bw}" height="${ih}" rx="3" fill="#35B779" opacity="0.7"/>`;
    svg+=`<rect x="${cx+2}" y="${PT+iH-eh}" width="${bw}" height="${eh}" rx="3" fill="#D95C5C" opacity="0.7"/>`;
    svg+=`<text x="${cx}" y="${H-6}" text-anchor="middle" fill="var(--text3)" font-size="9">${m}</text>`;
  });
  svg+=`<rect x="${W-110}" y="4" width="8" height="8" rx="2" fill="#35B779" opacity="0.7"/><text x="${W-98}" y="12" fill="var(--text2)" font-size="9">Receita</text>`;
  svg+=`<rect x="${W-60}" y="4" width="8" height="8" rx="2" fill="#D95C5C" opacity="0.7"/><text x="${W-48}" y="12" fill="var(--text2)" font-size="9">Despesa</text>`;
  svg+=`</svg>`;
  el.innerHTML=svg;
}

function getSubscriptionNextDueDate(sub) {
  const safeSub = sub || {};
  const dueDay = Math.max(1, Math.min(Number(safeSub.dueDay) || 1, 31));
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const currentMonthLength = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const safeCurrentDay = Math.min(dueDay, currentMonthLength);
  const currentDue = new Date(now.getFullYear(), now.getMonth(), safeCurrentDay);

  if (currentDue < todayStart) {
    const nextMonthLength = new Date(now.getFullYear(), now.getMonth() + 2, 0).getDate();
    const safeNextDay = Math.min(dueDay, nextMonthLength);
    return new Date(now.getFullYear(), now.getMonth() + 1, safeNextDay);
  }

  return currentDue;
}

function renderAlertsSummary() {
  const alerts = getAlerts();
  const el = document.getElementById('alerts-summary');
  if(!alerts.length){el.innerHTML='';return;}
  el.innerHTML=`<div class="card"><div class="section-title"><i class="ti ti-bell" style="color:var(--yellow)"></i> Alertas Ativos</div>${alerts.slice(0,3).map(a=>`
    <div class="alert-item" style="background:${a.color}15;border:1px solid ${a.color}30">
      <i class="ti ${a.icon}" style="color:${a.color};font-size:18px"></i>
      <div><div style="font-size:13px;font-weight:500">${a.title}</div><div style="font-size:12px;color:var(--text3)">${a.msg}</div></div>
    </div>`).join('')}</div>`;
}

function getAlerts() {
  const alerts=[];
  const now=new Date();
  const txs=getMonthTxs(now.getMonth(),now.getFullYear());
  const expense=txs.filter(isOperationalExpense).reduce((s,t)=>s+t.value,0);
  const income=txs.filter(t=>t.type==='income').reduce((s,t)=>s+t.value,0);
  if(expense>income*0.9&&income>0) alerts.push({icon:'ti-alert-triangle',color:'#D95C5C',title:'Gastos Altos',msg:`Despesas (${fmtCur(expense)}) são ${(expense/income*100).toFixed(0)}% da receita`});
  state.cards.forEach(c=>{ if(c.type==='debit') return; const used = getCardUsed(c); const pct = c.limit ? used/c.limit : 0; if(pct>=0.8) alerts.push({icon:'ti-credit-card',color:'#D6A33A',title:'Limite do Cartão',msg:`${c.name} está em ${(pct*100).toFixed(0)}% do limite`}); });
  state.goals.forEach(g=>{ if(g.current>=g.target) alerts.push({icon:'ti-trophy',color:'#35B779',title:'Meta Concluída!',msg:`Parabéns! Você atingiu a meta: ${g.name}`}); });
  state.goals.forEach(g=>{ const dl=new Date(g.deadline); const diff=Math.round((dl-now)/86400000); if(diff>=0&&diff<=30&&g.current<g.target) alerts.push({icon:'ti-calendar',color:'#9AA1A8',title:'Prazo se Aproximando',msg:`Meta "${g.name}" vence em ${diff} dias`}); });
  state.subscriptions.forEach(s=>{
    if(s.status !== 'active') return;
    const nextDate = getSubscriptionNextDueDate(s);
    const diff = Math.round((nextDate - now) / 86400000);
    if(diff >= 0 && diff <= 7) alerts.push({icon:'ti-calendar-event',color:'#D6A33A',title:'Assinatura Próxima',msg:`"${s.name}" vence em ${diff} dias (${fmtCur(s.value)})`});
    else if(diff < 0) alerts.push({icon:'ti-alert-triangle',color:'#D95C5C',title:'Assinatura Vencida',msg:`"${s.name}" está ${Math.abs(diff)} dias atrasada (${fmtCur(s.value)})`});
  });
  state.monthlyBills.forEach(b=>{ 
    if(b.status !== 'active') return;
    const nextDue = getNextBillDueDate(b.dueDay); 
    const diff=Math.round((nextDue-now)/86400000); 
    if(diff>=0&&diff<=3) alerts.push({icon:'ti-calendar-due',color:'#D95C5C',title:'Conta Mensal Próxima',msg:`"${b.name}" vence em ${diff} dias (${fmtCur(b.value)})`}); 
    else if(diff < 0) alerts.push({icon:'ti-alert-triangle',color:'#D95C5C',title:'Conta Mensal Vencida',msg:`"${b.name}" está ${Math.abs(diff)} dias atrasada (${fmtCur(b.value)})`}); 
  });
  return alerts;
}

function renderTransactions() {
  const search=(document.getElementById('tx-search')||{}).value?.toLowerCase()||'';
  const catFilter=(document.getElementById('tx-cat')||{}).value||'';
  const typeFilter=(document.getElementById('tx-type')||{}).value||'';
  const sort=(document.getElementById('tx-sort')||{}).value||'date-desc';
  const catSel = document.getElementById('tx-cat');
  if(catSel){
    catSel.innerHTML='<option value="">Categoria</option>'+state.settings.categories.map(c=>`<option value="${c}" ${catFilter===c?'selected':''}>${c}</option>`).join('');
  }
  let txs=[...state.transactions];
  if(search) txs=txs.filter(t=>t.desc.toLowerCase().includes(search)||t.cat.toLowerCase().includes(search)||t.tags?.join(' ').toLowerCase().includes(search));
  if(catFilter) txs=txs.filter(t=>t.cat===catFilter);
  if(typeFilter) txs=txs.filter(t=>t.type===typeFilter);
  txs.sort((a,b)=>{
    if(sort==='date-desc') return b.date.localeCompare(a.date);
    if(sort==='date-asc') return a.date.localeCompare(b.date);
    if(sort==='value-desc') return b.value-a.value;
    return a.value-b.value;
  });
  const tbody=document.getElementById('tx-table-body');
  const empty=document.getElementById('tx-empty');
  if(!txs.length){tbody.innerHTML='';empty.style.display='block';return;}
  empty.style.display='none';
  tbody.innerHTML=txs.map(t=>`
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <div style="width:28px;height:28px;border-radius:6px;background:${t.type==='income'?'rgba(22,163,74,0.12)':'rgba(220,38,38,0.12)'};display:flex;align-items:center;justify-content:center">
            <i class="ti ${t.type==='income'?'ti-arrow-down-right':'ti-arrow-up-right'}" style="font-size:13px;color:${t.type==='income'?'var(--green2)':'var(--red2)'}"></i>
          </div>
          <div>
            <div style="font-weight:500;color:var(--text)">${t.desc}</div>
            ${t.tags&&t.tags.length?'<div style="margin-top:2px">'+t.tags.map(tag=>`<span class="tag" style="background:var(--input-bg);color:var(--text3);font-size:10px;margin-right:3px">${tag}</span>`).join('')+'</div>':''}
          </div>
        </div>
      </td>
      <td><span class="tag" style="background:${CAT_COLORS[t.cat]||'#94a3b8'}20;color:${CAT_COLORS[t.cat]||'#94a3b8'}"><span class="category-dot" style="background:${CAT_COLORS[t.cat]||'#94a3b8'}"></span>${t.cat}</span></td>
      <td style="text-transform:capitalize">${formatMethodLabel(t.method)}${t.installment?` • ${t.installment.current}/${t.installment.total}`:''}${t.cardId?` • ${state.cards.find(c=>c.id===t.cardId)?.name||''}`:''}</td>
      <td>${fmtDate(t.date)}</td>
      <td style="font-weight:600;color:${t.type==='income'?'var(--green2)':'var(--red2)'}">
        ${t.type==='income'?'+':'-'}${fmtCur(t.value)}
        ${t.status?`<span class="tag" style="background:${getTxStatusColor(t.status)}20;color:${getTxStatusColor(t.status)};border-radius:999px;padding:2px 8px;font-size:11px;margin-left:8px">${getTxStatusLabel(t.status)}</span>`:''}
      </td>
      <td>
        <div style="display:flex;gap:6px">
          <button class="btn btn-ghost" onclick="editTransaction('${t.id}')" style="padding:4px 8px;height:28px"><i class="ti ti-edit" style="font-size:13px"></i></button>
          <button class="btn btn-danger" onclick="deleteTransaction('${t.id}')" style="padding:4px 8px;height:28px"><i class="ti ti-trash" style="font-size:13px"></i></button>
        </div>
      </td>
    </tr>`).join('');
}

function renderAccounts() {
  const el=document.getElementById('accounts-grid');
  const icons={checking:'ti-building-bank',savings:'ti-piggy-bank',wallet:'ti-wallet',cash:'ti-cash',investment:'ti-trending-up'};
  const labels={checking:'Conta Corrente',savings:'Poupança',wallet:'Carteira',cash:'Dinheiro Físico',investment:'Investimentos'};
  if(!state.accounts.length){el.innerHTML='<div class="empty-state"><i class="ti ti-wallet-off"></i><p>Nenhuma conta criada</p></div>';return;}
  el.innerHTML=state.accounts.map(a=>{
    const txs=state.transactions.filter(t=>t.accountId===a.id || (isTransfer(t) && (t.fromAccountId===a.id || t.toAccountId===a.id)));
    const { income: totalIn, expense: totalOut } = getAccountTotals(a);
    const currentBalance = getAccountBalance(a);
    return `<div class="card" style="border-top:3px solid ${a.color}">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
        <div style="width:40px;height:40px;border-radius:10px;background:${a.color}20;display:flex;align-items:center;justify-content:center">
          <i class="ti ${icons[a.type]||'ti-wallet'}" style="color:${a.color};font-size:20px"></i>
        </div>
        <div>
          <div style="font-size:15px;font-weight:600">${a.name}</div>
          <div style="font-size:11px;color:var(--text3)">${labels[a.type]||a.type}</div>
        </div>
        <button class="btn btn-danger" onclick="deleteAccount('${a.id}')" style="margin-left:auto;padding:4px 8px;height:28px"><i class="ti ti-trash" style="font-size:13px"></i></button>
      </div>
      <div style="font-size:22px;font-weight:700;margin-bottom:12px">${fmtCur(currentBalance)}</div>
      <div style="display:flex;gap:8px">
        <div style="flex:1;padding:8px;background:var(--input-bg);border-radius:8px;text-align:center">
          <div style="font-size:10px;color:var(--text3);margin-bottom:2px">Entradas</div>
          <div style="font-size:12px;font-weight:600;color:var(--green2)">${fmtCur(totalIn)}</div>
        </div>
        <div style="flex:1;padding:8px;background:var(--input-bg);border-radius:8px;text-align:center">
          <div style="font-size:10px;color:var(--text3);margin-bottom:2px">Saídas</div>
          <div style="font-size:12px;font-weight:600;color:var(--red2)">${fmtCur(totalOut)}</div>
        </div>
      </div>
    </div>`;
  }).join('');
}

function renderCards() {
  const el=document.getElementById('cards-grid');
  if(!state.cards.length){el.innerHTML='<div class="empty-state"><i class="ti ti-credit-card-off"></i><p>Nenhum cartão cadastrado</p></div>';return;}
  el.innerHTML=state.cards.map(c=>{
    const used = getCardUsed(c);
    const account = state.accounts.find(a => a.id===c.accountId);
    const accountName = account?.name || 'Nenhuma conta';
    const accountBalance = account ? getAccountBalance(account) : 0;
    const isDebit = c.type==='debit';
    const available = isDebit ? accountBalance - used : (c.limit - used);
    const pct = isDebit ? 0 : Math.min(100, c.limit?used/c.limit*100:0);
    const typeLabel = formatMethodLabel(c.type || 'credit_card');
    return `<div class="card">
      <div style="background:${c.color||'#7c3aed'};border-radius:12px;padding:20px;margin-bottom:16px;position:relative;overflow:hidden">
        <div style="position:absolute;right:-20px;top:-20px;width:100px;height:100px;border-radius:50%;background:rgba(255,255,255,0.05)"></div>
        <div style="position:absolute;right:10px;bottom:-30px;width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,0.05)"></div>
        <div style="font-size:11px;color:rgba(255,255,255,0.6);margin-bottom:12px;letter-spacing:1px">${(c.brand||'').toUpperCase()} • ${typeLabel}</div>
        <div style="font-size:14px;color:rgba(255,255,255,0.8);letter-spacing:4px;margin-bottom:16px">•••• •••• •••• ${c.digits||'0000'}</div>
        <div style="display:flex;justify-content:space-between;align-items:flex-end">
          <div><div style="font-size:10px;color:rgba(255,255,255,0.5)">TITULAR</div><div style="font-size:13px;color:white;font-weight:600">${state.settings.name||'Usuário'}</div></div>
          <div style="font-size:13px;color:white;font-weight:700">${c.name}</div>
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:8px">
        <div><div style="font-size:11px;color:var(--text3)">${isDebit ? 'Saldo da conta' : 'Limite Total'}</div><div style="font-size:15px;font-weight:600">${fmtCur(isDebit ? accountBalance : c.limit)}</div></div>
        <div style="text-align:right"><div style="font-size:11px;color:var(--text3)">Utilizado</div><div style="font-size:15px;font-weight:600;color:${used > (isDebit ? accountBalance : c.limit) ? 'var(--red2)' : used > (isDebit ? accountBalance * 0.8 : c.limit * 0.8) ? 'var(--yellow)' : 'var(--green2)'}">${fmtCur(used)}</div></div>
      </div>
      ${isDebit ? '' : `<div class="progress-bar" style="margin-bottom:8px"><div class="progress-fill" style="width:${pct}%;background:${pct>80?'var(--red)':pct>50?'var(--yellow)':'var(--green)'}"></div></div>`}
      <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text3);margin-bottom:12px">
        <span>${isDebit ? 'Despesas do cartão' : `${pct.toFixed(0)}% utilizado`}</span>
        <span>Disponível: ${fmtCur(available)}</span>
      </div>
      <div style="display:flex;gap:8px;font-size:11px;color:var(--text3)">
        <span style="background:var(--input-bg);padding:4px 8px;border-radius:6px">Conta: ${accountName}</span>
        ${isDebit ? `<span style="background:var(--input-bg);padding:4px 8px;border-radius:6px">Sem vencimento</span>` : `<span style="background:var(--input-bg);padding:4px 8px;border-radius:6px">Fecha dia ${c.close}</span><span style="background:var(--input-bg);padding:4px 8px;border-radius:6px">Vence dia ${c.due}</span>`}
      </div>
      <div style="display:flex;gap:6px;margin-top:12px">
        ${isDebit ? '' : `<button class="btn btn-primary" onclick="openInvoicePaymentModal('${c.id}')" style="flex:1;justify-content:center"><i class="ti ti-receipt"></i>Pagar fatura</button>`}
        <button class="btn btn-ghost" onclick="editCard('${c.id}')" style="flex:1;justify-content:center"><i class="ti ti-edit"></i>Editar</button>
        <button class="btn btn-danger" onclick="deleteCard('${c.id}')" style="padding:7px 12px"><i class="ti ti-trash"></i></button>
      </div>
    </div>`;
  }).join('');
}

function renderGoals() {
  const el=document.getElementById('goals-grid');
  if(!state.goals.length){el.innerHTML='<div class="empty-state"><i class="ti ti-target-off"></i><p>Nenhuma meta criada</p></div>';return;}
  el.innerHTML=state.goals.map(g=>{
    const pct=Math.min(100,(g.current/g.target*100));
    const dl=new Date(g.deadline);
    const daysLeft=Math.round((dl-new Date())/86400000);
    return `<div class="card">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
        <div style="font-size:28px">${g.emoji||'🎯'}</div>
        <div><div style="font-size:15px;font-weight:600">${g.name}</div>
          <div style="font-size:11px;color:var(--text3)">${daysLeft>0?daysLeft+' dias restantes':'Prazo encerrado'}</div>
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:8px">
        <span style="font-size:13px;color:var(--text2)">Progresso</span>
        <span style="font-size:13px;font-weight:700;color:${pct>=100?'var(--green2)':pct>=50?'var(--text2)':'var(--text)'}">${pct.toFixed(0)}%</span>
      </div>
      <div class="progress-bar" style="margin-bottom:8px"><div class="progress-fill" style="width:${pct}%;background:${pct>=100?'var(--green)':pct>=50?'var(--text2)':'var(--yellow)'}"></div></div>
      <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text3);margin-bottom:16px">
        <span>${fmtCur(g.current)} acumulado</span><span>Meta: ${fmtCur(g.target)}</span>
      </div>
      <div style="font-size:12px;color:var(--text3);margin-bottom:14px">Faltam ${fmtCur(Math.max(0,g.target-g.current))}</div>
      <div style="display:flex;gap:6px">
        <button class="btn btn-primary" onclick="openGoalProgressModal('${g.id}')" style="flex:1;justify-content:center"><i class="ti ti-plus"></i>Atualizar</button>
        <button class="btn btn-ghost" onclick="editGoal('${g.id}')" style="padding:7px 10px"><i class="ti ti-edit"></i></button>
        <button class="btn btn-danger" onclick="deleteGoal('${g.id}')" style="padding:7px 10px"><i class="ti ti-trash"></i></button>
      </div>
    </div>`;
  }).join('');
}

function renderReports() {
  const monthSel=document.getElementById('rep-month');
  const yearSel=document.getElementById('rep-year');
  const now=new Date();
  if(monthSel&&!monthSel.options.length){
    MONTHS.forEach((m,i)=>monthSel.add(new Option(m,i)));
    monthSel.value=now.getMonth();
  }
  if(yearSel&&!yearSel.options.length){
    for(let y=now.getFullYear()-2;y<=now.getFullYear();y++) yearSel.add(new Option(y,y));
    yearSel.value=now.getFullYear();
  }
  const month=parseInt((monthSel||{}).value??now.getMonth());
  const year=parseInt((yearSel||{}).value??now.getFullYear());
  const txs=getMonthTxs(month,year);
  const income=txs.filter(t=>t.type==='income').reduce((s,t)=>s+t.value,0);
  const expense=txs.filter(isOperationalExpense).reduce((s,t)=>s+t.value,0);
  const balance=income-expense;
  document.getElementById('rep-stats').innerHTML=`
    <div class="stat-card"><div class="stat-label">Receitas</div><div class="stat-value" style="color:var(--green2)">${fmtCur(income)}</div></div>
    <div class="stat-card"><div class="stat-label">Despesas</div><div class="stat-value" style="color:var(--red2)">${fmtCur(expense)}</div></div>
    <div class="stat-card"><div class="stat-label">Saldo</div><div class="stat-value" style="color:${balance>=0?'var(--green2)':'var(--red2)'}">${fmtCur(balance)}</div></div>
    <div class="stat-card"><div class="stat-label">Transações</div><div class="stat-value">${txs.length}</div></div>
  `;
  const byCat={};
  txs.filter(isOperationalExpense).forEach(t=>{byCat[t.cat]=(byCat[t.cat]||0)+t.value;});
  const sorted=Object.entries(byCat).sort((a,b)=>b[1]-a[1]);
  const total=sorted.reduce((s,c)=>s+c[1],0)||1;
  document.getElementById('rep-pie').innerHTML=sorted.length?sorted.map(([cat,val])=>{
    const pct=(val/total*100).toFixed(1);
    const col=CAT_COLORS[cat]||'#94a3b8';
    return `<div style="margin-bottom:10px">
      <div style="display:flex;justify-content:space-between;margin-bottom:4px;font-size:12px">
        <span style="color:var(--text2)"><span class="category-dot" style="background:${col}"></span>${cat}</span>
        <span style="color:var(--text3)">${pct}% · ${fmtCur(val)}</span>
      </div>
      <div class="progress-bar"><div class="progress-fill" style="width:${pct}%;background:${col}"></div></div>
    </div>`;}).join(''):'<div class="empty-state"><p>Sem despesas no período</p></div>';
  const sorted2=[...txs].sort((a,b)=>b.date.localeCompare(a.date));
  document.getElementById('rep-table').innerHTML=sorted2.length?`<table class="table"><thead><tr><th>Data</th><th>Desc</th><th>Cat</th><th>Valor</th></tr></thead><tbody>${sorted2.map(t=>`<tr><td>${fmtDate(t.date)}</td><td>${t.desc}</td><td><span class="tag" style="background:${CAT_COLORS[t.cat]||'#94a3b8'}20;color:${CAT_COLORS[t.cat]||'#94a3b8'}">${t.cat}</span></td><td style="color:${t.type==='income'?'var(--green2)':'var(--red2)'};font-weight:600">${t.type==='income'?'+':'-'}${fmtCur(t.value)}</td></tr>`).join('')}</tbody></table>`:'<div class="empty-state"><p>Sem transações no período</p></div>';
}

function renderAlerts() {
  const alerts=getAlerts();
  const el=document.getElementById('alerts-list');
  if(!alerts.length){el.innerHTML='<div class="empty-state"><i class="ti ti-bell-off"></i><p>Nenhum alerta ativo</p></div>';return;}
  el.innerHTML=alerts.map(a=>`
    <div class="alert-item" style="background:${a.color}12;border:1px solid ${a.color}25;margin-bottom:10px">
      <div style="width:40px;height:40px;border-radius:10px;background:${a.color}20;display:flex;align-items:center;justify-content:center;flex-shrink:0">
        <i class="ti ${a.icon}" style="color:${a.color};font-size:20px"></i>
      </div>
      <div><div style="font-size:14px;font-weight:600;margin-bottom:2px">${a.title}</div><div style="font-size:13px;color:var(--text2)">${a.msg}</div></div>
    </div>`).join('');
}

function renderSettings() {
  document.getElementById('s-name').value=state.settings.name||'';
  document.getElementById('s-currency').value=state.settings.currency||'BRL';
  document.getElementById('cats-list').innerHTML=state.settings.categories.map((c,i)=>`
    <div style="display:flex;align-items:center;justify-content:space-between;padding:6px 10px;background:var(--input-bg);border-radius:6px;margin-bottom:6px">
      <span style="font-size:13px;display:flex;align-items:center;gap:6px"><span class="category-dot" style="background:${CAT_COLORS[c]||'#94a3b8'}"></span>${c}</span>
      ${i>=CATS_DEFAULT.length?`<button class="btn btn-danger" onclick="removeCategory(${i})" style="padding:2px 6px;height:22px;font-size:11px"><i class="ti ti-x"></i></button>`:''}
    </div>`).join('');
}

function openAddModal(id) {
  state.editingTx=id||null;
  const modal=document.getElementById('modal-add');
  document.getElementById('modal-add-title').textContent=id?'Editar Transação':'Nova Transação';
  const catSel=document.getElementById('tx-cat-modal');
  catSel.innerHTML=state.settings.categories.map(c=>`<option value="${c}">${c}</option>`).join('');
  const cardSel=document.getElementById('tx-card-modal');
  cardSel.innerHTML='<option value="">Nenhum cartão</option>'+state.cards.map(c=>`<option value="${c.id}">${c.name}</option>`).join('');
  const accSel=document.getElementById('tx-account-modal');
  accSel.innerHTML='<option value="">Selecionar conta</option>'+state.accounts.map(a=>`<option value="${a.id}">${a.name}</option>`).join('');
  const fromAccSel=document.getElementById('tx-from-account-modal');
  const toAccSel=document.getElementById('tx-to-account-modal');
  if(fromAccSel && toAccSel) {
    fromAccSel.innerHTML=accSel.innerHTML;
    toAccSel.innerHTML=accSel.innerHTML;
  }
  const today=fmt(new Date());
  if(id){
    const t=state.transactions.find(t=>t.id===id);
    if(t){
      setType(t.type);
      document.getElementById('tx-desc').value=t.desc;
      document.getElementById('tx-value').value=t.value;
      document.getElementById('tx-date').value=t.date;
      catSel.value=t.cat;
      document.getElementById('tx-method').value=t.method||'pix';
      document.getElementById('tx-status').value=t.status||'paid';
      cardSel.value=t.cardId||'';
      if(cardSel.value) updateTransactionCardType();
      accSel.value=t.accountId||'';
      if(fromAccSel) fromAccSel.value=t.fromAccountId||'';
      if(toAccSel) toAccSel.value=t.toAccountId||'';
      document.getElementById('tx-installment-current').value=t.installment?.current||'';
      document.getElementById('tx-installment-total').value=t.installment?.total||'';
      document.getElementById('tx-installment-group').value=t.installment?.groupId||'';
      document.getElementById('tx-tags').value=(t.tags||[]).join(', ');
    }
  } else {
    setType('expense');
    document.getElementById('tx-desc').value='';
    document.getElementById('tx-value').value='';
    document.getElementById('tx-date').value=today;
    document.getElementById('tx-method').value='pix';
    document.getElementById('tx-status').value='paid';
    cardSel.value='';
    accSel.value='';
    if(fromAccSel) fromAccSel.value='';
    if(toAccSel) toAccSel.value='';
    document.getElementById('tx-installment-current').value='';
    document.getElementById('tx-installment-total').value='';
    document.getElementById('tx-installment-group').value='';
    document.getElementById('tx-tags').value='';
  }
  updateTransactionFields();
  modal.classList.add('active');
}

function setType(type) {
  state.txType=type;
  document.getElementById('type-income').style.cssText=type==='income'?'flex:1;background:rgba(16,185,129,0.2);color:var(--green2);border:1px solid var(--green)':'flex:1;background:var(--input-bg);color:var(--text2);border:1px solid var(--border2)';
  document.getElementById('type-expense').style.cssText=type==='expense'?'flex:1;background:rgba(239,68,68,0.2);color:var(--red2);border:1px solid var(--red)':'flex:1;background:var(--input-bg);color:var(--text2);border:1px solid var(--border2)';
}

function saveTransaction() {
  const desc=document.getElementById('tx-desc').value.trim();
  const value=parseFloat(document.getElementById('tx-value').value);
  const date=document.getElementById('tx-date').value;
  const cat=document.getElementById('tx-cat-modal').value;
  let method=normalizeMethod(document.getElementById('tx-method').value);
  const status=document.getElementById('tx-status').value;
  const cardId=document.getElementById('tx-card-modal').value;
  let accountId=document.getElementById('tx-account-modal').value;
  if(cardId) {
    const card=state.cards.find(c=>c.id===cardId);
    if(card) {
      if(card.type==='debit') {
        method = 'debit';
        if(card.accountId) accountId = card.accountId;
      } else if(card.type==='credit_card') {
        method = 'credit_card';
        accountId = '';
      }
    }
  }
  const fromAccountId=document.getElementById('tx-from-account-modal')?.value||'';
  const toAccountId=document.getElementById('tx-to-account-modal')?.value||'';
  const installmentCurrent=parseInt(document.getElementById('tx-installment-current').value,10)||0;
  const installmentTotal=parseInt(document.getElementById('tx-installment-total').value,10)||0;
  const installmentGroup=document.getElementById('tx-installment-group').value.trim();
  const tags=document.getElementById('tx-tags').value.split(',').map(t=>t.trim()).filter(Boolean);
  if(!desc||!Number.isFinite(value)||value<=0||!date){alert('Informe descrição, valor positivo e data.');return;}
  if(state.txType === 'expense' && method !== 'credit_card' && method !== 'debit' && method !== 'bank_transfer' && !accountId) {
    alert('Selecione a conta que será debitada.');
    return;
  }
  if(state.txType === 'expense' && (method === 'credit_card' || method === 'debit') && !cardId) {
    alert('Selecione o cartão usado na despesa.');
    return;
  }

  const hasCardLimitWarning = state.txType === 'expense' && method === 'credit_card' && shouldConfirmCardLimit(cardId, value, state.editingTx);
  if (hasCardLimitWarning) {
    const card = state.cards.find(c => c.id === cardId);
    const warningText = card ? `O cartão "${card.name}" ultrapassou o limite disponível (${fmtCur(Number(card.limit) - Math.max(0, getCardUsed(card) - (state.editingTx ? state.transactions.find(t => t.id === state.editingTx)?.value || 0 : 0)))} restante). Deseja cadastrar mesmo assim?` : 'O limite do cartão foi ultrapassado. Deseja cadastrar mesmo assim?';
    if (!confirm(warningText)) return;
  }

  const installment = installmentGroup && installmentCurrent && installmentTotal ? {current: installmentCurrent, total: installmentTotal, groupId: installmentGroup} : null;
  const tx = {
    id: state.editingTx || uid(),
    type: state.txType,
    desc,
    value,
    date,
    cat,
    method,
    cardId: cardId||'',
    accountId: accountId||'',
    fromAccountId: fromAccountId||'',
    toAccountId: toAccountId||'',
    tags,
    status: status || (method==='credit_card' ? 'pending' : 'paid'),
    installment,
    subscriptionId: null,
    monthlyBillId: null
  };
  if(state.editingTx){
    const idx=state.transactions.findIndex(t=>t.id===state.editingTx);
    if(idx>=0){
      state.transactions[idx] = {...state.transactions[idx], ...tx};
    }
  } else {
    state.transactions.push(tx);
    if(installment && installment.groupId && installment.total > installment.current) {
      generateInstallmentTransactions(tx);
    }
  }
  save(); closeModal('modal-add');
  renderDashboard(); renderTransactions();
}

function editTransaction(id){openAddModal(id);}
function deleteTransaction(id){
  if(confirm('Excluir esta transação?')){
    state.transactions=state.transactions.filter(t=>t.id!==id);
    save(); renderTransactions(); renderDashboard();
  }
}

function slugifyBankName(value) {
  return (value || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function getBankColorByName(value) {
  const normalized = slugifyBankName(value || '');
  const bankMeta = ACCOUNT_BANKS.find(bank => bank.value === normalized || bank.label.toLowerCase() === (value || '').trim().toLowerCase());
  if (bankMeta && BANK_COLOR_MAP[bankMeta.value]) return BANK_COLOR_MAP[bankMeta.value];
  if (BANK_COLOR_MAP[normalized]) return BANK_COLOR_MAP[normalized];
  return BANK_COLOR_MAP['custom-bank'];
}

function resolveBankMeta(value) {
  const bankName = (value || '').trim();
  if (!bankName) return { label: '', value: '', color: BANK_COLOR_MAP['custom-bank'] };
  const exact = ACCOUNT_BANKS.find(bank => 
    bank.value.toLowerCase() === bankName.toLowerCase() ||
    bank.label.toLowerCase() === bankName.toLowerCase() ||
    bank.label.toLowerCase().includes(bankName.toLowerCase()) ||
    bankName.toLowerCase().includes(bank.label.toLowerCase())
  );
  if (exact) return { label: exact.label, value: exact.value, color: BANK_COLOR_MAP[exact.value] || BANK_COLOR_MAP['custom-bank'] };
  return { label: bankName, value: slugifyBankName(bankName) || 'custom-bank', color: getBankColorByName(bankName) };
}

function populateBankSelects(){
  const datalist = document.getElementById('bank-suggestions');
  if (!datalist) return;
  const usedBanks = [
    ...state.accounts.map(a => a.bank).filter(Boolean),
    ...state.cards.map(c => c.bank).filter(Boolean)
  ];
  const options = [...ACCOUNT_BANKS, ...usedBanks.map(name => ({ value: slugifyBankName(name), label: name }))]
    .filter((bank, index, arr) => {
      const normalized = bank.label.trim();
      return normalized && arr.findIndex(item => item.label.trim().toLowerCase() === normalized.toLowerCase()) === index;
    })
    .map(bank => `<option value="${bank.label}"></option>`)
    .join('');
  datalist.innerHTML = options;
}

function applyBankColorToAccount(bankValue) {
  const bankMeta = resolveBankMeta(bankValue || '');
  const color = bankMeta.color || '#2563eb';
  state.accColor = color;
  const swatches = document.querySelectorAll('#acc-colors div');
  swatches.forEach(el => {
    const isMatch = el.style.background.toLowerCase() === color.toLowerCase();
    el.style.border = isMatch ? '2px solid white' : '2px solid transparent';
  });
}

function applyBankColorToCard(bankValue) {
  if (state.cardColorCustomized) return;
  const bankMeta = resolveBankMeta(bankValue || '');
  const color = bankMeta.color || '#7c3aed';
  state.cardColor = color;
  const swatches = document.querySelectorAll('#card-colors div');
  swatches.forEach(el => {
    const isMatch = el.style.background.toLowerCase() === color.toLowerCase();
    el.style.border = isMatch ? '2px solid white' : '2px solid transparent';
  });
}

function resetCardColorSelection() {
  state.cardColorCustomized = false;
  state.cardColor = '#7c3aed';
  const swatches = document.querySelectorAll('#card-colors div');
  swatches.forEach(el => {
    el.style.border = '2px solid transparent';
  });
  if (swatches[0]) swatches[0].style.border = '2px solid white';
}

function renderCardColorPalette() {
  const container = document.getElementById('card-colors');
  if (!container) return;

  const columns = CARD_COLOR_PALETTE.map((columnColors, columnIndex) => `
    <div class="card-color-palette-column">
      ${columnColors.map(color => `
        <div
          class="card-color-swatch"
          data-color="${color.toLowerCase()}"
          style="background:${color}"
          onclick="selectCardColor('${color}', this)"
        ></div>
      `).join('')}
    </div>
  `).join('');

  container.style.display = 'grid';
  container.innerHTML = columns;

  const selectedColor = (state.cardColor || '#7c3aed').toLowerCase();
  const matched = container.querySelector(`[data-color="${selectedColor}"]`);
  if (matched) matched.style.border = '2px solid white';
}

function syncCardBankFromAccount() {
  const accountSel = document.getElementById('card-account');
  const bankHidden = document.getElementById('card-bank');
  const bankReadout = document.getElementById('card-bank-readout');
  const account = state.accounts.find(a => a.id === accountSel?.value) || null;
  const resolvedBank = account ? resolveBankMeta(account.bank || '') : { label: '', value: '', color: '#7c3aed' };

  if (bankHidden) bankHidden.value = account ? (account.bank || '') : '';
  if (bankReadout) bankReadout.textContent = `Banco: ${resolvedBank.label || '—'}`;

  if (account) {
    state.cardColor = account.color || resolvedBank.color || '#7c3aed';
    state.cardColorCustomized = false;
    renderCardColorPalette();
  } else if (!state.cardColorCustomized) {
    state.cardColor = '#7c3aed';
    renderCardColorPalette();
  }
}

function openAccountModal(){
  populateBankSelects();
  document.getElementById('acc-name').value='';
  document.getElementById('acc-balance').value='';
  document.getElementById('acc-bank').value='';
  state.accColor = '#2563eb';
  document.getElementById('modal-account').classList.add('active');
}

function selectColor(col,el){
  state.accColor = col;
}
function selectCardColor(col,el){
  state.cardColor = col;
  state.cardColorCustomized = true;
  document.querySelectorAll('#card-colors div').forEach(d => {
    d.style.border = '2px solid transparent';
  });
  if (el) el.style.border = '2px solid white';
}

function refreshCardAccountOptions(){
  const accountSel = document.getElementById('card-account');
  if (!accountSel) return;
  accountSel.innerHTML = '<option value="">Selecionar conta</option>' + state.accounts.map(a => `<option value="${a.id}">${a.name}</option>`).join('');
  const currentValue = accountSel.dataset.value || '';
  if (state.accounts.some(a => a.id === currentValue)) {
    accountSel.value = currentValue;
  } else {
    accountSel.value = '';
  }
  delete accountSel.dataset.value;
  syncCardBankFromAccount();
}

function getAccountTypeLabel(type) {
  const labels = {
    checking: 'Conta Corrente',
    savings: 'Poupança',
    wallet: 'Carteira',
    cash: 'Dinheiro Físico',
    investment: 'Investimentos'
  };
  return labels[type] || 'Conta';
}

function saveAccount(){
  const customName=document.getElementById('acc-name').value.trim();
  const balance=parseFloat(document.getElementById('acc-balance').value)||0;
  const type=document.getElementById('acc-type').value;
  const bankMeta = resolveBankMeta(document.getElementById('acc-bank').value);
  const generatedName = customName || `${bankMeta.label || 'Conta'} • ${getAccountTypeLabel(type)}`;
  if(balance < 0){alert('O saldo inicial não pode ser negativo.');return;}
  state.accColor = bankMeta.color || state.accColor || '#2563eb';
  state.accounts.push({id:uid(),name:generatedName,type,balance,color:state.accColor, bank: bankMeta.label, bankKey: bankMeta.value});
  save(); closeModal('modal-account'); renderAccounts(); renderDashboard();
}
function deleteAccount(id){
  if(confirm('Excluir esta conta?')){state.accounts=state.accounts.filter(a=>a.id!==id);save();renderAccounts();}
}

function openCardModal(){
  populateBankSelects();
  renderCardColorPalette();
  const accountSel=document.getElementById('card-account');
  const bankHidden=document.getElementById('card-bank');
  if (bankHidden) bankHidden.value='';
  if (accountSel) accountSel.innerHTML = '<option value="">Selecionar conta</option>' + state.accounts.map(a => `<option value="${a.id}">${a.name}</option>`).join('');
  document.getElementById('card-name').value='';
  document.getElementById('card-digits').value='';
  document.getElementById('card-limit').value='';
  document.getElementById('card-close').value='';
  document.getElementById('card-due').value='';
  document.getElementById('card-type').value='credit_card';
  if (accountSel) accountSel.value='';
  const bankReadout = document.getElementById('card-bank-readout');
  if (bankReadout) bankReadout.textContent = 'Banco: —';
  state.cardColor='#7c3aed';
  state.cardColorCustomized = false;
  renderCardColorPalette();
  state.editingCard = null;
  toggleCardDueRow();
  document.getElementById('modal-card').classList.add('active');
}

function saveCard(){
  const name=document.getElementById('card-name').value.trim();
  const digits=document.getElementById('card-digits').value.trim();
  const limit=parseFloat(document.getElementById('card-limit').value)||0;
  const close=parseInt(document.getElementById('card-close').value)||10;
  const type=document.getElementById('card-type').value;
  const due = type==='debit' ? null : (parseInt(document.getElementById('card-due').value)||20);
  const brand=document.getElementById('card-brand').value;
  const accountId=document.getElementById('card-account').value;
  const account = state.accounts.find(a => a.id === accountId) || null;
  const bankMeta = account ? resolveBankMeta(account.bank || '') : resolveBankMeta(document.getElementById('card-bank').value);
  if(!name){alert('Digite o nome do cartão');return;}
  if(!accountId){alert('Selecione a conta vinculada ao cartão');return;}
  if(!bankMeta.label){alert('A conta vinculada precisa ter um banco informado');return;}
  if(type === 'credit_card' && limit <= 0){alert('Informe um limite positivo para o cartão de crédito.');return;}
  const effectiveCardColor = state.cardColorCustomized ? state.cardColor : (account?.color || bankMeta.color || state.cardColor || '#7c3aed');
  state.cardColor = effectiveCardColor;
  state.cardColorCustomized = false;
  const cardData = {id: state.editingCard || uid(),name,digits,limit:type==='debit'?0:limit,used:0,close:type==='debit'?null:close,due:type==='debit'?null:due,brand,color:state.cardColor,type,accountId,bank: bankMeta.label, bankKey: bankMeta.value};
  if(state.editingCard){
    const idx=state.cards.findIndex(c=>c.id===state.editingCard);
    if(idx>=0){
      state.cards[idx] = {...state.cards[idx],...cardData};
    }
    state.editingCard = null;
  } else {
    state.cards.push(cardData);
  }
  save(); closeModal('modal-card'); renderCards();
}
function deleteCard(id){if(confirm('Excluir este cartão?')){state.cards=state.cards.filter(c=>c.id!==id);save();renderCards();}}

function openInvoicePaymentModal(cardId) {
  const card = state.cards.find(c => c.id === cardId);
  if(!card || card.type !== 'credit_card') {
    alert('Selecione um cartão de crédito válido.');
    return;
  }
  const now = new Date();
  const period = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
  const cardSelect = document.getElementById('invoice-card-id');
  const accountSelect = document.getElementById('invoice-account-id');
  cardSelect.innerHTML = state.cards.filter(c => c.type === 'credit_card')
    .map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  accountSelect.innerHTML = state.accounts
    .map(a => `<option value="${a.id}">${a.name}</option>`).join('');
  cardSelect.value = cardId;
  document.getElementById('invoice-period').value = period;
  document.getElementById('invoice-payment-title').textContent = `Pagar fatura - ${card.name}`;
  document.getElementById('modal-invoice-payment').classList.add('active');
  updateInvoicePaymentAmount();
}

function updateInvoicePaymentAmount() {
  const cardId = document.getElementById('invoice-card-id').value;
  const period = document.getElementById('invoice-period').value;
  const amount = getCreditInvoiceTotal(cardId, period);
  document.getElementById('invoice-amount').value = amount.toFixed(2);
  const card = state.cards.find(c => c.id === cardId);
  document.getElementById('invoice-payment-summary').textContent = card
    ? `Fatura de ${card.name}: ${fmtCur(amount)}. Após o pagamento, esse valor será debitado da conta e liberará o limite do cartão.`
    : 'Selecione um cartão de crédito.';
}

function saveInvoicePayment() {
  const cardId = document.getElementById('invoice-card-id').value;
  const accountId = document.getElementById('invoice-account-id').value;
  const period = document.getElementById('invoice-period').value;
  const value = Number(document.getElementById('invoice-amount').value);
  const card = state.cards.find(c => c.id === cardId);
  const account = state.accounts.find(a => a.id === accountId);
  if(!card || card.type !== 'credit_card') { alert('Selecione um cartão de crédito válido.'); return; }
  if(!account) { alert('Selecione a conta que pagará a fatura.'); return; }
  if(!period || !value || value <= 0) { alert('Esta fatura não possui valor pendente.'); return; }
  if(getCreditInvoiceTotal(cardId, period) !== Number(value.toFixed(2))) {
    alert('O valor da fatura mudou. Atualize o período e tente novamente.');
    updateInvoicePaymentAmount();
    return;
  }
  const duplicate = state.transactions.some(t =>
    isCardPayment(t) && t.cardId === cardId && t.cardInvoicePeriod === period
  );
  if(duplicate) { alert('Esta fatura já foi paga para o período selecionado.'); return; }
  state.transactions.push({
    id: uid(),
    type: 'expense',
    desc: `Pagamento da fatura - ${card.name}`,
    value,
    date: fmt(new Date()),
    cat: 'Cartão de Crédito',
    method: 'bank_transfer',
    cardId,
    accountId,
    fromAccountId: '',
    toAccountId: '',
    tags: ['fatura', 'cartao'],
    status: 'paid',
    installment: null,
    subscriptionId: null,
    monthlyBillId: null,
    cardPayment: true,
    cardInvoicePeriod: period
  });
  save();
  closeModal('modal-invoice-payment');
  renderCards();
  renderAccounts();
  renderTransactions();
  renderDashboard();
}
function editCard(id){
  const c=state.cards.find(c=>c.id===id);
  if(!c)return;
  openCardModal();
  setTimeout(()=>{
    document.getElementById('card-name').value=c.name;
    document.getElementById('card-digits').value=c.digits;
    document.getElementById('card-limit').value=c.limit;
    document.getElementById('card-close').value=c.close;
    document.getElementById('card-due').value=c.due || '';
    document.getElementById('card-brand').value=c.brand;
    document.getElementById('card-type').value=c.type||'credit_card';
    document.getElementById('card-account').dataset.value = c.accountId || '';
    refreshCardAccountOptions();
    document.getElementById('card-account').value = c.accountId || '';
    syncCardBankFromAccount();
    state.cardColor = c.color || state.cardColor;
    state.cardColorCustomized = c.color && c.color !== resolveBankMeta(state.accounts.find(a => a.id === c.accountId)?.bank || '').color;
    renderCardColorPalette();
    toggleCardDueRow();
    state.editingCard=id;
  },50);
}

function openGoalModal(){
  state.editingGoal=null;
  document.getElementById('goal-modal-title').textContent = GOAL_MODAL_NEW_TITLE;
  document.getElementById('goal-name').value='';
  document.getElementById('goal-emoji').value='🎯';
  document.getElementById('goal-target').value='';
  document.getElementById('goal-current').value='';
  document.getElementById('goal-deadline').value='';
  document.getElementById('modal-goal').classList.add('active');
}
function editGoal(id){
  const g=state.goals.find(g=>g.id===id);
  if(!g)return;
  state.editingGoal=id;
  document.getElementById('goal-modal-title').textContent='Editar Meta';
  document.getElementById('goal-name').value=g.name;
  document.getElementById('goal-emoji').value=g.emoji||'🎯';
  document.getElementById('goal-target').value=g.target;
  document.getElementById('goal-current').value=g.current;
  document.getElementById('goal-deadline').value=g.deadline;
  document.getElementById('modal-goal').classList.add('active');
}
function saveGoal(){
  const name=document.getElementById('goal-name').value.trim();
  const emoji=document.getElementById('goal-emoji').value.trim()||'🎯';
  const target=parseFloat(document.getElementById('goal-target').value)||0;
  const current=parseFloat(document.getElementById('goal-current').value)||0;
  const deadline=document.getElementById('goal-deadline').value;
  if(!name||!target){alert('Preencha nome e valor alvo');return;}
  if(state.editingGoal){
    const idx=state.goals.findIndex(g=>g.id===state.editingGoal);
    if(idx>=0) state.goals[idx]={...state.goals[idx],name,emoji,target,current,deadline};
  } else {
    state.goals.push({id:uid(),name,emoji,target,current,deadline});
  }
  save(); closeModal('modal-goal'); renderGoals();
  if(document.getElementById('page-dashboard').classList.contains('active')) renderDashboard();
}
function deleteGoal(id){if(confirm('Excluir esta meta?')){state.goals=state.goals.filter(g=>g.id!==id);save();renderGoals();}}
function openGoalProgressModal(id){
  state.selectedGoalId=id;
  const g=state.goals.find(g=>g.id===id);
  document.getElementById('goal-progress-val').value=g?g.current:'';
  document.getElementById('modal-goal-progress').classList.add('active');
}
function updateGoalProgress(){
  const val=parseFloat(document.getElementById('goal-progress-val').value)||0;
  const idx=state.goals.findIndex(g=>g.id===state.selectedGoalId);
  if(idx>=0) state.goals[idx].current=val;
  save(); closeModal('modal-goal-progress'); renderGoals();
}

function renderSubscriptions(){
  const el=document.getElementById('subscriptions-table-body');
  const empty=document.getElementById('subscriptions-empty');
  if(!state.subscriptions.length){el.innerHTML='';empty.style.display='block';return;}
  empty.style.display='none';
  el.innerHTML=state.subscriptions.map(s=>{
    const statusColors={active:'var(--green2)',paused:'var(--yellow)',cancelled:'var(--red2)'};
    const statusLabels={active:'Ativa',paused:'Pausada',cancelled:'Cancelada'};
    const dueDate = getSubscriptionNextDueDate(s);
    const daysUntilDue=Math.ceil((dueDate-new Date())/86400000);
    return `<tr>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <div style="width:28px;height:28px;border-radius:6px;background:${statusColors[s.status]||'var(--text3)'}20;display:flex;align-items:center;justify-content:center">
            <i class="ti ti-calendar-repeat" style="font-size:13px;color:${statusColors[s.status]||'var(--text3)'}"></i>
          </div>
          <div>
            <div style="font-weight:500;color:var(--text)">${s.name}</div>
            ${s.notes?'<div style="margin-top:2px;font-size:11px;color:var(--text3)">'+s.notes+'</div>':''}
          </div>
        </div>
      </td>
      <td><span class="tag" style="background:${CAT_COLORS[s.category]||'#94a3b8'}20;color:${CAT_COLORS[s.category]||'#94a3b8'}">${s.category}</span></td>
      <td>${s.cardId?state.cards.find(c=>c.id===s.cardId)?.name||'--':'Nenhum'}</td>
      <td style="font-weight:600;color:var(--red2)">${fmtCur(s.value)}</td>
      <td>Dia ${s.dueDay}${daysUntilDue<=7&&s.status==='active'?' <span style="color:var(--yellow);font-size:11px">('+daysUntilDue+' dias)</span>':''}</td>
      <td><span class="tag" style="background:${statusColors[s.status]||'var(--text3)'}20;color:${statusColors[s.status]||'var(--text3)'}">${statusLabels[s.status]}</span></td>
      <td>
        <div style="display:flex;gap:6px">
          <button class="btn btn-ghost" onclick="editSubscription('${s.id}')" style="padding:4px 8px;height:28px"><i class="ti ti-edit" style="font-size:13px"></i></button>
          <button class="btn btn-danger" onclick="deleteSubscription('${s.id}')" style="padding:4px 8px;height:28px"><i class="ti ti-trash" style="font-size:13px"></i></button>
        </div>
      </td>
    </tr>`;}).join('');

  // Update summary cards
  const activeSubs=state.subscriptions.filter(s=>s.status==='active');
  const totalMonthly=activeSubs.reduce((s,sub)=>s+sub.value,0);
  document.getElementById('sub-total-monthly').textContent=fmtCur(totalMonthly);

  // Next due date
  const today=new Date();
  let nextDue=null; let minDays=Infinity;
  activeSubs.forEach(s=>{
    const dueDate = getSubscriptionNextDueDate(s);
    const daysUntilDue = Math.ceil((dueDate - today) / 86400000);
    if(daysUntilDue < minDays){minDays = daysUntilDue; nextDue = s;}
  });
  if(nextDue){
    document.getElementById('sub-next-due').textContent=`Dia ${nextDue.dueDay}`;
    document.getElementById('sub-next-due').nextElementSibling.querySelector('span').textContent=minDays+' dias';
  } else {
    document.getElementById('sub-next-due').textContent='--';
    document.getElementById('sub-next-due').nextElementSibling.querySelector('span').textContent='Nenhum';
  }
}

function openSubscriptionModal(){
  state.editingSubscription=null;
  document.getElementById('subscription-modal-title').textContent='Nova Assinatura';
  
  // Populate card options
  const cardSelect = document.getElementById('sub-card-id');
  cardSelect.innerHTML = '<option value="">Selecionar cartão</option>' + 
    state.cards.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  const accountSelect = document.getElementById('sub-account-id');
  accountSelect.innerHTML = '<option value="">Selecionar conta</option>' +
    state.accounts.map(a => `<option value="${a.id}">${a.name}</option>`).join('');
  
  document.getElementById('sub-name').value='';
  document.getElementById('sub-value').value='';
  document.getElementById('sub-due-day').value='1';
  document.getElementById('sub-category').value='Streaming';
  document.getElementById('sub-card-id').value='';
  document.getElementById('sub-account-id').value='';
  document.getElementById('sub-status').value='active';
  document.getElementById('sub-notes').value='';
  document.getElementById('modal-subscription').classList.add('active');
}

function editSubscription(id){
  const s=state.subscriptions.find(s=>s.id===id);
  if(!s)return;
  state.editingSubscription=id;
  document.getElementById('subscription-modal-title').textContent='Editar Assinatura';
  
  // Populate card options
  const cardSelect = document.getElementById('sub-card-id');
  cardSelect.innerHTML = '<option value="">Selecionar cartão</option>' + 
    state.cards.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  const accountSelect = document.getElementById('sub-account-id');
  accountSelect.innerHTML = '<option value="">Selecionar conta</option>' +
    state.accounts.map(a => `<option value="${a.id}">${a.name}</option>`).join('');
  
  document.getElementById('sub-name').value=s.name;
  document.getElementById('sub-value').value=s.value;
  document.getElementById('sub-due-day').value=s.dueDay;
  document.getElementById('sub-category').value=s.category;
  document.getElementById('sub-card-id').value=s.cardId||'';
  document.getElementById('sub-account-id').value=s.accountId||'';
  document.getElementById('sub-status').value=s.status;
  document.getElementById('sub-notes').value=s.notes||'';
  document.getElementById('modal-subscription').classList.add('active');
}

function saveSubscription(){
  const name=document.getElementById('sub-name').value.trim();
  const value=parseFloat(document.getElementById('sub-value').value);
  const dueDay=parseInt(document.getElementById('sub-due-day').value);
  const category=document.getElementById('sub-category').value;
  const cardId=document.getElementById('sub-card-id').value;
  const accountId=document.getElementById('sub-account-id').value;
  const status=document.getElementById('sub-status').value;
  const notes=document.getElementById('sub-notes').value.trim();
  if(!name||!Number.isFinite(value)||value<=0||isNaN(dueDay)||dueDay<1||dueDay>31){alert('Informe nome, valor positivo e um vencimento entre 1 e 31.');return;}
  const selectedCard = state.cards.find(c => c.id === cardId);
  if(!cardId && !accountId){alert('Selecione um cartão ou uma conta de pagamento.');return;}
  if(selectedCard?.type === 'debit' && !selectedCard.accountId){alert('O cartão de débito precisa estar vinculado a uma conta.');return;}
  const payload = { name, value, dueDay, category, cardId, accountId, status, notes };
  const nextDate = getSubscriptionNextDueDate(payload);
  if(state.editingSubscription){
    const idx=state.subscriptions.findIndex(s=>s.id===state.editingSubscription);
    if(idx>=0) state.subscriptions[idx]={...state.subscriptions[idx], ...payload, nextDate};
  } else {
    state.subscriptions.push({id:uid(), ...payload, nextDate});
  }
  syncRecurringTransactions();
  save(); closeModal('modal-subscription'); renderSubscriptions(); renderDashboard(); renderCards();
}

function deleteSubscription(id){
  if(confirm('Excluir esta assinatura?')){state.subscriptions=state.subscriptions.filter(s=>s.id!==id);save();renderSubscriptions();}
}

// MONTHLY BILLS FUNCTIONS
function renderMonthlyBills(){
  const container = document.getElementById('monthlybills-list');
  const empty = document.getElementById('monthlybills-empty');
  
  if(state.monthlyBills.length === 0){
    container.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  
  empty.style.display = 'none';
  container.innerHTML = state.monthlyBills.map(bill => {
    const card = state.cards.find(c => c.id === bill.cardId);
    const account = state.accounts.find(a => a.id === bill.accountId);
    const nextDue = getNextBillDueDate(bill.dueDay);
    const daysUntilDue = Math.ceil((nextDue - new Date()) / (1000 * 60 * 60 * 24));
    const isOverdue = daysUntilDue < 0;
    const isDueSoon = daysUntilDue >= 0 && daysUntilDue <= 3;
    
    return `
      <div class="card" style="margin-bottom:12px">
        <div class="card-header">
          <div style="display:flex;align-items:center;gap:8px">
            <i class="ti ti-calendar-due" style="color:${bill.status === 'active' ? '#9AA1A8' : '#94a3b8'}"></i>
            <div>
              <h4 style="margin:0;font-size:16px">${bill.name}</h4>
              <small style="color:var(--text2)">${bill.category} • ${card ? card.name : account ? account.name : 'Nenhum cartão'}</small>
            </div>
          </div>
          <div class="card-actions">
            <button class="btn btn-ghost btn-sm" onclick="markBillAsPaid('${bill.id}')" title="Marcar como pago">
              <i class="ti ti-check"></i>
            </button>
            <button class="btn btn-ghost btn-sm" onclick="editMonthlyBill('${bill.id}')" title="Editar">
              <i class="ti ti-edit"></i>
            </button>
            <button class="btn btn-ghost btn-sm" onclick="deleteMonthlyBill('${bill.id}')" title="Excluir">
              <i class="ti ti-trash"></i>
            </button>
          </div>
        </div>
        <div class="card-content">
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:12px">
            <div>
              <small style="color:var(--text2)">Valor Estimado</small>
              <div style="font-weight:600;color:var(--text)">${fmtCur(bill.value)}</div>
            </div>
            <div>
              <small style="color:var(--text2)">Vence dia</small>
              <div style="font-weight:600;color:var(--text)">${bill.dueDay}</div>
            </div>
            <div>
              <small style="color:var(--text2)">Status</small>
              <div style="font-weight:600;color:${bill.status === 'active' ? '#10b981' : '#ef4444'}">${bill.status === 'active' ? 'Ativa' : 'Inativa'}</div>
            </div>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div>
              <small style="color:var(--text2)">Próximo vencimento</small>
              <div style="font-weight:600;color:${isOverdue ? '#ef4444' : isDueSoon ? '#f59e0b' : 'var(--text)'}">
                ${nextDue.toLocaleDateString('pt-BR')} 
                <span style="font-size:12px">(${isOverdue ? `${Math.abs(daysUntilDue)} dias atraso` : `${daysUntilDue} dias`})</span>
              </div>
            </div>
            ${bill.lastPaid ? `
              <div style="text-align:right">
                <small style="color:var(--text2)">Último pagamento</small>
                <div style="font-size:12px;color:var(--text2)">${new Date(bill.lastPaid).toLocaleDateString('pt-BR')} · ${(bill.payments||[]).length} registro(s)</div>
              </div>
            ` : ''}
          </div>
          ${bill.notes ? `<div style="margin-top:8px;padding:8px;background:var(--input-bg);border-radius:4px;font-size:13px;color:var(--text2)">${bill.notes}</div>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function getNextBillDueDate(dueDay) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  
  let dueDate = new Date(currentYear, currentMonth, dueDay);
  if (dueDate <= now) {
    dueDate = new Date(currentYear, currentMonth + 1, dueDay);
  }
  
  return dueDate;
}

function openMonthlyBillModal(){
  state.editingMonthlyBill = null;
  document.getElementById('monthlybill-modal-title').textContent = 'Nova Conta Mensal';
  
  // Populate card options
  const cardSelect = document.getElementById('mb-card-id');
  cardSelect.innerHTML = '<option value="">Selecionar cartão</option>' + 
    state.cards.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  const accountSelect = document.getElementById('mb-account-id');
  accountSelect.innerHTML = '<option value="">Selecionar conta</option>' +
    state.accounts.map(a => `<option value="${a.id}">${a.name}</option>`).join('');
  
  document.getElementById('mb-name').value = '';
  document.getElementById('mb-value').value = '';
  document.getElementById('mb-due-day').value = '1';
  document.getElementById('mb-card-id').value = '';
  document.getElementById('mb-account-id').value = '';
  document.getElementById('mb-category').value = 'Moradia';
  document.getElementById('mb-status').value = 'active';
  document.getElementById('mb-notes').value = '';
  
  document.getElementById('modal-monthlybill').classList.add('active');
}

function editMonthlyBill(id){
  state.editingMonthlyBill = id;
  const bill = state.monthlyBills.find(b => b.id === id);
  if(!bill) return;
  
  document.getElementById('monthlybill-modal-title').textContent = 'Editar Conta Mensal';
  
  // Populate card options
  const cardSelect = document.getElementById('mb-card-id');
  cardSelect.innerHTML = '<option value="">Selecionar cartão</option>' + 
    state.cards.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  const accountSelect = document.getElementById('mb-account-id');
  accountSelect.innerHTML = '<option value="">Selecionar conta</option>' +
    state.accounts.map(a => `<option value="${a.id}">${a.name}</option>`).join('');
  
  document.getElementById('mb-name').value = bill.name;
  document.getElementById('mb-value').value = bill.value;
  document.getElementById('mb-due-day').value = bill.dueDay;
  document.getElementById('mb-card-id').value = bill.cardId || '';
  document.getElementById('mb-account-id').value = bill.accountId || '';
  document.getElementById('mb-category').value = bill.category;
  document.getElementById('mb-status').value = bill.status;
  document.getElementById('mb-notes').value = bill.notes || '';
  
  document.getElementById('modal-monthlybill').classList.add('active');
}

function saveMonthlyBill(){
  const name = document.getElementById('mb-name').value.trim();
  const value = parseFloat(document.getElementById('mb-value').value);
  const dueDay = parseInt(document.getElementById('mb-due-day').value);
  const cardId = document.getElementById('mb-card-id').value;
  const accountId = document.getElementById('mb-account-id').value;
  const category = document.getElementById('mb-category').value;
  const status = document.getElementById('mb-status').value;
  const notes = document.getElementById('mb-notes').value.trim();
  
  if(!name || !Number.isFinite(value) || value<=0 || !dueDay){
    alert('Informe nome, valor positivo e vencimento.');
    return;
  }
  
  if(dueDay < 1 || dueDay > 31){
    alert('Dia do vencimento deve ser entre 1 e 31');
    return;
  }
  const selectedCard = state.cards.find(c => c.id === cardId);
  if(!cardId && !accountId){
    alert('Selecione um cartão ou uma conta de pagamento.');
    return;
  }
  if(selectedCard?.type === 'debit' && !selectedCard.accountId){
    alert('O cartão de débito precisa estar vinculado a uma conta.');
    return;
  }
  
  if(state.editingMonthlyBill){
    const idx = state.monthlyBills.findIndex(b => b.id === state.editingMonthlyBill);
    if(idx >= 0){
      state.monthlyBills[idx] = {...state.monthlyBills[idx], name, value, dueDay, cardId, accountId, category, status, notes};
    }
  } else {
    const bill = {id: uid(), name, value, dueDay, cardId, accountId, category, status, notes, lastPaid: null};
    state.monthlyBills.push(bill);
  }
  
  save();
  closeModal('modal-monthlybill');
  renderMonthlyBills();
  renderDashboard(); // Update dashboard if needed
}

function deleteMonthlyBill(id){
  if(confirm('Excluir esta conta mensal? Esta ação não pode ser desfeita.')){
    state.monthlyBills = state.monthlyBills.filter(b => b.id !== id);
    save();
    renderMonthlyBills();
  }
}

function markBillAsPaid(id){
  const bill = state.monthlyBills.find(b => b.id === id);
  if(!bill) return;
  
  const today = new Date();
  const paidDate = today.toISOString().split('T')[0];
  const card = bill.cardId ? state.cards.find(c => c.id === bill.cardId) : null;
  const paymentAccountId = card?.type === 'debit' ? (card.accountId || '') : (bill.accountId || '');
  if(!card && !paymentAccountId){
    alert('Selecione uma conta ou cartão antes de marcar esta conta como paga.');
    return;
  }
  if(card?.type === 'debit' && !paymentAccountId){
    alert('O cartão de débito precisa estar vinculado a uma conta.');
    return;
  }
  const alreadyPaid = state.transactions.some(t => t.monthlyBillId===bill.id && t.date===paidDate);
  const periodAlreadyPaid = (bill.payments||[]).some(payment => payment.reference === paidDate.slice(0, 7));
  if(alreadyPaid || periodAlreadyPaid) {
    alert('Esta conta já foi marcada como paga no período atual.');
    return;
  }
  bill.lastPaid = paidDate;
  
  let tx;
  if(card?.type === 'credit_card'){
    tx = {
      id: uid(),
      type: 'expense',
      desc: `${bill.name} - Conta Mensal`,
      value: bill.value,
      date: paidDate,
      cat: bill.category,
      method: 'credit_card',
      cardId: bill.cardId,
      accountId: '',
      fromAccountId: '',
      toAccountId: '',
      tags: ['conta-mensal'],
      status: 'pending',
      installment: null,
      subscriptionId: null,
      monthlyBillId: bill.id
    };
  } else {
    tx = {
      id: uid(),
      type: 'expense',
      desc: `${bill.name} - Conta Mensal`,
      value: bill.value,
      date: paidDate,
      cat: bill.category,
      method: card?.type === 'debit' ? 'debit' : 'bank_transfer',
      cardId: card?.type === 'debit' ? card.id : '',
      accountId: paymentAccountId,
      fromAccountId: '',
      toAccountId: '',
      tags: ['conta-mensal'],
      status: 'paid',
      installment: null,
      subscriptionId: null,
      monthlyBillId: bill.id
    };
  }
  state.transactions.push(tx);
  bill.payments = Array.isArray(bill.payments) ? bill.payments : [];
  bill.payments.push({
    reference: paidDate.slice(0, 7),
    dueDate: getNextBillDueDate(bill.dueDay).toISOString().slice(0, 10),
    paidDate,
    transactionId: tx.id
  });
  
  save();
  renderMonthlyBills();
  renderDashboard();
  renderCards(); // Update card usage display
}

function saveSettings(){
  state.settings.name=document.getElementById('s-name').value.trim()||'Usuário';
  state.settings.currency=document.getElementById('s-currency').value;
  save(); alert('Configurações salvas!');
}
function addCategory(){
  const val=document.getElementById('new-cat').value.trim();
  if(!val)return;
  if(state.settings.categories.includes(val)){alert('Categoria já existe');return;}
  state.settings.categories.push(val);
  document.getElementById('new-cat').value='';
  save(); renderSettings();
}
function removeCategory(i){
  state.settings.categories.splice(i,1);
  save(); renderSettings();
}

function globalSearch(q){
  if(!q)return;
  navigate('transactions');
  setTimeout(()=>{document.getElementById('tx-search').value=q;renderTransactions();},100);
}

function exportCSV(){
  const rows=[['Data','Tipo','Descricao','Categoria','Metodo','Valor'],...state.transactions.map(t=>[t.date,t.type,t.desc,t.cat,t.method||'',t.value])];
  const csv=rows.map(r=>r.map(v=>`"${v}"`).join(',')).join('\n');
  download('seu_extrato_fluxa_export.csv','data:text/csv;charset=utf-8,'+encodeURIComponent(csv));
}
function exportJSON(){
  const data=JSON.stringify({version:2,transactions:state.transactions,accounts:state.accounts,cards:state.cards,goals:state.goals,subscriptions:state.subscriptions,monthlyBills:state.monthlyBills,settings:state.settings},null,2);
  download('seu_extrato_fluxa_backup.json','data:application/json;charset=utf-8,'+encodeURIComponent(data));
}
function download(name,href){const a=document.createElement('a');a.href=href;a.download=name;a.click();}

function clearAllData(){
  if(confirm('Tem certeza que deseja apagar TODOS os dados? Esta ação não pode ser desfeita.')){
    localStorage.removeItem('fluxa_v2');
    location.reload();
  }
}
function closeModal(id){document.getElementById(id).classList.remove('active');}

populateBankSelects();
load();
syncRecurringTransactions();
if(state.settings.theme==='light'){
  document.documentElement.setAttribute('data-theme','light');
  document.getElementById('theme-icon').className='ti ti-moon';
  document.getElementById('theme-label').textContent='Modo Escuro';
}
renderDashboard();
const repMonth=document.getElementById('rep-month');
const repYear=document.getElementById('rep-year');
if(repMonth){const now=new Date();MONTHS.forEach((m,i)=>repMonth.add(new Option(m,i)));repMonth.value=now.getMonth();}
if(repYear){const now=new Date();for(let y=now.getFullYear()-2;y<=now.getFullYear();y++)repYear.add(new Option(y,y));repYear.value=now.getFullYear();}

// Atualizar ano do rodapé automaticamente
function updateFooterYear(){const el=document.getElementById('footer-year');if(el)el.textContent=new Date().getFullYear();}
updateFooterYear();
setInterval(updateFooterYear, 60000);


// Confirmar formulários com ENTER
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    const active = document.activeElement;

    // Evita conflito com textarea
    if (active && active.tagName !== 'TEXTAREA') {

      // Modal transação
      if (document.getElementById('modal-add')?.classList.contains('active')) {
        saveTransaction();
      }

      // Modal conta
      else if (document.getElementById('modal-account')?.classList.contains('active')) {
        saveAccount();
      }

      // Modal cartão
      else if (document.getElementById('modal-card')?.classList.contains('active')) {
        saveCard();
      }

      // Modal meta
      else if (document.getElementById('modal-goal')?.classList.contains('active')) {
        saveGoal();
      }

      // Modal progresso meta
      else if (document.getElementById('modal-goal-progress')?.classList.contains('active')) {
        updateGoalProgress();
      }
    }
  }
});


// ═══════════════════════════════════════════════════════════
//  IMPORT JSON
// ═══════════════════════════════════════════════════════════
var _pendingImport = null;

function triggerImport() {
  var inp = document.getElementById('import-file-input');
  inp.value = '';
  inp.click();
}

function handleImportFile(e) {
  var file = e.target.files[0];
  if (!file) return;
  var btn = document.getElementById('btn-confirm-import');
  if (btn) { btn.disabled = false; btn.style.opacity = '1'; }
  var reader = new FileReader();
  reader.onload = function(ev) {
    try {
      var data = JSON.parse(ev.target.result);
      if (!Array.isArray(data.transactions) && !Array.isArray(data.accounts)) {
        showImportError('Arquivo nao reconhecido. Use um backup gerado pelo Fluxa.');
        return;
      }
      _pendingImport = data;
      var txC=( data.transactions||[]).length, accC=(data.accounts||[]).length;
      var cardC=(data.cards||[]).length, goalC=(data.goals||[]).length;
      var uName=data.settings&&data.settings.name?data.settings.name:'';
      document.getElementById('import-preview').innerHTML =
        '<div style="font-size:13px;color:var(--text2);margin-bottom:12px">Arquivo: <strong style="color:var(--text)">'+file.name+'</strong></div>'+
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">'+
          '<div style="background:var(--input-bg);border-radius:8px;padding:12px;text-align:center"><div style="font-size:22px;font-weight:700;color:var(--text)">'+txC+'</div><div style="font-size:11px;color:var(--text3);margin-top:2px;text-transform:uppercase;letter-spacing:1px">Transacoes</div></div>'+
          '<div style="background:var(--input-bg);border-radius:8px;padding:12px;text-align:center"><div style="font-size:22px;font-weight:700;color:var(--text)">'+accC+'</div><div style="font-size:11px;color:var(--text3);margin-top:2px;text-transform:uppercase;letter-spacing:1px">Contas</div></div>'+
          '<div style="background:var(--input-bg);border-radius:8px;padding:12px;text-align:center"><div style="font-size:22px;font-weight:700;color:var(--text)">'+cardC+'</div><div style="font-size:11px;color:var(--text3);margin-top:2px;text-transform:uppercase;letter-spacing:1px">Cartoes</div></div>'+
          '<div style="background:var(--input-bg);border-radius:8px;padding:12px;text-align:center"><div style="font-size:22px;font-weight:700;color:var(--text)">'+goalC+'</div><div style="font-size:11px;color:var(--text3);margin-top:2px;text-transform:uppercase;letter-spacing:1px">Metas</div></div>'+
        '</div>'+(uName?'<div style="font-size:12px;color:var(--text3);margin-top:10px">Perfil: <span style="color:var(--text2)">'+uName+'</span></div>':'');
      document.getElementById('modal-import').classList.add('active');
    } catch(err) { showImportError('Erro ao ler o arquivo. O JSON pode estar corrompido.'); }
  };
  reader.readAsText(file);
}

function showImportError(msg) {
  var p=document.getElementById('import-preview');
  if(p) p.innerHTML='<div style="background:rgba(248,113,113,0.08);border:1px solid rgba(248,113,113,0.2);border-radius:8px;padding:12px;font-size:13px;color:var(--red2)">'+msg+'</div>';
  var b=document.getElementById('btn-confirm-import');
  if(b){b.disabled=true;b.style.opacity='0.4';}
  document.getElementById('modal-import').classList.add('active');
}

function confirmImport() {
  if (!_pendingImport) return;
  var d=_pendingImport;
  if(Array.isArray(d.transactions)) state.transactions=d.transactions;
  if(Array.isArray(d.accounts))     state.accounts=d.accounts;
  if(Array.isArray(d.cards))        state.cards=d.cards;
  if(Array.isArray(d.goals))        state.goals=d.goals;
  if(Array.isArray(d.subscriptions)) state.subscriptions=d.subscriptions;
  if(Array.isArray(d.monthlyBills)) state.monthlyBills=d.monthlyBills;
  if(d.settings) state.settings=Object.assign({},state.settings,d.settings);
  migrateState();
  save(); _pendingImport=null; closeModal('modal-import');
  if(state.settings.theme==='light'){
    document.documentElement.setAttribute('data-theme','light');
    var ti=document.getElementById('theme-icon');if(ti)ti.className='ti ti-moon';
    var tl=document.getElementById('theme-label');if(tl)tl.textContent='Modo Escuro';
  } else {
    document.documentElement.removeAttribute('data-theme');
    var ti=document.getElementById('theme-icon');if(ti)ti.className='ti ti-sun';
    var tl=document.getElementById('theme-label');if(tl)tl.textContent='Modo Claro';
  }
  renderDashboard();renderTransactions();renderAccounts();renderCards();renderGoals();renderSubscriptions();renderSettings();
  showToast('Importacao concluida com sucesso!');
}

function showToast(msg,type){
  type=type||'success';
  var t=document.getElementById('fluxa-toast');
  if(!t){t=document.createElement('div');t.id='fluxa-toast';
    t.style.cssText='position:fixed;bottom:80px;left:50%;transform:translateX(-50%) translateY(20px);background:var(--card-bg);border:1px solid var(--border2);color:var(--text);font-size:13px;font-weight:500;padding:10px 20px;border-radius:10px;z-index:9999;box-shadow:0 8px 32px rgba(0,0,0,0.3);opacity:0;transition:opacity 0.25s,transform 0.25s;white-space:nowrap;pointer-events:none;';
    document.body.appendChild(t);}
  t.innerHTML='<span style="color:'+(type==='success'?'var(--green2)':'var(--red2)')+';margin-right:8px">'+(type==='success'?'v':'x')+'</span>'+msg;
  t.style.opacity='1';t.style.transform='translateX(-50%) translateY(0)';
  if(t._t)clearTimeout(t._t);
  t._t=setTimeout(function(){t.style.opacity='0';t.style.transform='translateX(-50%) translateY(10px)';},3000);
}

// ═══════════════════════════════════════════════════════════
//  TOUR & ONBOARDING
// ═══════════════════════════════════════════════════════════
var TOUR_STEPS=[
  {target:null,title:'Bem-vindo ao Fluxa!',desc:'Este tour rápido vai te mostrar as principais funcionalidades. Leva menos de 2 minutos.',placement:'center'},
  {target:'[onclick="navigate(\'dashboard\')"]',title:'Dashboard',desc:'Visão geral das suas finanças: saldo total, receitas, despesas do mês e gráficos de evolução — tudo em um único lugar.',placement:'right'},
  {target:'[onclick="navigate(\'transactions\')"]',title:'Transações',desc:'Registre receitas e despesas. Filtre por categoria, data ou tipo e mantenha o histórico completo e organizado.',placement:'right'},
  {target:'[onclick="navigate(\'accounts\')"]',title:'Contas',desc:'Gerencie contas bancárias, poupança, carteira e investimentos. Veja o saldo e movimentações de cada uma.',placement:'right'},
  {target:'[onclick="navigate(\'cards\')"]',title:'Cartões',desc:'Cadastre cartões de crédito, acompanhe o limite utilizado, datas de fechamento e vencimento da fatura.',placement:'right'},
  {target:'[onclick="navigate(\'goals\')"]',title:'Metas Financeiras',desc:'Crie metas como reserva de emergência ou viagem. Acompanhe o progresso com barras visuais e prazos.',placement:'right'},
  {target:'[onclick="navigate(\'reports\')"]',title:'Relatórios',desc:'Analise gastos por categoria, compare meses e exporte em CSV ou JSON para backup e sincronização entre dispositivos.',placement:'right'},
  {target:'[onclick="navigate(\'alerts\')"]',title:'Alertas',desc:'O Fluxa monitora automaticamente: limite do cartão, metas vencendo e gastos acima do normal.',placement:'right'},
  {target:'button.btn-primary',title:'Nova Transação',desc:'Sempre disponível na barra superior para registrar uma receita ou despesa de qualquer página.',placement:'bottom'},
  {target:'[onclick="navigate(\'settings\')"]',title:'Configurações & Importar',desc:'Personalize o perfil, escolha a moeda, gerencie categorias, faça backup JSON ou importe dados de outro dispositivo.',placement:'right'}
];

var _tourStep=0,_tourUserName='';

function checkFirstVisit(){
  if(!localStorage.getItem('fluxa_tour_done')) setTimeout(showWelcome,700);
  else if(!localStorage.getItem('fluxa_updates_seen_v2')) setTimeout(showProductUpdates,900);
}
function showProductUpdates(){
  var overlay=document.getElementById('product-updates-overlay');
  if(overlay) overlay.classList.add('visible');
}
function closeProductUpdates(){
  var overlay=document.getElementById('product-updates-overlay');
  if(overlay) overlay.classList.remove('visible');
  localStorage.setItem('fluxa_updates_seen_v2','1');
}
function restartTour(){
  localStorage.removeItem('fluxa_tour_done');
  navigate('dashboard');
  showWelcome();
}
function showWelcome(){
  var o=document.getElementById('welcome-overlay');
  if(!o)return;
  o.classList.add('visible');
  setTimeout(function(){var i=document.getElementById('welcome-name-input');if(i)i.focus();},400);
}
function startWithName(){
  var inp=document.getElementById('welcome-name-input');
  var name=inp?inp.value.trim():'';
  if(!name){if(inp)inp.focus();return;}
  _tourUserName=name; state.settings.name=name; save();
  var s=document.getElementById('s-name');if(s)s.value=name;
  var o=document.getElementById('welcome-overlay');if(o)o.classList.remove('visible');
  setTimeout(startTour,350);
}
function skipWelcome(){
  var inp=document.getElementById('welcome-name-input');
  var name=inp?inp.value.trim():'';
  if(name){state.settings.name=name;save();}
  var o=document.getElementById('welcome-overlay');if(o)o.classList.remove('visible');
  localStorage.setItem('fluxa_tour_done','1');
  if(!localStorage.getItem('fluxa_updates_seen_v2')) setTimeout(showProductUpdates,350);
}

function startTour(){
  _tourStep=0;
  // Auto-open sidebar so nav items are visible and highlightable
  var sidebar=document.getElementById('sidebar');
  var overlay=document.getElementById('sidebar-overlay');
  var burger=document.getElementById('burger-btn');
  sidebar.classList.add('open');
  overlay.classList.add('active');
  if(burger)burger.classList.add('open');
  // Elevate sidebar above tour backdrop so it's clickable/visible
  sidebar.style.zIndex='4500';
  document.getElementById('tour-layer').style.display='block';
  renderTourStep();
}

function renderTourStep(){
  var step=TOUR_STEPS[_tourStep],total=TOUR_STEPS.length;
  var tip=document.getElementById('tour-tooltip');
  tip.classList.remove('visible');
  setTimeout(function(){
    document.getElementById('tour-step-label').textContent='Passo '+(_tourStep+1)+' de '+total;
    document.getElementById('tour-title').textContent=step.title;
    document.getElementById('tour-desc').textContent=step.desc;
    document.getElementById('tour-btn-next').textContent=_tourStep===total-1?'Finalizar!':'Próximo';
    // dots
    var dots=document.getElementById('tour-dots');dots.innerHTML='';
    for(var i=0;i<total;i++){var d=document.createElement('div');d.className='tour-dot'+(i===_tourStep?' active':'');dots.appendChild(d);}
    if(step.placement==='center'||!step.target){
      setSpotlightCenter();positionTooltipCenter(tip);tip.classList.add('visible');
    } else {
      var el=document.querySelector(step.target);
      if(!el){setSpotlightCenter();positionTooltipCenter(tip);tip.classList.add('visible');return;}
      el.scrollIntoView({behavior:'smooth',block:'nearest'});
      setTimeout(function(){
        var rect=el.getBoundingClientRect();
        setSpotlight(rect);positionTooltip(tip,rect,step.placement);
        tip.classList.add('visible');
      },120);
    }
  },260);
}

function setSpotlight(rect){
  var pad=8,x=rect.left-pad,y=rect.top-pad,w=rect.width+pad*2,h=rect.height+pad*2;
  var vw=window.innerWidth,vh=window.innerHeight;
  document.getElementById('tb-top').style.cssText   ='top:0;left:0;width:100%;height:'+Math.max(0,y)+'px;z-index:4000';
  document.getElementById('tb-bottom').style.cssText='top:'+(y+h)+'px;left:0;width:100%;height:'+Math.max(0,vh-(y+h))+'px;z-index:4000';
  document.getElementById('tb-left').style.cssText  ='top:'+y+'px;left:0;width:'+Math.max(0,x)+'px;height:'+h+'px;z-index:4000';
  document.getElementById('tb-right').style.cssText ='top:'+y+'px;left:'+(x+w)+'px;width:'+Math.max(0,vw-(x+w))+'px;height:'+h+'px;z-index:4000';
  document.getElementById('tour-ring').style.cssText='left:'+x+'px;top:'+y+'px;width:'+w+'px;height:'+h+'px';
}
function setSpotlightCenter(){
  var vh=window.innerHeight;
  document.getElementById('tb-top').style.cssText   ='top:0;left:0;width:100%;height:'+vh+'px;z-index:4000';
  ['tb-bottom','tb-left','tb-right'].forEach(function(id){document.getElementById(id).style.cssText='width:0;height:0';});
  document.getElementById('tour-ring').style.cssText='width:0;height:0';
}
function positionTooltip(tip,rect,placement){
  var vw=window.innerWidth,vh=window.innerHeight,pad=16;
  var tw=Math.min(300,vw-32);
  if(vw <= 520){
    tip.style.left='50%';
    tip.style.top='auto';
    tip.style.bottom='16px';
    tip.style.transform='translateX(-50%)';
    tip.style.width = 'calc(100vw - 32px)';
    return;
  }
  var x,y;
  if(placement==='right'){
    x=rect.right+16;y=rect.top+rect.height/2-100;
    if(x+tw>vw-pad)x=rect.left-tw-16;
  } else if(placement==='bottom'){
    x=rect.left+rect.width/2-tw/2;y=rect.bottom+16;
  } else { x=rect.right+16;y=rect.top; }
  x=Math.max(pad,Math.min(vw-tw-pad,x));
  y=Math.max(pad,Math.min(vh-250-pad,y));
  tip.style.left=x+'px';tip.style.top=y+'px';tip.style.bottom='';
  tip.style.transform='none';
  tip.style.width=tw+'px';
}
function positionTooltipCenter(tip){
  tip.style.left='50%';tip.style.top='50%';tip.style.transform='translate(-50%,-50%)';
}
function tourNext(){
  if(_tourStep>=TOUR_STEPS.length-1){endTour(true);}else{_tourStep++;renderTourStep();}
}
function endTour(completed){
  localStorage.setItem('fluxa_tour_done','1');
  document.getElementById('tour-tooltip').classList.remove('visible');
  setTimeout(function(){
    document.getElementById('tour-layer').style.display='none';
    document.getElementById('sidebar').style.zIndex='';
    ['tb-top','tb-bottom','tb-left','tb-right'].forEach(function(id){document.getElementById(id).style.cssText='';});
    closeSidebar();
    if(completed)showTourComplete();
  },300);
}
function showTourComplete(){
  var name=_tourUserName||state.settings.name||'';
  document.getElementById('tour-complete-title').textContent=name?'Tudo pronto, '+name+'!':'Tudo pronto!';
  document.getElementById('tour-complete-overlay').classList.add('visible');
}
function closeTourComplete(){
  document.getElementById('tour-complete-overlay').classList.remove('visible');
  navigate('dashboard');
  if(!localStorage.getItem('fluxa_updates_seen_v2')) setTimeout(showProductUpdates,350);
}

var deferredPwaPrompt = null;
var PWA_DISMISS_KEY = 'fluxa_pwa_dismissed';

function isIos() {
  return /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
}

function isInStandaloneMode() {
  return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
         (window.navigator.standalone === true);
}

function showPwaBanner(type) {
  if (localStorage.getItem(PWA_DISMISS_KEY) === '1') return;
  if (isInStandaloneMode()) return;
  var banner = document.getElementById('pwa-banner');
  var text = document.getElementById('pwa-banner-text');
  if (!banner || !text) return;
  if (type === 'ios') {
    text.innerHTML = 'Toque no botão <strong>Compartilhar</strong> do Safari e escolha <strong>Adicionar à Tela de Início</strong> para salvar o Fluxa como atalho.';
    document.getElementById('pwa-install-btn').textContent = 'Entendi';
  } else {
    text.textContent = 'Adicione o Fluxa à tela inicial para abrir o app mais rápido e sem endereço no navegador.';
    document.getElementById('pwa-install-btn').textContent = 'Adicionar';
  }
  banner.style.display = 'block';
}

function hidePwaBanner() {
  var banner = document.getElementById('pwa-banner');
  if (banner) banner.style.display = 'none';
}

function dismissPwaBanner() {
  localStorage.setItem(PWA_DISMISS_KEY, '1');
  hidePwaBanner();
}

function initPwaInstallPrompt() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('sw.js').catch(function() {});
    });
  }

  window.addEventListener('beforeinstallprompt', function(e) {
    e.preventDefault();
    deferredPwaPrompt = e;
    showPwaBanner();
  });

  window.addEventListener('appinstalled', function() {
    hidePwaBanner();
    deferredPwaPrompt = null;
  });

  setTimeout(function() {
    if (isInStandaloneMode()) return;
    if (deferredPwaPrompt) {
      showPwaBanner();
    } else if (isIos()) {
      showPwaBanner('ios');
    }
  }, 1200);
}

function installPwa() {
  if (isIos() && !deferredPwaPrompt) {
    dismissPwaBanner();
    return;
  }
  if (!deferredPwaPrompt) {
    dismissPwaBanner();
    return;
  }
  deferredPwaPrompt.prompt();
  deferredPwaPrompt.userChoice.then(function(choiceResult) {
    if (choiceResult.outcome === 'accepted') {
      hidePwaBanner();
      deferredPwaPrompt = null;
    }
  });
}

// Enter on welcome input
document.addEventListener('DOMContentLoaded',function(){
  var inp=document.getElementById('welcome-name-input');
  if(inp)inp.addEventListener('keydown',function(e){if(e.key==='Enter')startWithName();});
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape' && document.getElementById('product-updates-overlay')?.classList.contains('visible')) closeProductUpdates();
  });
  initPwaInstallPrompt();
});

checkFirstVisit();
