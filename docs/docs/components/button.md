# Button

Componente em `src/components/atoms/Button/`. Estilos em `Button.module.scss`: a variante **primary** usa `$color-green` (não o `$color-primary` do token de marca) - confira o arquivo para hex e hovers.

## Variantes

### Primary (Primário)
Ação principal. Fundo verde.

```tsx
<Button variant="primary">Abrir minha conta</Button>
```

### Secondary (Secundário)
Ação secundária. Outline verde.

```tsx
<Button variant="secondary">Já tenho conta</Button>
```

### Accent (Destaque)
Destaque ou alerta. Fundo laranja (ex: página 404).

```tsx
<Button variant="accent">Voltar ao início</Button>
```

### Primary mobile
Botões do Hero no mobile. Fundo preto.

```tsx
<Button variant="primary-mobile">Abrir conta</Button>
```

### Secondary mobile
Botões do Hero no mobile. Outline preto.

```tsx
<Button variant="secondary-mobile">Já tenho conta</Button>
```

### Danger
Ação destrutiva. Fundo vermelho (hex fixo no SCSS, fora de `_colors.scss`).

```tsx
<Button variant="danger">Excluir</Button>
```

## Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `children` | `React.ReactNode` | - | Conteúdo |
| `variant` | `'primary' \| 'secondary' \| 'accent' \| 'danger' \| 'primary-mobile' \| 'secondary-mobile'` | `'primary'` | Classe no `Button.module.scss` |
| `size` | `'normal' \| 'small'` | `'normal'` | Classe `small` para padding menor |
| `onClick` | `() => void` | - | Se `href` não for passado |
| `className` | `string` | - | - |
| `href` | `string` | - | Se informado, renderiza `Link` do Next no lugar de `<button>` |
| `type` | `'button' \| 'submit' \| 'reset'` | `button` | Só para `<button>` |
| `disabled` | `boolean` | `false` | Só para `<button>` |

## Exemplos

### Botão Primário

```tsx
import { Button } from '@/components/atoms/Button';

export default function Example() {
  return (
    <Button 
      variant="primary" 
      onClick={() => console.log('Clicou!')}
    >
      Abrir conta
    </Button>
  );
}
```

### Botão Secundário

```tsx
<Button variant="secondary">
  Cancelar
</Button>
```

### Com className customizada

```tsx
<Button 
  variant="primary" 
  className={styles.customButton}
>
  Botão customizado
</Button>
```

## Responsividade

A classe base `.button` ajusta `padding`, `min-height` e `font-size` nos mixins `mobile` e `tablet` de `_breakpoints.scss` (valores exatos no `Button.module.scss`).

## Acessibilidade

- **Hover:** `cursor: pointer` e transição de ~0,2s
- **Contraste:** pensado para leitura em estados padrão e hover (validar pares se mudar a paleta)
- **Feedback visual:** transição e estados claros de interação

## Implementação no repositório

- **Lógica:** `Button.tsx` (renderiza `next/link` se `href` estiver definido, senão `<button>` com `type` e `disabled`).
- **Aparência:** `Button.module.scss` (variante `primary` com `$color-green`; `danger` com hex fixo; mobile com larguras no breakpoint).

Trechos de interface e classes mudam com o tempo; a referência final é sempre o código no Git.
