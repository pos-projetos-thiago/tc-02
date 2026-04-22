# MenuButton

`src/components/atoms/MenuButton/`

`IconButton` do MUI com ícone de menu (`MenuIcon`). Cores vêm de constantes no TSX (verde, branco em `onPrimary`, laranja em `accent`), alinhadas à paleta do app.

## Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `onClick` | `() => void` | - | Abre menu / ação |
| `tone` | `'default' \| 'onPrimary' \| 'accent'` | `default` | Cor do ícone |
