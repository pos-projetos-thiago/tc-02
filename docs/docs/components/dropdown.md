# Dropdown

`src/components/atoms/Dropdown/`

Lista suspensa; pode ser **controlada** (`value` + `onChange`) ou **não controlada** (estado interno se `value` for omitido). Fecha ao clicar fora. Suporte a teclado básico no gatilho (Enter / Espaço).

## Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `options` | `DropdownOption[]` | - | `{ value, label }` |
| `placeholder` | `string` | `Selecione uma opção` | Texto quando nada selecionado |
| `value` | `string` | - | Modo controlado |
| `onChange` | `(value: string) => void` | - | Nova seleção |
| `className` | `string` | `''` | - |
