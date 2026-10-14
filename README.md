# Conta Comigo — site

Site de apresentação do Conta Comigo, independente da aplicação Web e da API. Contém as seções Início, Sobre, Planos e Contato, com capturas reais da demonstração em um painel interativo.

## Desenvolvimento

Requer Node.js. Na pasta deste projeto:

```sh
npm ci
npm run dev
```

Para gerar a versão de publicação:

```sh
npm run build
```

O resultado fica em `dist/`. Na Cloudflare Pages, configure **Build command** como `npm run build` e **Build output directory** como `dist`. O código está no repositório privado `guicamarg0/conta-comigo-site`; a landing ainda não foi publicada.

## Demonstração e contato

Os botões de demonstração levam a `https://gestao-servicos-guicamarg0.pages.dev/demo`, mantida no repositório `conta-comigo-web`. As imagens exibidas são capturas da aplicação com dados fictícios.

O formulário de contato prepara uma mensagem no WhatsApp ou no aplicativo de e-mail da pessoa. O site não armazena nem envia os dados por um serviço próprio. O número comercial e o e-mail estão no código da landing.

## Arquivos

- `src/`: interface, estilos e interações.
- `public/screens/`: capturas da demonstração.
- `public/marca/`: logotipo e símbolo.
- `public/fonts/`: fontes Noto Sans e licença.

O protótipo anterior permanece no repositório Web, fora deste projeto.
