# ProfileInput

`src/components/atoms/ProfileInput/`

Campo com **label** + input; estados de foco e ícone no wrapper estão no `ProfileInput.module.scss`. Gera `id`/`name` a partir do `label` se não forem passados.

## Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `label` | `string` | - | Rótulo visível |
| `value` | `string` | - | Valor controlado |
| `onChange` | `(value: string) => void` | - | - |
| `placeholder` | `string` | - | - |
| `type` | `'text' \| 'email' \| 'password'` | `text` | - |
| `className` | `string` | `''` | - |
| `id` | `string` | - | Se omitido, derivado do label |
| `name` | `string` | - | Se omitido, derivado do label |
