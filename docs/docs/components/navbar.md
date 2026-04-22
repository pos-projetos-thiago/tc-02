# Navbar

`src/components/organisms/Navbar/`

Barra superior da landing: logo, [MenuButton](./menu-button), [MobileMenu](./mobile-menu) e [AuthModal](./auth-modal) (fluxo com `AuthContext` no modo interno). Pode ser **controlada** passando `authModalVariant` e `onAuthModalChange`, ou gerir modal no estado local.

## Props

| Prop | Tipo | Descrição |
|------|------|-----------|
| `authModalVariant` | `'signup' \| 'login' \| null \| undefined` | Modo controlado |
| `onAuthModalChange` | `(v: 'signup' \| 'login' \| null) => void` | Trocar variante do modal |
