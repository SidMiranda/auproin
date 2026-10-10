/* Gerador estático do site AUPROIN.
   Uso: node src/build.mjs
   Lê src/content.mjs e escreve o HTML na raiz do repositório. */

import { mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  siteUrl, ultimaAtualizacao, empresa, waTextoPadrao, waTextoParceiro,
  sintomas, diagnostico, casos, servicos, parceiros, sobre, faq, contatoLinhas,
} from './content.mjs';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Endereço absoluto do site, sem barra final. Vazio = URLs só relativas. */
const BASE = (process.env.SITE_URL || siteUrl || '').replace(/\/+$/, '');
const abs = (caminho) => (BASE ? `${BASE}/${caminho}` : null);

/* ------------------------------------------------------------------ */
/* utilidades                                                          */
/* ------------------------------------------------------------------ */

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const wa = (texto) => `https://wa.me/${empresa.whatsapp}?text=${encodeURIComponent(texto)}`;
const waPadrao = wa(waTextoPadrao);
const waParceiro = wa(waTextoParceiro);

const corners = '<i class="c tl"></i><i class="c tr"></i><i class="c bl"></i><i class="c br"></i>';

/** Prefixo relativo para voltar à raiz do site a partir de uma rota. */
const upTo = (rota) => (rota === '' ? '' : '../'.repeat(rota.split('/').length));

const lista = (itens) => `<ul class="ticks">${itens.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;

/* ------------------------------------------------------------------ */
/* páginas registradas (rota => metadados), usado por nav e sitemap     */
/* ------------------------------------------------------------------ */

const NAV = [
  { rota: '', rotulo: 'Início' },
  { rota: 'servicos', rotulo: 'Serviços' },
  { rota: 'casos', rotulo: 'Casos' },
  { rota: 'sobre', rotulo: 'Sobre' },
  { rota: 'contato', rotulo: 'Contato' },
];

const paginas = []; // { rota, prioridade }

/* ------------------------------------------------------------------ */
/* layout                                                              */
/* ------------------------------------------------------------------ */

function layout({ rota, titulo, descricao, corpo, jsonLd = null, noindex = false, trilha = null }) {
  const up = upTo(rota);
  const ativo = (r) => (r === rota || (r !== '' && rota.startsWith(r + '/')) ? ' aria-current="page"' : '');
  const href = (r) => (r === '' ? up || './' : `${up}${r}/`);

  const nav = NAV.map((n) => `<a href="${href(n.rota)}"${ativo(n.rota)}>${n.rotulo}</a>`).join('\n      ');

  const urlPagina = abs(rota ? rota + '/' : '');
  const urlOg = abs('assets/img/og-auproin.jpg') || `${up}assets/img/og-auproin.jpg`;

  // Migalhas em JSON-LD: dá ao Google o caminho da página no resultado de busca.
  const trilhaLd = trilha && BASE ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trilha.map((t, i) => ({
      '@type': 'ListItem', position: i + 1, name: t.nome, item: abs(t.rota ? t.rota + '/' : ''),
    })),
  } : null;

  const blocosLd = [...(Array.isArray(jsonLd) ? jsonLd : [jsonLd]), trilhaLd].filter(Boolean)
    .map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(descricao)}">
${noindex
    ? '<meta name="robots" content="noindex, follow">'
    : '<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">'}
${urlPagina ? `<link rel="canonical" href="${urlPagina}">` : ''}
<meta name="author" content="${esc(empresa.responsavel)}">
<meta name="geo.region" content="BR-SP">
<meta name="geo.placename" content="Alumínio, São Paulo">
<meta name="theme-color" content="#b8000a">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(empresa.nomeCompleto)}">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(descricao)}">
<meta property="og:image" content="${urlOg}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Logotipo AUPROIN sobre painel elétrico industrial">
<meta property="og:locale" content="pt_BR">
${urlPagina ? `<meta property="og:url" content="${urlPagina}">` : ''}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(titulo)}">
<meta name="twitter:description" content="${esc(descricao)}">
<meta name="twitter:image" content="${urlOg}">
<meta name="twitter:image:alt" content="Logotipo AUPROIN sobre painel elétrico industrial">
<link rel="icon" href="${up}assets/img/favicon-32.png" sizes="32x32" type="image/png">
<link rel="icon" href="${up}assets/img/favicon-192.png" sizes="192x192" type="image/png">
<link rel="apple-touch-icon" href="${up}assets/img/apple-touch-icon.png">
<link rel="manifest" href="${up}site.webmanifest">
<link rel="stylesheet" href="${up}assets/css/site.css">
${blocosLd}
</head>
<body>
<a class="skip" href="#conteudo">Pular para o conteúdo</a>

<nav class="nav">
  <a class="nav__brand" href="${href('')}"><img src="${up}assets/img/logo.png" alt="${esc(empresa.nomeCompleto)}" width="264" height="44"></a>
  ${nav}
  <a class="btn btn-primary" href="${waPadrao}" target="_blank" rel="noopener" data-event="contato_whatsapp" data-location="navegacao">Diagnóstico de Automação</a>
</nav>

<main id="conteudo">
${corpo}
</main>

<footer class="footer">
  <div class="wrap">
    <div>
      <img src="${up}assets/img/logo.png" alt="" width="240" height="40">
      <div>${esc(empresa.nomeCompleto)}</div>
      <div>${esc(empresa.razaoSocial)}</div>
      <div>CNPJ ${esc(empresa.cnpj)}</div>
    </div>
    <div>
      <h2>Responsável técnico</h2>
      <div>${esc(empresa.responsavel)}</div>
      <div>Registro CFT/CRT ${esc(empresa.crt)}</div>
      <div>${esc(empresa.cidade)}</div>
    </div>
    <div>
      <h2>Contato</h2>
      <ul>
        <li><a href="tel:${empresa.telefoneUrl}" data-event="contato_telefone" data-location="rodape">${esc(empresa.telefone)}</a></li>
        <li><a href="mailto:${empresa.email}" data-event="contato_email" data-location="rodape">${esc(empresa.email)}</a></li>
        <li><a href="${empresa.linkedin}" target="_blank" rel="noopener">LinkedIn</a></li>
      </ul>
    </div>
    <div>
      <h2>Serviços</h2>
      <ul>
        ${servicos.map((s) => `<li><a href="${up}servicos/${s.slug}/">${esc(s.tituloCurto)}</a></li>`).join('\n        ')}
      </ul>
    </div>
  </div>
  <div class="legal">
    <span>© ${ultimaAtualizacao.slice(0, 4)} ${esc(empresa.nome)}. Todos os direitos reservados.</span>
    <span>Atendimento em ${esc(empresa.regiao)}.</span>
  </div>
</footer>

<a class="wa-float" href="${waPadrao}" target="_blank" rel="noopener" aria-label="Agendar Diagnóstico de Automação pelo WhatsApp" data-event="contato_whatsapp" data-location="flutuante">
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path></svg>
  <span>Diagnóstico de Automação</span>
</a>
<script>
  // Os atributos data-event preparam a medição sem acoplar o site a um provedor.
  // Quando o GA4 for ativado, o gtag já receberá os cliques de conversão.
  document.addEventListener('click', function (evento) {
    var alvo = evento.target.closest('[data-event]');
    if (!alvo || typeof window.gtag !== 'function') return;
    window.gtag('event', alvo.dataset.event, {
      event_category: 'contato',
      event_label: alvo.dataset.location || 'site'
    });
  });
</script>
</body>
</html>
`;
}

