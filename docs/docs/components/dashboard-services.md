# DashboardServices

`src/components/organisms/DashboardServices/`

Área principal das seções do dashboard: cartões de serviço, transferências (dropdown, valor, botão), investimentos com [InvestmentChart](./investment-chart), etc. Usa `useDashboard` e `useSupabaseAuth`. Aceita lista de `Service` customizada ou usa `defaultServices` definido no arquivo.

## Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `services` | `Service[]` | lista padrão no código | Cartões exibidos |
| `userName` | `string` | - | Usado em fluxos internos |

`Service`: `id`, `title`, `description`, `icon`, `action?`.

Componente grande; detalhes de cada sub-bloco estão no próprio `DashboardServices.tsx` e no SCSS.
