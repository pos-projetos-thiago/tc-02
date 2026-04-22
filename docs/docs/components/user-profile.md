# UserProfile e UserProfileSupabase

- `src/components/molecules/UserProfile/UserProfile.tsx`
- `src/components/molecules/UserProfile/UserProfileSupabase.tsx`

**UserProfile** mostra nome e avatar (imagem padrão `UserProfile/avatar.svg` se não passar `avatarSrc`).

**UserProfileSupabase** usa a mesma interface visual e adiciona **MenuButton** (tom `accent`) que abre o `DashboardMobileMenu` e fluxo de **logout** com `signOutUser` (Supabase) e `router.push('/')`.

## Props (comuns)

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `userName` | `string` | - | Nome exibido |
| `avatarSrc` | `string` | `/UserProfile/avatar.svg` | URL do avatar |
