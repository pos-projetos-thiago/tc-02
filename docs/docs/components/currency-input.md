# CurrencyInput

`src/components/atoms/Input/CurrencyInput.tsx`

Campo de valor em **reais**: prefixo `R$`, digitação só numérica, valor repassado em string com vírgula decimal (ex.: `10,50`).

## Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `value` | `string` | `''` | Valor exibido |
| `placeholder` | `string` | `0,00` | - |
| `onChange` | `(value: string) => void` | - | Valor formatado após input |
| `className` | `string` | `''` | - |