function escrever(rota, html, meta = {}) {
  const { prioridade = 0.6, indexar = true, titulo = '', descricao = '' } = meta;
  const destino = rota === '' ? join(RAIZ, 'index.html') : join(RAIZ, rota, 'index.html');
  mkdirSync(dirname(destino), { recursive: true });
  writeFileSync(destino, html, 'utf8');
  if (indexar) paginas.push({ rota, prioridade, titulo, descricao });
}

/** Monta o HTML da página, grava e registra em sitemap/llms.txt. */
function pagina(opcoes) {
  const { prioridade = 0.6, indexar = true, ...doLayout } = opcoes;
  escrever(doLayout.rota, layout(doLayout), {
    prioridade, indexar, titulo: doLayout.titulo, descricao: doLayout.descricao,
  });
}

/* ------------------------------------------------------------------ */
/* blocos reutilizados                                                 */
/* ------------------------------------------------------------------ */

function blocoDiagnostico(up, { escuro = true } = {}) {
  return `
  <section class="${escuro ? 'section section--dark' : 'section'}">
    <div class="wrap">
      <span class="eyebrow">Por onde começar</span>
      <hr class="rule">
      <div class="grid grid--2">
        <div>
          <h2 class="h-page" style="max-width:16ch">Comece por um Diagnóstico de Automação</h2>
          <p class="lead">Um dia na sua planta, relatório técnico em até cinco dias úteis, escopo e valor fechados antes do início. O relatório é seu, com ou sem contratação da execução.</p>
          <div class="btns"><a class="btn btn-primary" href="${waPadrao}" target="_blank" rel="noopener" data-event="contato_whatsapp" data-location="diagnostico">Agendar pelo WhatsApp</a></div>
        </div>
        <div class="bp">
          ${corners}
          <div class="bp-head"><span>O relatório entrega</span><span>Folha 01 de 01</span></div>
          <div class="rows rows--num">
            ${diagnostico.map((t, i) => `<div><span class="k num">${String(i + 1).padStart(2, '0')}</span><span>${esc(t)}</span></div>`).join('\n            ')}
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

function cardServico(up, s) {
  return `<a class="bp card" href="${up}servicos/${s.slug}/">
        ${corners}
        <span class="num">${s.n}</span>
        <h3 class="h-card">${esc(s.titulo)}</h3>
        <p class="prose mt-0">${esc(s.resumo)}</p>
        <span class="card__more">Ver serviço &rarr;</span>
      </a>`;
}

function cardCaso(up, c) {
  return `<a class="bp card" href="${up}casos/${c.slug}/">
        ${corners}
        <span class="num">Ficha ${c.n} · ${esc(c.area)}</span>
        <span style="font-family:var(--font-heading);font-weight:600;font-size:40px;line-height:1;font-feature-settings:'tnum' 1">${esc(c.numeros[0].v)}</span>
        <span class="small">${esc(c.numeros[0].l)}</span>
        <h3 style="font-family:var(--font-heading);font-weight:600;font-size:20px;line-height:1.2;margin:8px 0 0">${esc(c.titulo)}</h3>
        <span class="card__more">Ler a ficha &rarr;</span>
      </a>`;
}

/* ------------------------------------------------------------------ */
/* JSON-LD                                                             */
/* ------------------------------------------------------------------ */

const negocioJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  ...(BASE ? { '@id': `${BASE}/#empresa` } : {}),
  name: empresa.nomeCompleto,
  legalName: empresa.razaoSocial,
  description: 'Engenharia de automação industrial: programação de CLP, IHM e SCADA, retrofit de máquina, projeto elétrico de painéis e comissionamento.',
  telephone: empresa.telefoneUrl,
  email: empresa.email,
  taxID: empresa.cnpj,
  address: { '@type': 'PostalAddress', addressLocality: 'Alumínio', addressRegion: 'SP', addressCountry: 'BR' },
  areaServed: ['Alumínio', 'Mairinque', 'São Roque', 'Votorantim', 'Araçariguama', 'Iperó', 'Sorocaba', 'Itu'].map((c) => ({ '@type': 'City', name: c })),
  founder: { '@type': 'Person', name: empresa.responsavel, jobTitle: 'Responsável Técnico', sameAs: empresa.linkedin },
  knowsAbout: ['Programação de CLP', 'IHM e SCADA', 'Retrofit industrial', 'Comissionamento', 'NR-12', 'ISA-18.2', 'ISA-101'],
  sameAs: [empresa.linkedin],
  ...(BASE ? { url: BASE + '/', logo: abs('assets/img/logo.png'), image: abs('assets/img/og-auproin.jpg') } : {}),
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Serviços de automação industrial',
    itemListElement: servicos.map((s) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: s.titulo, description: s.resumo },
    })),
  },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map((f) => ({
    '@type': 'Question',
    name: f.p,
    acceptedAnswer: { '@type': 'Answer', text: f.r },
  })),
};

