/* Geração das imagens de marca do site com a API do Gemini.
   A logo real é enviada como imagem de referência para que apareça grande e fiel.

   Uso:  GEMINI_API_KEY=... node src/gerar-imagens.mjs [nome-do-job ...]
   Sem argumentos, gera todos os jobs. Saída em assets/img/ (e _saida/ para testes).

   Modelos disponíveis nesta chave: gemini-3-pro-image, gemini-3.1-flash-image,
   gemini-2.5-flash-image. */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const CHAVE = process.env.GEMINI_API_KEY || lerEnv('GEMINI_API_KEY');
const MODELO = process.env.GEMINI_IMAGE_MODEL || 'gemini-3-pro-image';

function lerEnv(chave) {
  try {
    const linha = readFileSync(join(RAIZ, '.env'), 'utf8')
      .split('\n').find((l) => l.trim().startsWith(chave + '='));
    return linha ? linha.split('=').slice(1).join('=').trim() : null;
  } catch { return null; }
}

if (!CHAVE) {
  console.error('Falta GEMINI_API_KEY (variável de ambiente ou .env na raiz).');
  process.exit(1);
}

const LOGO = join(RAIZ, 'assets/img/logo.png');

/* --------------------------------------------------------------- */

const REGRAS = `
Regras obrigatórias, sem exceção:
- Fotografia industrial real e sóbria. NADA de robô azul brilhante, holograma,
  circuito neon, "IA industrial", brilho ciano, partículas ou HUD futurista.
- Sem texto inventado, sem letras deformadas, sem marcas de terceiros legíveis.
- Paleta: aço, cinza-grafite, off-white e o vermelho da marca (#b8000a). Sem azul saturado.
- A logo fornecida deve ser reproduzida EXATAMENTE como está: mesmas formas, mesmas
  proporções, mesmas cores, sem redesenhar, sem inclinar, sem aplicar efeito 3D,
  sem sombra dura e sem recortar nenhuma parte dela.
`.trim();

const JOBS = {
  og: {
    saida: 'assets/img/og-auproin.png',
    aspecto: '16:9',
    tamanho: '2K',
    prompt: `Cartão de compartilhamento (Open Graph) de uma empresa de engenharia de automação industrial.

Composição: a logo AUPROIN fornecida em anexo, GRANDE e centralizada, ocupando cerca de
60% da largura da imagem, perfeitamente nítida e legível, sobre um fundo fotográfico de
painel elétrico industrial em aço inox — borrado com profundidade de campo e escurecido
com uma camada off-white translúcida, de modo que a logo tenha contraste total.
Abaixo da logo, uma linha fina vermelha e, sob ela, o texto em maiúsculas, tipografia
condensada sem serifa, cinza-grafite:
"CLP · IHM · SCADA · RETROFIT · COMISSIONAMENTO"
Margens generosas. Estética de prancha de engenharia: limpo, alinhado, geométrico.

${REGRAS}`,
  },

  hero: {
    saida: 'assets/img/hero-auproin.png',
    aspecto: '16:9',
    tamanho: '2K',
    prompt: `Imagem de topo (hero) larga para o site de uma empresa de automação industrial.

Composição: fotografia de um painel de comando industrial em aço inox visto de frente,
com IHM sem conteúdo legível na tela, botoeiras e sinaleiros — iluminação de galpão,
sóbria, levemente dessaturada. No terço esquerdo, área limpa e vazia para receber texto.
No canto superior direito, a logo AUPROIN fornecida em anexo aplicada de forma discreta
mas nítida, ocupando cerca de 22% da largura, com suas cores originais.
Sensação: engenharia séria, chão de fábrica real, nada de estúdio.

${REGRAS}`,
  },

  icone: {
    saida: 'assets/img/icone-quadrado.png',
    aspecto: '1:1',
    tamanho: '1K',
    prompt: `Ícone de aplicativo quadrado.

Composição: APENAS o símbolo da logo fornecida em anexo — a engrenagem escura com a
faixa vermelha e a trilha de circuito. NÃO inclua a palavra "AUPROIN" nem a linha
"AUTOMAÇÃO DE PROCESSOS INDUSTRIAIS". O símbolo deve ficar centralizado, ocupando
cerca de 78% do quadrado, sobre fundo branco puro liso, sem sombra e sem moldura.
Vetorial, bordas limpas, alto contraste, legível em 32 pixels.

${REGRAS}`,
  },
};

/* --------------------------------------------------------------- */

async function gerar(nome) {
  const job = JOBS[nome];
  if (!job) throw new Error(`Job desconhecido: ${nome}`);

  const partes = [
    { text: job.prompt },
    { inline_data: { mime_type: 'image/png', data: readFileSync(LOGO).toString('base64') } },
  ];

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODELO}:generateContent?key=${CHAVE}`;
  const resposta = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: partes }],
      generationConfig: {
        responseModalities: ['IMAGE'],
        imageConfig: { aspectRatio: job.aspecto, imageSize: job.tamanho },
      },
    }),
  });

  if (!resposta.ok) throw new Error(`${nome}: HTTP ${resposta.status} — ${(await resposta.text()).slice(0, 400)}`);

  const dados = await resposta.json();
  const imagem = dados.candidates?.[0]?.content?.parts?.find((p) => p.inlineData || p.inline_data);
  if (!imagem) throw new Error(`${nome}: resposta sem imagem — ${JSON.stringify(dados).slice(0, 400)}`);

  const bytes = Buffer.from((imagem.inlineData || imagem.inline_data).data, 'base64');
  const destino = join(RAIZ, job.saida);
  mkdirSync(dirname(destino), { recursive: true });
  writeFileSync(destino, bytes);
  console.log(`✔ ${job.saida} — ${(bytes.length / 1024).toFixed(0)} kB`);
}

const alvos = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(JOBS);
for (const nome of alvos) {
  try { await gerar(nome); } catch (erro) { console.error('✖', erro.message); }
}
