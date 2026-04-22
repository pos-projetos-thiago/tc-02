# DashboardMobileMenu

`src/components/organisms/DashboardMobileMenu/`

Menu lateral (reutiliza estilos de `MobileMenu.module.scss`) com as seções do dashboard. Ao escolher uma seção, atualiza `DashboardContext` e, se a rota não for `/dashboard`, navega para lá. Fecha com backdrop, botão fechar ou **Escape**.

## Props

| Prop | Tipo | Descrição |
|------|------|-----------|
| `isOpen` | `boolean` | - |
| `onClose` | `() => void` | - |