/* ------------------------------------------------------------------ */
/* HOME                                                                */
/* ------------------------------------------------------------------ */

{
  const up = '';
  const corpo = `
  <section class="hero">
    <div class="wrap">
      <div class="hero__texto">
        <h1 class="h-hero">Automação industrial com engenharia própria,<br><span class="accent">a 30 minutos da sua planta</span></h1>
        <p class="lead">CLP, IHM e SCADA — projeto novo, retrofit, diagnóstico de falhas e adequação normativa para indústrias de ${esc(empresa.regiao)}. 28 anos de experiência em plantas de grande porte, com responsabilidade técnica formal (registro ativo no CFT/CRT e emissão de TRT). Base em ${esc(empresa.cidade)}: atendimento no mesmo dia, sem custo de deslocamento de capital.</p>
        <div class="btns">
          <a class="btn btn-primary" href="${waPadrao}" target="_blank" rel="noopener" data-event="contato_whatsapp" data-location="home_hero">Agendar Diagnóstico de Automação</a>
          <a class="btn btn-secondary" href="servicos/">Ver serviços</a>
        </div>
      </div>
    </div>
    <img class="hero__foto" src="assets/img/hero-auproin.jpg" alt="Painel de comando industrial em aço inox com IHM, identificado com a marca AUPROIN" width="1920" height="1072" fetchpriority="high">
  </section>

  <section class="section section--tight">
    <div class="wrap">
      <span class="eyebrow">01 · Sua planta tem algum destes problemas?</span>
      <hr class="rule">
      <div class="grid grid--4">
        ${sintomas.map((t, i) => `<div class="bp" style="padding:22px;display:flex;gap:14px;align-items:flex-start">
          ${corners}
          <span class="num" style="line-height:1.6;flex:none">${String(i + 1).padStart(2, '0')}</span>
          <p style="margin:0;font-size:15px;line-height:1.6">${esc(t)}</p>
        </div>`).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="section section--tight">
    <div class="wrap">
      <span class="eyebrow">02 · O que fazemos</span>
      <hr class="rule">
      <div class="grid grid--2x2">
        ${servicos.map((s) => cardServico(up, s)).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap grid grid--2 grid--split">
      <div>
        <span class="eyebrow">03 · Em campo</span>
        <hr class="rule rule--tight">
        <h2 class="h-sec">Do levantamento ao start-up, com um único responsável técnico</h2>
        <p class="prose">Engenharia, programação e documentação executadas remotamente; presença em campo nas fases de levantamento, comissionamento e start-up. Entrega documentada em todos os formatos: backup do programa comentado, lista de I/O, descritivo funcional e relatório de comissionamento.</p>
        <p class="prose">Documentação para acesso a planta: CNPJ ativo, NR-10 e SEP, NR-12, NR-35, ASO e registro CFT/CRT vigentes, com emissão de TRT.</p>
      </div>
      <figure class="bp">
        <img src="assets/img/painel-ihm-calcinador.jpg" alt="Painel de comando em aço inox com IHM Siemens exibindo a tela do sistema de exaustão" loading="lazy" width="1600" height="1200">
        ${corners}
      </figure>
    </div>
  </section>

  ${blocoDiagnostico(up)}

  <section class="section">
    <div class="wrap">
      <span class="eyebrow">05 · Perguntas frequentes</span>
      <hr class="rule">
      <div class="faq">
        ${faq.map((f) => `<details class="bp">
          <summary>${corners}<span>${esc(f.p)}</span></summary>
          <p>${esc(f.r)}</p>
        </details>`).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <span class="eyebrow">06 · Referências técnicas</span>
      <hr class="rule">
      <div class="grid grid--2x2">
        ${casos.map((c) => cardCaso(up, c)).join('\n        ')}
      </div>
      <p class="prose" style="margin-top:32px;max-width:72ch">Experiência construída em CBA (Alumínio/SP), Gerdau Aços Longos e Moxba Metalúrgica do Brasil (Araçariguama/SP), além dos projetos próprios da AUPROIN.</p>
    </div>
  </section>`;

  pagina({
    rota: '',
    titulo: 'AUPROIN — Automação industrial em Sorocaba e região | CLP, IHM e SCADA',
    descricao: 'Engenharia de automação industrial em Alumínio, São Roque, Votorantim, Sorocaba e região: programação de CLP, IHM e SCADA, retrofit de máquina, projeto elétrico e comissionamento. 28 anos de experiência, com responsabilidade técnica formal.',
    corpo,
    jsonLd: [negocioJsonLd, faqJsonLd],
    prioridade: 1.0,
});
}

/* ------------------------------------------------------------------ */
/* SERVIÇOS — hub                                                      */
/* ------------------------------------------------------------------ */

