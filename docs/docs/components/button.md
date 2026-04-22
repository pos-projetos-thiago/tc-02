# Button

Componente de botão reutilizável com variantes semânticas e visuais.

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

### Primary Mobile
Botões do Hero no mobile. Fundo preto.

```tsx
<Button variant="primaryMobile">Abrir conta</Button>
```

### Secondary Mobile
Botões do Hero no mobile. Outline preto.

```tsx
<Button variant="secondaryMobile">Já tenho conta</Button>
```

## Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `children` | `React.ReactNode` | - | **Obrigatório**. Conteúdo do botão |
| `variant` | `'primary' \| 'secondary' \| 'accent' \| 'primaryMobile' \| 'secondaryMobile'` | `'primary'` | Variante visual do botão |
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

- **Hover:** `cursor: pointer` e transição de ~0,2s
- **Contraste:** pensado para leitura em estados padrão e hover (validar pares se mudar a paleta)
- **Feedback visual:** transição e estados claros de interação

## Código Fonte

```tsx
// src/components/atoms/Button/Button.tsx
export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'primaryMobile' | 'secondaryMobile';
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
