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

Os botões de demonstração levam a `https://gestao-servicos-guicamarg0.pages.dev/demo`, mantida no repositório `conta-comigo-web`. A vitrine mostra sete telas da aplicação com dados fictícios: orçamentos, PDF do orçamento, clientes, serviços, agenda, contratos e peças. O exemplo ORC-6 em `public/screens/orcamento-exemplo.pdf` é o arquivo original gerado pelo sistema, com logo e cinco itens; `orcamento-pdf.png` é a captura da mesma página.

O formulário de contato prepara uma mensagem no WhatsApp ou no aplicativo de e-mail da pessoa. O site não armazena nem envia os dados por um serviço próprio. O número comercial e o e-mail estão no código da landing.

## Arquivos

- `src/`: interface, estilos e interações.
- `public/screens/`: capturas da demonstração e PDF original do orçamento de exemplo.
- `public/marca/`: logotipo e símbolo.
- `public/fonts/`: fontes Noto Sans e licença.

O protótipo anterior permanece no repositório Web, fora deste projeto.