{
  const up = '../';
  const corpo = `
  <section class="section">
    <div class="wrap">
      <span class="eyebrow">Serviços</span>
      <hr class="rule rule--tight">
      <h1 class="h-page">Quatro escopos, um responsável técnico</h1>
      <p class="lead">Escopo fechado, diária de campo ou contrato mensal de retenção. Entrega documentada em todos os formatos e NDA assinado quando solicitado.</p>
      <div class="grid grid--2x2" style="margin-top:48px">
        ${servicos.map((s) => cardServico(up, s)).join('\n        ')}
      </div>
    </div>
  </section>
  ${blocoDiagnostico(up)}`;

  pagina({
    rota: 'servicos',
    titulo: 'Serviços de automação industrial — CLP, retrofit, painéis e comissionamento | AUPROIN',
    descricao: 'Programação de CLP, IHM e SCADA; retrofit e modernização de máquina; projeto elétrico e de painéis; comissionamento e start-up. Escopo fechado, diária de campo ou retenção mensal.',
    corpo,
    prioridade: 0.9,
});
}

/* ------------------------------------------------------------------ */
/* SERVIÇOS — páginas individuais                                      */
/* ------------------------------------------------------------------ */

for (const s of servicos) {
  const up = '../../';
  const rota = `servicos/${s.slug}`;
  const corpo = `
  <section class="section">
    <div class="wrap">
      <p class="breadcrumb"><a href="${up}servicos/">Serviços</a> · ${s.n}</p>
      <hr class="rule rule--tight">
      <h1 class="h-page">${esc(s.titulo)}</h1>
      <p class="lead">${esc(s.chamada)}</p>

      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:48px clamp(24px,4vw,64px);margin-top:64px">
        <div>
          <span class="eyebrow">O problema</span>
          <hr class="rule rule--tight">
          ${lista(s.problema)}
        </div>
        <div>
          <span class="eyebrow">O método</span>
          <hr class="rule rule--tight">
          ${lista(s.metodo)}
        </div>
        <div>
          <span class="eyebrow">O que é entregue</span>
          <hr class="rule rule--tight">
          ${lista(s.entrega)}
        </div>
      </div>

      <div class="bp" style="margin-top:64px">
        ${corners}
        <div class="bp-head"><span>Plataformas e normas</span><span>${s.n}</span></div>
        <p style="margin:0;padding:16px 24px;font-size:15px;line-height:1.6">${esc(s.plataformas)}</p>
      </div>

      <div class="grid grid--2 grid--split" style="margin-top:72px">
        <figure class="bp">
          <img src="${up}${s.foto}" alt="${esc(s.fotoAlt)}" loading="lazy" width="1600" height="1200">
          ${corners}
        </figure>
        <div>
          <span class="eyebrow">Caso relacionado · Ficha ${s.caso.n}</span>
          <hr class="rule rule--tight">
          <h2 class="h-sec" style="text-transform:none">${esc(s.caso.titulo)}</h2>
          <p class="prose">${esc(s.caso.subtitulo)}</p>
          <div class="btns">
            <a class="btn btn-secondary" href="${up}casos/${s.caso.slug}/">Ler a ficha completa</a>
            <a class="btn btn-primary" href="${waPadrao}" target="_blank" rel="noopener" data-event="contato_whatsapp" data-location="servico">Agendar Diagnóstico</a>
          </div>
        </div>
      </div>
    </div>
  </section>
  ${blocoDiagnostico(up)}`;

  pagina({
    rota,
    titulo: `${s.metaTitulo} | AUPROIN`,
    descricao: s.metaDescricao,
    corpo,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: s.titulo,
      description: s.metaDescricao,
      serviceType: s.titulo,
      provider: { '@type': 'ProfessionalService', ...(BASE ? { '@id': `${BASE}/#empresa` } : {}), name: empresa.nomeCompleto, telephone: empresa.telefoneUrl },
      ...(BASE ? { url: abs(`${rota}/`) } : {}),
      areaServed: { '@type': 'AdministrativeArea', name: 'Sorocaba e região, São Paulo, Brasil' },
    },
    trilha: [{ nome: 'Início', rota: '' }, { nome: 'Serviços', rota: 'servicos' }, { nome: s.titulo, rota }],
    prioridade: 0.9,
});
}

/* ------------------------------------------------------------------ */
/* CASOS — hub                                                         */
/* ------------------------------------------------------------------ */

{
  const up = '../';
  const corpo = `
  <section class="section">
    <div class="wrap">
      <span class="eyebrow">Casos</span>
      <hr class="rule rule--tight">
      <h1 class="h-page">Quatro fichas de caso</h1>
      <p class="lead">Situação, o que foi feito e o resultado. Cada ficha tem página própria e está disponível em PDF para download, sem cadastro.</p>
      <div class="grid grid--2x2" style="margin-top:48px">
        ${casos.map((c) => cardCaso(up, c)).join('\n        ')}
      </div>
    </div>
  </section>
  ${blocoDiagnostico(up)}`;

  pagina({
    rota: 'casos',
    titulo: 'Casos de automação industrial — retrofit, first-out, comissionamento e KPIs | AUPROIN',
    descricao: 'Quatro fichas de caso da AUPROIN: retrofit de comando por relés para CLP e IHM, detecção de primeira causa, projeto e comissionamento de plantas, e dados de processo virando indicador.',
    corpo,
    prioridade: 0.9,
});
}

/* ------------------------------------------------------------------ */
/* CASOS — páginas individuais                                         */
/* ------------------------------------------------------------------ */

