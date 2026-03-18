# Cores

O sistema de cores do Bytebank foi projetado para transmitir confiança, modernidade e acessibilidade.

## Cores Principais

### Primary (Principal)
- **Variável**: `$color-primary`
- **Valor**: `#004D61`
- **Uso**: Elementos principais, identidade visual

### Accent (Destaque)
- **Variável**: `$color-accent`
- **Valor**: `#FF5031`
- **Uso**: Botões de ação, call-to-actions

### Error
- **Variável**: `$color-error`
- **Valor**: `#BF1313`
- **Uso**: Mensagens de erro, validações

## Cores Neutras

### White
- **Variável**: `$color-white`
- **Valor**: `#FFFFFF`

### Black
- **Variável**: `$color-black`
- **Valor**: `#000000`

### Escala de Cinza

| Variável | Valor | Uso |
|----------|-------|-----|
| `$color-gray-50` | `#F8F8F8` | Backgrounds claros |
| `$color-gray-200` | `#DEE9EA` | Bordas, dividers |
| `$color-gray-400` | `#767676` | Textos secundários |
| `$color-gray-500` | `#8B8B8B` | Textos desabilitados |

## Cores de Destaque

### Blue
- **Variável**: `$color-blue`
- **Valor**: `#2567F9`

### Purple
- **Variável**: `$color-purple`
- **Valor**: `#8F3CFF`

### Orange
- **Variável**: `$color-orange`
- **Valor**: `#F1823D`

### Pink
- **Variável**: `$color-pink`
- **Valor**: `#FF3C82`

### Green
- **Variável**: `$color-green`
- **Valor**: `#47A138`
- **Uso**: Botões positivos, sucesso

## Gradientes

### Gradient Primary
- **Variável**: `$gradient-primary`
- **Valor**: `linear-gradient(180deg, #004D61 0%, #FFFFFF 100%)`
- **Uso**: Hero section, backgrounds principais

## Como usar

```scss
@import '@/styles/colors';

.meu-componente {
  background-color: $color-primary;
  color: $color-white;
  
  &:hover {
    background-color: darken($color-primary, 10%);
  }
}
```

## Acessibilidade

Todas as combinações de cores foram testadas para garantir contraste adequado (WCAG AA):
- Texto preto em fundos claros: ✅ AAA
- Texto branco em fundos escuros: ✅ AAA
- Botões verdes: ✅ AA
