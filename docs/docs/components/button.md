# Button

Componente de botão reutilizável com duas variantes visuais.

## Variantes

### Primary (Primário)
Botão com fundo verde, usado para ações principais.

```tsx
<Button variant="primary">Abrir minha conta</Button>
```

**Características:**
- Background: `$color-green` (#47A138)
- Cor do texto: Branco
- Borda: 0.2rem sólida verde
- Hover: Background escurece 8%

### Secondary (Secundário)
Botão com fundo transparente e borda verde, usado para ações secundárias.

```tsx
<Button variant="secondary">Já tenho conta</Button>
```

**Características:**
- Background: Transparente
- Cor do texto: Verde
- Borda: 0.2rem sólida verde
- Hover: Background verde + texto branco

## Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `children` | `React.ReactNode` | - | **Obrigatório**. Conteúdo do botão |
| `variant` | `'primary' \| 'secondary'` | `'primary'` | Variante visual do botão |
| `onClick` | `() => void` | - | Função executada ao clicar |
| `className` | `string` | - | Classes CSS adicionais |

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

O botão ajusta automaticamente seu tamanho em diferentes telas:

- **Desktop**: padding 1.2rem 2.4rem | font-size 1.6rem
- **Tablet**: padding 1.8rem 2rem | font-size 1.4rem

## Acessibilidade

- ✅ Cursor pointer no hover
- ✅ Transição suave (0.2s)
- ✅ Contraste adequado (WCAG AA)
- ✅ Feedback visual no hover

## Código Fonte

```tsx
// src/components/atoms/Button/Button.tsx
export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  className?: string;
}

export const Button = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  className 
}: ButtonProps) => {
  return (
    <button 
      className={`${styles.button} ${styles[variant]} ${className || ''}`} 
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

## Estilos

```scss
.button {
  padding: 1.2rem 2.4rem;
  border-radius: 0.8rem;
  font-size: $font-size-base;
  font-weight: $font-weight-medium;
  cursor: pointer;
  transition: all 0.2s;
}

.primary {
  background-color: $color-green;
  color: $color-white;
  border: 0.2rem solid $color-green;
  
  &:hover {
    background-color: darken($color-green, 8%);
  }
}

.secondary {
  background-color: transparent;
  color: $color-green;
  border: 0.2rem solid $color-green;
  
  &:hover {
    background-color: $color-green;
    color: $color-white;
  }
}
```
