# Fluxa Finance

Aplicação financeira local (PWA) para controle de contas, cartões, transações,
metas, assinaturas e contas mensais.

## Estrutura

- `index.html`: estrutura da interface e modais.
- `styles.css`: estilos da aplicação.
- `js/app.js`: estado, regras de negócio e renderização.
- `tests/e2e`: testes Playwright dos fluxos financeiros principais.

## Regras financeiras

- Compras no cartão de crédito entram na fatura e não reduzem o saldo da conta.
- O pagamento da fatura cria uma saída na conta escolhida e libera o limite.
- Compras no cartão de débito usam automaticamente a conta vinculada.
- Assinaturas e contas mensais preservam a origem do pagamento e impedem duplicidade.
- O estado persistido é versionado (`version: 2`) e o backup JSON inclui todas as coleções.

## Testes E2E

```bash
npm install
npx playwright install chromium
npm run test:e2e
```