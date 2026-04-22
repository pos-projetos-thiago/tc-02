# Loading e LoadingScreen

- `src/components/atoms/Loading/Loading.tsx`
- `src/components/atoms/Loading/LoadingScreen.tsx`

**Loading** exibe o GIF `public/assets/spinner.gif` com tamanho configurável e texto opcional.

**LoadingScreen** envolve o **Loading** em tela cheia; só renderiza se `isVisible` for `true` (padrão de texto `Carregando...`).

## Loading - props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `size` | `'small' \| 'medium' \| 'large'` | `medium` | Tamanho do ícone (24 / 40 / 60 px) |
| `text` | `string` | - | Texto abaixo do spinner |

## LoadingScreen - props

Estende as props do **Loading** e adiciona:

| Prop | Tipo | Descrição |
|------|------|-----------|
| `isVisible` | `boolean` | Se `false`, retorna `null` |
