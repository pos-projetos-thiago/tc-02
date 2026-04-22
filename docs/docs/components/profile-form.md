# ProfileForm

`src/components/organisms/ProfileForm/`

Formulário de **Minha conta** com [ProfileInput](./profile-input) (nome, e-mail, senha). Chama `onSave` com `{ name, email, password }` e limpa a senha do estado após salvar.

## Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `userName` | `string` | `''` | Valor inicial do nome |
| `userEmail` | `string` | `''` | Valor inicial do e-mail |
| `onSave` | `(data) => void` | - | Payload com nome, e-mail e senha digitada |
