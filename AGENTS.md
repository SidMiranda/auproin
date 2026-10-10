# AGENTS.md — Operação do site AUPROIN

## Fonte de verdade

- Edite conteúdo em `src/content.mjs` e estrutura em `src/build.mjs`.
- Os HTMLs, `robots.txt`, `sitemap.xml`, `llms.txt` e `llms-full.txt` são gerados. Não os edite isoladamente.
- O domínio canônico é `https://auproin.com.br` e o repositório oficial é `Mobspot/auproin.com.br`.

## Fluxo obrigatório

1. Faça a alteração na fonte.
2. Atualize `ultimaAtualizacao` quando o conteúdo público mudar.
3. Rode `npm run build`.
4. Rode `npm test`.
5. Confira `git diff --exit-code` depois de um segundo build para garantir reprodução.
6. Revise visualmente desktop e celular antes de publicar.

## Limites

- Nunca versione `.env`, tokens, chaves, dados pessoais privados ou credenciais.
- Não altere CNPJ, registro CFT/CRT, habilitações, experiência, resultados, clientes ou normas sem validação humana.
- Não regenere imagens nem use `GEMINI_API_KEY` sem autorização.
- Não altere DNS, MX, Pages, domínio ou produção sem autorização explícita.
- Preserve `CNAME`, HTTPS, rota de parceiros `noindex` e os meios diretos de contato.

## Publicação e rollback

O push na `main` valida build e testes e publica pelo GitHub Pages. O rollback é feito por novo commit que restaure o último SHA validado; não reescreva o histórico publicado.
