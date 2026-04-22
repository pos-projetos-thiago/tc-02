# TransactionItem

`src/components/molecules/TransactionItem/`

Uma linha de **transação** com data, mês, rótulo de tipo (depósito, investimento, etc.) e valor formatado. Depende do tipo `Transaction` exportado do `DashboardContext`. Hidratação com pequeno atraso para evitar glitches de conteúdo.

## Props

| Prop | Tipo | Descrição |
|------|------|-----------|
| `transaction` | `Transaction` | Objeto completo da transação |
