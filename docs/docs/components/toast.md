# Toast

`src/components/atoms/Toast/`

Mensagem temporária; fecha sozinha após `duration` (ms) ou pelo botão fechar. Estilos por `type` no SCSS.

## Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `message` | `string` | - | Texto |
| `type` | `'success' \| 'error' \| 'info'` | `success` | Estilo |
| `isVisible` | `boolean` | - | Se `false`, não renderiza |
| `onClose` | `() => void` | - | Fechar manual / após timeout |
| `duration` | `number` | `3000` | ms; `0` desliga auto-fechamento |
