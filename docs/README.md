# Documentação (Docusaurus)

Site estático do **Bytebank Design System** (tokens, guias e componentes).

## Instalação

Na raiz de `docs/`:

```bash
yarn
```

## Desenvolvimento

```bash
yarn start
```

Por padrão o dev server sobe em [http://localhost:3000](http://localhost:3000) dentro de `docs`. Na raiz do repositório principal, use `yarn docs` (porta `4000`).

## Build

```bash
yarn build
```

Gera a pasta `build/`, pronta para publicar em qualquer host estático.

## Publicação (GitHub Pages, opcional)

Ajuste `url` e `baseUrl` em `docusaurus.config.ts` ao publicar. Com deploy via Docusaurus:

```bash
GIT_USER=<seu_usuario_github> yarn deploy
```

(Detalhes oficiais: [Deploying to GitHub Pages](https://docusaurus.io/docs/deployment#deploying-to-github-pages).)
