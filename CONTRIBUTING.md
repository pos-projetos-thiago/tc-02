# Como Contribuir

Obrigado por considerar contribuir com o Bytebank! 🚀

## Fluxo de Trabalho

1. **Crie uma branch** a partir de `dev`:
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feat/nome-da-feature
   ```

2. **Faça suas alterações** seguindo os padrões do projeto

3. **Antes de commitar**, rode localmente:
   ```bash
   yarn lint
   yarn build
   ```

4. **Abra um Pull Request** para a branch `dev`
   - Use o template de PR
   - Descreva claramente o que foi feito
   - Marque os checkboxes antes de mergear

## Padrões do Projeto

- **Atomic Design**: Organize componentes em `atoms/`, `molecules/`, `organisms/` e `templates/`
- **Design System**: Use variáveis e mixins de `src/styles/` para cores, tipografia e breakpoints
- **SCSS Modules**: Estilos com escopo local (`.module.scss`)
- **TypeScript**: Mantenha tipagem estática

## Estrutura de Branches

- `main` → produção
- `dev` → desenvolvimento / integração
- `feat/*` → novas funcionalidades

## Dúvidas?

Abra uma issue no repositório!
