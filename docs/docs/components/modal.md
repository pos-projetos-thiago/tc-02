# Modal

`src/components/molecules/Modal/`

Overlay com **backdrop**, conteúdo em painel, fechamento por clique no fundo, **Escape** e bloqueio de scroll no `body` enquanto aberto (com restauração da posição de scroll).

## Props

| Prop | Tipo | Obrigatório | Descrição |
|------|------|-------------|-----------|
| `isOpen` | `boolean` | sim | Se `false`, retorna `null` |
| `onClose` | `() => void` | sim | Fechar |
| `children` | `React.ReactNode` | sim | Conteúdo |
| `ariaLabel` | `string` | sim | `aria-label` do `dialog` |
| `contentClassName` | `string` | não | Classe extra no conteúdo |
| `fullHeight` | `boolean` | não | Modificador de altura no overlay |