for (const c of casos) {
  const up = '../../';
  const rota = `casos/${c.slug}`;
  const relacionado = servicos.find((s) => s.caso.slug === c.slug);
  const corpo = `
  <section class="section">
    <div class="wrap">
      <p class="breadcrumb"><a href="${up}casos/">Casos</a> · Ficha ${c.n} · ${esc(c.area)}</p>
      <hr class="rule rule--tight">
      <h1 class="h-page" style="text-transform:none;max-width:24ch">${esc(c.titulo)}</h1>
      <p class="lead">${esc(c.subtitulo)}</p>

      <div class="stats" style="margin-top:48px">
        ${c.numeros.map((n) => `<div><b>${esc(n.v)}</b><span>${esc(n.l)}</span></div>`).join('\n        ')}
      </div>

      <div class="grid grid--2" style="margin-top:48px;align-items:start">
        <div>
          <span class="eyebrow">A situação</span>
          <hr class="rule rule--tight">
          <p style="margin:0;font-size:15px;line-height:1.65">${esc(c.situacao)}</p>
          <span class="eyebrow" style="margin-top:32px">O resultado</span>
          <hr class="rule rule--tight">
          <p style="margin:0;font-size:15px;line-height:1.65">${esc(c.resultado)}</p>
        </div>
        <div>
          <span class="eyebrow">O que foi feito</span>
          <hr class="rule rule--tight">
          ${lista(c.feito)}
        </div>
      </div>

      <figure class="bp" style="margin-top:56px;max-width:760px">
        <img src="${up}${c.foto}" alt="${esc(c.fotoAlt)}" loading="lazy" width="1600" height="1200">
        ${corners}
      </figure>

      <p class="small" style="margin-top:40px;padding-top:16px;border-top:1px solid var(--divider)">${esc(c.plataforma)}</p>

      <div class="btns">
        <a class="btn btn-secondary" href="${up}${c.pdf}" download>Baixar ficha em PDF</a>
        ${relacionado ? `<a class="btn btn-secondary" href="${up}servicos/${relacionado.slug}/">Serviço: ${esc(relacionado.tituloCurto)}</a>` : ''}
        <a class="btn btn-primary" href="${waPadrao}" target="_blank" rel="noopener" data-event="contato_whatsapp" data-location="caso">Agendar Diagnóstico</a>
      </div>
      <p class="prose" style="margin-top:16px">${esc(c.gancho)}</p>
    </div>
  </section>
  ${blocoDiagnostico(up)}`;

  pagina({
    rota,
    titulo: `${c.titulo} — Ficha ${c.n} | AUPROIN`,
    descricao: c.metaDescricao,
    corpo,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: c.titulo,
      description: c.metaDescricao,
      author: { '@type': 'Person', name: empresa.responsavel },
      publisher: { '@type': 'Organization', name: empresa.nomeCompleto },
      inLanguage: 'pt-BR',
      dateModified: ultimaAtualizacao,
      ...(BASE ? { mainEntityOfPage: abs(`${rota}/`), image: abs(c.foto) } : {}),
    },
    trilha: [{ nome: 'Início', rota: '' }, { nome: 'Casos', rota: 'casos' }, { nome: c.titulo, rota }],
    prioridade: 0.8,
});
}

/* ------------------------------------------------------------------ */
/* PARCEIROS — fora do menu, noindex                                   */
/* ------------------------------------------------------------------ */

{
  const up = '../';
  const corpo = `
  <section class="section">
    <div class="wrap">
      <span class="eyebrow">Apresentação de capacidade técnica · Para integradoras, montadoras de painéis e fabricantes de máquinas</span>
      <hr class="rule rule--tight">
      <h1 class="h-page">Capacidade de engenharia adicional dentro do seu contrato</h1>
      <p class="lead">A AUPROIN assume o escopo de controle — programação, integração e comissionamento — sem concorrer pelo contrato principal e sem abordagem comercial ao seu cliente. Responsável técnico com 28 anos de experiência em plantas de siderurgia, metalurgia e fundição, atuando do projeto ao start-up.</p>
      <div class="btns">
        <a class="btn btn-primary" href="${waParceiro}" target="_blank" rel="noopener" data-event="contato_whatsapp" data-location="parceiros">Falar sobre uma parceria</a>
        <a class="btn btn-secondary" href="${up}assets/pdf/AUPROIN_Apresentacao_Capacidade_Tecnica.pdf" download>Baixar apresentação em PDF</a>
      </div>
    </div>
  </section>

  <section class="section section--tight">
    <div class="wrap">
      <span class="eyebrow">Escopos que assumimos</span>
      <hr class="rule">
      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:48px clamp(24px,4vw,64px)">
        ${parceiros.colunas.map((col) => `<div>
          <h2 class="h-card">${esc(col.titulo)}</h2>
          <hr class="rule rule--tight" style="margin-top:12px">
          ${lista(col.itens)}
        </div>`).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="section section--dark">
    <div class="wrap">
      <span class="eyebrow">Como a parceria funciona</span>
      <hr class="rule">
      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:32px">
        ${parceiros.como.map((h) => `<div style="display:flex;flex-direction:column;gap:10px">
          <span class="num">${h.n}</span>
          <h3 class="h-card">${esc(h.titulo)}</h3>
          <p style="margin:0;font-size:15px;line-height:1.6;color:color-mix(in srgb, var(--bg) 82%, transparent)">${esc(h.texto)}</p>
        </div>`).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <span class="eyebrow">Referências técnicas</span>
      <hr class="rule">
      <div class="grid grid--3">
        ${parceiros.referencias.map((r) => `<div class="bp card">${corners}<p style="margin:0;font-size:15px;line-height:1.6">${esc(r)}</p></div>`).join('\n        ')}
      </div>

      <div class="bp" style="margin-top:56px">
        ${corners}
        <div class="bp-head"><span>Disponibilidade e habilitação</span><span>${esc(empresa.cidade)}</span></div>
        <div style="padding:16px 24px">${lista(parceiros.disponibilidade)}</div>
      </div>
    </div>
  </section>`;

  pagina({
    rota: 'parceiros',
    titulo: 'Parceria em programação de CLP e comissionamento — para integradoras e montadoras de painéis | AUPROIN',
    descricao: 'Capacidade de engenharia adicional dentro do seu contrato: programação, integração e comissionamento, com NDA e cláusula de não-solicitação, sem abordagem comercial ao seu cliente.',
    corpo,
    noindex: true,
    prioridade: 0.5,
  indexar: false,
});
}

