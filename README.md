# Site AUPROIN

Site institucional da **AUPROIN — Automação de Processos Industriais**
(Paulo José da Silva Souza, Alumínio/SP).

Site estático puro: HTML, CSS e imagens. Sem framework, sem dependências de
runtime, sem build obrigatório para publicar. Servido direto pelo GitHub Pages.

---

## Como mexer no site

O HTML da raiz é **gerado**. Não edite `index.html`, `servicos/…`, `casos/…` à mão:
a próxima geração sobrescreve. Edite o conteúdo e rode o build.

```bash
node src/build.mjs      # ou: npm run build
node src/preview.mjs    # confere em http://localhost:4321
```

| Arquivo                | Para quê |
| ---------------------- | -------- |
| `src/content.mjs`      | Todo o texto do site: serviços, casos, FAQ, dados da empresa. **É aqui que se edita.** |
| `src/build.mjs`        | Gerador: monta o HTML, o sitemap, o robots.txt e o llms.txt. |
| `src/gerar-imagens.mjs`| Gera as imagens de marca (OG, hero, ícone) via API do Gemini. |
| `src/preview.mjs`      | Servidor local para conferir antes de publicar. |
| `assets/css/site.css`  | Folha de estilo única, escrita à mão. |
| `assets/img/`          | Fotos de campo, logo e imagens geradas. |
| `assets/pdf/`          | Fichas de caso e apresentações para download. |

Trocar um texto, um número de caso ou uma pergunta do FAQ é mexer em
`src/content.mjs` e rodar o build. Nada mais.

---

## Estrutura publicada

| Rota | Público | Papel |
| ---- | ------- | ----- |
| `/` | Cliente final | Abre pelos sintomas, não pela lista de plataformas. Termina no Diagnóstico. |
| `/servicos/` + 4 páginas | Cliente final | Uma página por serviço — são estas que rankeiam em busca local. |
| `/casos/` + 4 páginas | Cliente final | As fichas em HTML (o Google não lê PDF bem), com o PDF para download. |
| `/sobre/` | Ambos | Responsável técnico, registro CFT/CRT, CNPJ, habilitações. |
| `/contato/` | Ambos | WhatsApp em primeiro lugar; formulário como terceira opção. |
| `/parceiros/` | **Integradoras e montadoras** | Fora do menu e com `noindex`. Link passado a mão para o parceiro, para o cliente final dele não tropeçar nela. |

A separação dos dois públicos é deliberada: o cliente final precisa ver um
prestador completo; a integradora precisa ver um parceiro de bastidor que não vai
abordar o cliente dela. As duas mensagens não podem aparecer na mesma página.

---

## Publicar no GitHub Pages

1. Suba o repositório para o GitHub.
2. **Settings → Pages → Source: Deploy from a branch**, branch `main`, pasta `/ (root)`.
3. O site sai em `https://<usuario>.github.io/<repositorio>/`.

O `.nojekyll` na raiz é necessário: sem ele o Jekyll do GitHub ignora arquivos e
pastas iniciadas por `_`.

### Depois de saber a URL definitiva

Preencha `siteUrl` em `src/content.mjs` e rode o build de novo:

```js
export const siteUrl = 'https://usuario.github.io/auproin';
```

Sem isso o site funciona, mas fica **sem** `canonical`, `og:url` e com o
`sitemap.xml` e o `llms.txt` em caminho relativo — o que enfraquece o SEO e
atrapalha o preview do link no WhatsApp e no LinkedIn.

### Domínio próprio (auproin.com.br)

Quando for apontar o domínio: crie um arquivo `CNAME` na raiz contendo só
`auproin.com.br`, configure o DNS conforme a documentação do GitHub Pages e
atualize o `siteUrl`. Enquanto o DNS não estiver propagado, o `CNAME` derruba o
endereço `.github.io` — por isso ele ainda não existe aqui.

---

## SEO

Já implementado:

- Uma página por serviço e por caso, com `<title>` e `description` próprios —
  é o que permite aparecer em busca do tipo "programação de CLP Sorocaba".
- `canonical`, Open Graph e Twitter Card completos, com imagem 1200×630.
- JSON-LD: `ProfessionalService` com `areaServed` cidade a cidade, `Service` por
  página de serviço, `Article` por caso, `Person` no Sobre, `FAQPage` na home e
  `BreadcrumbList` nas páginas internas.
- `sitemap.xml` e `robots.txt` (com `/parceiros/` fora da busca).
- `llms.txt` e `llms-full.txt` — mapa e conteúdo integral do site em texto, para
  ChatGPT, Claude, Perplexity e Gemini citarem a empresa corretamente.
- HTML semântico, um `<h1>` por página, `alt` em toda imagem, `skip link`.

**O que pesa mais que o site:** o Perfil da Empresa no Google. É ele que aparece
no mapa e no telefone de quem busca "automação industrial perto de mim" em
Sorocaba. Categoria correta, área de atendimento cobrindo as cidades, fotos reais
e horário — vale o mesmo esforço que o site, e é para ser feito antes.

---

## Imagens

As fotos de painel em `assets/img/painel-*.jpg` são reais, feitas em campo.
Elas são o ativo mais forte do site e devem ser preferidas a qualquer imagem gerada.

`og-auproin.jpg`, `hero-auproin.jpg` e os ícones foram gerados com
`src/gerar-imagens.mjs` (Gemini `gemini-3-pro-image`), usando `assets/img/logo.png`
como referência para que a marca saia fiel. Para regerar:

```bash
node src/gerar-imagens.mjs            # todas
node src/gerar-imagens.mjs og         # só o cartão de compartilhamento
```

Requer `GEMINI_API_KEY` no `.env` (veja `.env.example`). O script grava PNG grande;
para reduzir ao tamanho web use `sharp` — o passo não está no repositório porque é
pontual.

Regra da marca: nada de robô azul brilhante, holograma ou "IA industrial". Foto de
instalação de cliente só com autorização escrita.

---

## O que **não** entra aqui

- `.env` — chaves de API. Está no `.gitignore`.
- `_arquivo/` — currículos, PDFs originais, o canvas antigo e o zip. Fica no disco,
  fora do repositório. Currículo não entra no site da empresa: busca por vaga e
  site institucional não se misturam.
- Tabela de preços.
