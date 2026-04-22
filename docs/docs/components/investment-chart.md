# InvestmentChart

`src/components/molecules/InvestmentChart/`

Gráfico **doughnut** (Chart.js / react-chartjs-2) com transações do tipo `investment` que tenham `investmentType`. Cores por tipo vêm de constantes no TSX (`INVESTMENT_COLORS`, alinhadas às variáveis de destaque do design system). Em viewport estreita (regra de 719px no código) a legenda pode ir para baixo (`matchMedia`).

## Props

| Prop | Tipo | Descrição |
|------|------|-----------|
| `transactions` | `Transaction[]` | Lista do `DashboardContext` |

Se não houver transações de investimento com tipo, o componente trata estado vazio (ver implementação).
