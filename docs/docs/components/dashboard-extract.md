# DashboardExtract

`src/components/organisms/DashboardExtract/`

Bloco **Extrato** do dashboard: lista `TransactionItem` limitada a `maxItems`, botões opcionais de editar/excluir (callbacks), link "Ver mais" para `/dashboard/transacoes` quando há mais itens.

## Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `transactions` | `Transaction[]` | `[]` | Veio do contexto/dados |
| `maxItems` | `number` | `4` | Quantidade exibida |
| `onEditClick` | `() => void` | - | Ação do botão editar |
| `onDeleteClick` | `() => void` | - | Ação do botão excluir |
