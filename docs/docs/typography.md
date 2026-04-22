# Tipografia

A interface usa a família **Inter** (carregada no app) e um sistema **REMs** com base 10 (configuração global de `html`) para conversões previsíveis.

## Escala (referência)

Exemplos comuns mapeados em `src/styles/_typography.scss`:

| Uso aproximado   | Tamanho típico (exemplo) |
|------------------|--------------------------|
| Auxiliar pequeno | `1.3rem` (13px)         |
| Corpo / padrão   | `1.6rem` (16px)         |
| Subtítulos       | `1.8rem` – `2.0rem`     |
| Títulos H1/H2    | `3.0rem` e afins         |
| Display / hero  | `3.6rem` – `4.8rem`      |

(Valores exatos seguem as variáveis do repositório; ajuste só na fonte SCSS e atualize aqui se mudar.)

## Pesos

- `400` — leitura contínua
- `500` / `600` — ênfase, subtítulos
- `700` — títulos, botões em destaque

## Altura de linha

- Títulos: `line-height` mais fechado (ex.: 1.2)
- Corpo: ~1.5
- Blocos longos: pode relaxar ligeiramente (ex.: 1.75)

## Exemplo SCSS

```scss
@import '@/styles/typography';

h1 {
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  line-height: $line-height-tight;
}

p {
  font-size: $font-size-base;
  line-height: $line-height-base;
}
```

## Boas práticas

1. Priorize variáveis de tipografia e cores, não hex ou px soltos
2. Prefira `rem` a `px` no que impacte leitura e zoom do usuário
3. Respeite hierarquia: H1 → H2 → H3 → parágrafo
4. Evite tamanhos muito próximos; poucos tamanhos claros leem melhor que muitas famílias de “quase iguais”