/* ------------------------------------------------------------------ */
/* SOBRE                                                               */
/* ------------------------------------------------------------------ */

{
  const up = '../';
  const corpo = `
  <section class="section">
    <div class="wrap">
      <span class="eyebrow">Sobre · Responsável técnico</span>
      <hr class="rule">
      <div class="grid grid--2" style="align-items:start">
        <figure class="bp">
          <img src="${up}assets/img/paulo-souza.jpg" alt="${esc(empresa.responsavel)}, responsável técnico da AUPROIN, em galpão industrial" width="1000" height="1250" style="aspect-ratio:4/5" fetchpriority="high">
          ${corners}
          <figcaption>${esc(empresa.responsavel)} — ${esc(empresa.cargo)}.</figcaption>
        </figure>
        <div>
          <h1 class="h-page">${esc(empresa.responsavel)}</h1>
          <p style="font-size:16px;line-height:1.5;margin:16px 0 0;color:var(--accent-700);font-weight:500">${esc(empresa.cargo)} — ${esc(empresa.nome)}</p>
          <p class="lead">${esc(sobre.resumo)}</p>

          <div class="bp rows" style="margin-top:32px">
            ${corners}
            ${sobre.ficha.map((r) => `<div><span class="k">${esc(r.k)}</span><span>${esc(r.v)}</span></div>`).join('\n            ')}
          </div>

          <span class="eyebrow" style="margin-top:40px">Trajetória</span>
          <hr class="rule rule--tight" style="margin-bottom:4px">
          ${sobre.trajetoria.map((j) => `<div style="display:grid;grid-template-columns:minmax(120px,170px) 1fr;gap:12px;padding:14px 0;border-bottom:1px solid color-mix(in srgb, var(--text) 8%, transparent)">
            <span class="small" style="font-weight:600;color:var(--faint)">${esc(j.quando)}</span>
            <div>
              <div style="font-family:var(--font-heading);font-weight:600;font-size:20px;line-height:1.15">${esc(j.org)}</div>
              <div class="small" style="margin-top:2px">${esc(j.papel)}</div>
            </div>
          </div>`).join('\n          ')}

          <span class="eyebrow" style="margin-top:40px">Formação e habilitações</span>
          <hr class="rule rule--tight">
          ${lista(sobre.formacao)}

          <div class="btns">
            <a class="btn btn-secondary" href="${empresa.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
            <a class="btn btn-primary" href="${waPadrao}" target="_blank" rel="noopener" data-event="contato_whatsapp" data-location="sobre">Agendar Diagnóstico de Automação</a>
          </div>
        </div>
      </div>
    </div>
  </section>`;

  pagina({
    rota: 'sobre',
    titulo: 'Sobre — Paulo José da Silva Souza, responsável técnico | AUPROIN',
    descricao: '28 anos em automação industrial, do levantamento ao start-up, em siderurgia, metalurgia e fundição. Técnico em Eletrotécnica com registro ativo no CFT/CRT e emissão de TRT. Base em Alumínio/SP.',
    corpo,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: empresa.responsavel,
      jobTitle: 'Responsável Técnico em Automação Industrial',
      telephone: empresa.telefoneUrl,
      email: empresa.email,
      sameAs: [empresa.linkedin],
      worksFor: { '@type': 'Organization', name: empresa.nomeCompleto },
      ...(BASE ? { image: abs('assets/img/paulo-souza-quadrado.jpg'), url: abs('sobre/') } : {}),
    },
    prioridade: 0.8,
});
}

/* ------------------------------------------------------------------ */
/* CONTATO                                                             */
/* ------------------------------------------------------------------ */

{
  const up = '../';
  const corpo = `
  <section class="section">
    <div class="wrap">
      <span class="eyebrow">Contato</span>
      <hr class="rule rule--tight">
      <h1 class="h-page">Fale direto com o responsável técnico</h1>
      <div class="grid grid--2" style="margin-top:48px;align-items:start">
        <div class="stack">
          <a class="bp" href="${waPadrao}" target="_blank" rel="noopener" data-event="contato_whatsapp" data-location="contato" style="padding:24px;text-decoration:none;display:flex;gap:16px;align-items:center;background:var(--accent);border-color:var(--accent);color:#fff">
            ${corners}
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="flex:none" aria-hidden="true"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path></svg>
            <span>
              <span style="display:block;font-family:var(--font-heading);font-weight:600;font-size:24px;line-height:1.1;letter-spacing:.02em;text-transform:uppercase">WhatsApp · ${esc(empresa.telefone)}</span>
              <span style="display:block;font-size:14px;line-height:1.4;margin-top:4px;opacity:.9">Abre com a mensagem pronta para agendar o Diagnóstico de Automação</span>
            </span>
          </a>

          <div class="bp rows">
            ${corners}
            ${contatoLinhas.map((r) => `<div><span class="k">${esc(r.k)}</span>${r.href ? `<a href="${r.href}"${r.href.startsWith('http') ? ' target="_blank" rel="noopener"' : ''} style="color:inherit;text-decoration:none">${esc(r.v)}</a>` : `<span>${esc(r.v)}</span>`}</div>`).join('\n            ')}
          </div>

          <p class="small" style="max-width:52ch">Atendimento presencial em ${esc(empresa.regiao)} — deslocamento em até 30 a 50 minutos.</p>
        </div>

        <div class="bp card" style="gap:20px">
          ${corners}
          <span class="eyebrow" style="margin:0">Prefere e-mail?</span>
          <hr class="rule" style="margin:0">
          <h2 class="h-card">Conte o que está acontecendo na planta</h2>
          <p class="prose mt-0">Envie a cidade, o equipamento envolvido e o principal sintoma. A mensagem vai direto para o responsável técnico.</p>
          <div class="btns" style="margin-top:0">
            <a class="btn btn-primary" href="mailto:${empresa.email}?subject=${encodeURIComponent('Diagnóstico de automação — contato pelo site')}" data-event="contato_email" data-location="contato">Escrever e-mail</a>
            <a class="btn btn-secondary" href="tel:${empresa.telefoneUrl}" data-event="contato_telefone" data-location="contato">Ligar agora</a>
          </div>
          <span class="small">E-mail: ${esc(empresa.email)}</span>
        </div>
      </div>
    </div>
  </section>`;

  pagina({
    rota: 'contato',
    titulo: 'Contato — AUPROIN Automação Industrial | (15) 98801-6442',
    descricao: 'Fale direto com o responsável técnico da AUPROIN: WhatsApp (15) 98801-6442, paulo.souza@auproin.com.br. Base em Alumínio/SP, atendimento em Sorocaba e região.',
    corpo,
    jsonLd: { ...negocioJsonLd, '@type': 'ProfessionalService' },
    prioridade: 0.9,
});
}

