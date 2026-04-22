# MobileMenu

`src/components/organisms/MobileMenu/`

Drawer de navegação da **home** (não logada): links e botões que disparam `onOpenSignUp` / `onOpenLogin`. Fecha com backdrop, **Escape** e bloqueia scroll. Não confundir com [DashboardMobileMenu](./dashboard-mobile-menu).

## Props

| Prop | Tipo | Descrição |
|------|------|-----------|
| `isOpen` | `boolean` | - |
| `onClose` | `() => void` | - |
| `onOpenSignUp` | `() => void` | - |
| `onOpenLogin` | `() => void` | - |
