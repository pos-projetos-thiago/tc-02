# ServiceCard

`src/components/molecules/ServiceCard/`

Cartão clicável de serviço: ícone (`next/image`), título e descrição opcional. Com `onClick`, o `article` recebe `role="button"` e `tabIndex={0}`.

## Props

| Prop | Tipo | Descrição |
|------|------|-----------|
| `title` | `string` | Título |
| `description` | `string` | Opcional |
| `icon` | `string` | URL do asset (público) |
| `onClick` | `() => void` | Opcional |