/* ------------------------------------------------------------------ */
/* 404 — independente da profundidade em que for servida               */
/* ------------------------------------------------------------------ */

writeFileSync(join(RAIZ, '404.html'), `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Página não encontrada — ${esc(empresa.nomeCompleto)}</title>
<meta name="robots" content="noindex">
<style>
  body { margin:0; min-height:100vh; display:grid; place-items:center; background:#fafafa; color:#1a1c22;
         font-family: "Barlow", system-ui, sans-serif; padding:24px; text-align:center; }
  h1 { font-size:clamp(48px,12vw,120px); margin:0; letter-spacing:.02em; color:#b8000a; line-height:1; }
  p { font-size:17px; line-height:1.6; max-width:48ch; color:#43454b; }
  a.btn { display:inline-block; margin-top:8px; padding:11px 18px; background:#b8000a; color:#fff;
          text-decoration:none; border:1px solid #b8000a; font-weight:600; letter-spacing:.02em; }
</style>
</head>
<body>
<div>
  <h1>404</h1>
  <p>Esta página não existe ou foi movida. Se você chegou aqui por um link antigo, fale direto pelo WhatsApp.</p>
  <p><a class="btn" id="ir-inicio" href="/">Voltar ao início</a></p>
  <p style="font-size:14px"><a href="${waPadrao}" style="color:#8f0009">WhatsApp ${esc(empresa.telefone)}</a></p>
</div>
<script>
  // Em GitHub Pages de projeto o site fica em /<repo>/ — descobre a raiz certa.
  (function () {
    var p = location.pathname.split('/').filter(Boolean);
    var raiz = location.hostname.endsWith('github.io') && p.length ? '/' + p[0] + '/' : '/';
    document.getElementById('ir-inicio').setAttribute('href', raiz);
  })();
</script>
</body>
</html>
`, 'utf8');


/* ------------------------------------------------------------------ */
/* Arquivos de indexação: robots, sitemap, manifest, llms.txt          */
/* ------------------------------------------------------------------ */

writeFileSync(join(RAIZ, '.nojekyll'), '', 'utf8');

writeFileSync(join(RAIZ, 'robots.txt'), [
  '# https://www.robotstxt.org/',
  'User-agent: *',
  'Allow: /',
  '',
  '# Página de parceria: acessível por link direto, fora da busca.',
  'Disallow: /parceiros/',
  '',
  '# Descoberta em busca e assistentes é permitida; treinamento não é autorizado por padrão.',
  'User-agent: OAI-SearchBot',
  'Allow: /',
  '',
  'User-agent: GPTBot',
  'Disallow: /',
  '',
  'User-agent: ClaudeBot',
  'Disallow: /',
  '',
  'User-agent: PerplexityBot',
  'Allow: /',
  '',
  'User-agent: Google-Extended',
  'Disallow: /',
  '',
  BASE ? `Sitemap: ${BASE}/sitemap.xml` : '# Sitemap: preencha siteUrl em src/content.mjs e rode o build de novo',
  '',
].join('\n'), 'utf8');

