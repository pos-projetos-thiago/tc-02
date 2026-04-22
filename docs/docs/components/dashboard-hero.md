# DashboardHero

`src/components/organisms/DashboardHero/`

Hero da área logada: [BalanceCard](./balance-card), data formatada em PT-BR, e conteúdo condicional por `activeSection` do `DashboardContext` (inclui [ProfileForm](./profile-form) e [Toast](./toast) na seção "Outros serviços"). Usa `useSupabaseAuth` para mensagens de feedback ao salvar perfil.

## Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `balance` | `number` | `0` | Saldo exibido no card |
| `userName` | `string` | `Usuário` | Nome no cabeçalho / fluxo de perfil |
