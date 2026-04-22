# ButtonGroup

`src/components/atoms/ButtonGroup/`

Grupo de botões de alternância (um valor ativo). Usa `ButtonGroup.module.scss`.

## Props

| Prop | Tipo | Obrigatório | Descrição |
|------|------|-------------|-----------|
| `options` | `ButtonOption[]` | sim | Lista `{ value, label, color? }` |
| `value` | `string` | sim | `value` da opção selecionada |
| `onChange` | `(value: string) => void` | sim | Disparado ao trocar de opção |
| `className` | `string` | não | Classe extra no container |

`color` (opcional) aplica cor de fundo e borda na opção ativa (inline), além do estilo padrão de selecionado.