writeFileSync(join(RAIZ, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paginas.map((p) => `  <url>
    <loc>${BASE}/${p.rota ? p.rota + '/' : ''}</loc>
    <lastmod>${ultimaAtualizacao}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${p.prioridade.toFixed(1)}</priority>
  </url>`).join('\n')}
</urlset>
`, 'utf8');

writeFileSync(join(RAIZ, 'site.webmanifest'), JSON.stringify({
  name: empresa.nomeCompleto,
  short_name: empresa.nome,
  description: 'Engenharia de automação industrial — CLP, IHM, SCADA, retrofit e comissionamento.',
  lang: 'pt-BR',
  start_url: './',
  display: 'browser',
  background_color: '#fafafa',
  theme_color: '#b8000a',
  icons: [
    { src: 'assets/img/favicon-192.png', sizes: '192x192', type: 'image/png' },
    { src: 'assets/img/icone-512.png', sizes: '512x512', type: 'image/png' },
  ],
}, null, 2), 'utf8');

/* ---- llms.txt: mapa curto do site para modelos de linguagem -------- */

const u = (rota) => (BASE ? `${BASE}/${rota}` : `/${rota}`);

writeFileSync(join(RAIZ, 'llms.txt'), `# ${empresa.nomeCompleto}

> Engenharia de automação industrial em Alumínio/SP, atendendo Sorocaba e região.
> Programação de CLP, IHM e SCADA; retrofit e modernização de máquina; projeto
> elétrico e de painéis; comissionamento e start-up. Empresa de responsável técnico
> único: ${empresa.responsavel}, 28 anos de experiência, registro ativo no
> CFT/CRT ${empresa.crt} com emissão de TRT. CNPJ ${empresa.cnpj}.

Contato direto: WhatsApp e telefone ${empresa.telefone} · ${empresa.email}
Oferta de entrada: Diagnóstico de Automação — um dia na planta, relatório técnico
em até cinco dias úteis, escopo e valor fechados antes do início.

## Serviços

${servicos.map((s) => `- [${s.titulo}](${u(`servicos/${s.slug}/`)}): ${s.resumo}`).join('\n')}

## Casos de aplicação

${casos.map((c) => `- [${c.titulo}](${u(`casos/${c.slug}/`)}): ${c.subtitulo}. Resultado em números: ${c.numeros.map((n) => `${n.v} ${n.l}`).join('; ')}.`).join('\n')}

## Institucional

- [Sobre e responsável técnico](${u('sobre/')}): trajetória, formação, registro CFT/CRT e habilitações NR-10, NR-12 e NR-35.
- [Contato](${u('contato/')}): WhatsApp, telefone, e-mail e área de atendimento.

## Opcional

- [Parceria para integradoras e montadoras de painéis](${u('parceiros/')}): capacidade de engenharia adicional dentro do contrato do parceiro, com NDA e cláusula de não-solicitação. Página fora do menu, destinada a parceiros e não ao cliente final.
- [Fichas de caso em PDF](${u('assets/pdf/')}): as quatro fichas e a apresentação de capacidade técnica.

## Perguntas frequentes

${faq.map((f) => `- **${f.p}** ${f.r}`).join('\n')}
`, 'utf8');

/* ---- llms-full.txt: conteúdo integral em texto ---------------------- */

const secao = (t) => `\n\n---\n\n## ${t}\n`;
writeFileSync(join(RAIZ, 'llms-full.txt'), `# ${empresa.nomeCompleto} — conteúdo completo do site

Razão social: ${empresa.razaoSocial}
CNPJ: ${empresa.cnpj} · Registro CFT/CRT: ${empresa.crt}
Responsável técnico: ${empresa.responsavel} (${empresa.cargo})
Telefone e WhatsApp: ${empresa.telefone} · E-mail: ${empresa.email}
Base: ${empresa.cidade} · Atendimento: ${empresa.regiao}
LinkedIn: ${empresa.linkedin}
${secao('Problemas que a AUPROIN resolve')}
${sintomas.map((s) => `- ${s}`).join('\n')}
${secao('Diagnóstico de Automação (oferta de entrada)')}
Um dia na planta do cliente, relatório técnico em até cinco dias úteis, escopo e
valor fechados antes do início. O relatório é do cliente, com ou sem contratação
da execução. O relatório entrega:
${diagnostico.map((d) => `- ${d}`).join('\n')}
${secao('Serviços')}
${servicos.map((s) => `### ${s.n}. ${s.titulo}
${s.chamada}

O problema:
${s.problema.map((p) => `- ${p}`).join('\n')}

O método:
${s.metodo.map((p) => `- ${p}`).join('\n')}

O que é entregue:
${s.entrega.map((p) => `- ${p}`).join('\n')}

Plataformas e normas: ${s.plataformas}
`).join('\n')}
${secao('Casos')}
${casos.map((c) => `### Ficha ${c.n} — ${c.titulo}
Área: ${c.area}
${c.subtitulo}

A situação: ${c.situacao}

O que foi feito:
${c.feito.map((f) => `- ${f}`).join('\n')}

O resultado: ${c.resultado}

Números: ${c.numeros.map((n) => `${n.v} — ${n.l}`).join(' · ')}
${c.plataforma}
`).join('\n')}
${secao('Sobre o responsável técnico')}
${sobre.resumo}

${sobre.ficha.map((r) => `${r.k}: ${r.v}`).join('\n')}

Trajetória:
${sobre.trajetoria.map((j) => `- ${j.quando} — ${j.org}: ${j.papel}`).join('\n')}

Formação e habilitações:
${sobre.formacao.map((f) => `- ${f}`).join('\n')}
${secao('Parceria com integradoras e montadoras de painéis')}
A AUPROIN assume o escopo de controle — programação, integração e comissionamento —
sem concorrer pelo contrato principal e sem abordagem comercial ao cliente do parceiro.

${parceiros.colunas.map((col) => `${col.titulo}:\n${col.itens.map((i) => `- ${i}`).join('\n')}`).join('\n\n')}

Como funciona:
${parceiros.como.map((h) => `- ${h.titulo}: ${h.texto}`).join('\n')}

Disponibilidade:
${parceiros.disponibilidade.map((d) => `- ${d}`).join('\n')}
${secao('Perguntas frequentes')}
${faq.map((f) => `**${f.p}**\n${f.r}`).join('\n\n')}
`, 'utf8');

/* ------------------------------------------------------------------ */

console.log(`✔ ${paginas.length} páginas indexáveis + /parceiros/ (noindex) + 404`);
console.log(paginas.map((p) => '  /' + (p.rota ? p.rota + '/' : '')).join('\n'));
console.log('✔ robots.txt · sitemap.xml · site.webmanifest · llms.txt · llms-full.txt · .nojekyll');
if (!BASE) {
  console.log('\n⚠ siteUrl vazio: sem canonical, sem og:url e com sitemap/llms.txt em caminho relativo.');
  console.log('  Preencha `siteUrl` em src/content.mjs (ou SITE_URL=... node src/build.mjs) e rode de novo.');
}
