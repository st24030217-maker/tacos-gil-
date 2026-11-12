// Graba el video de presentación (MP4 1920x1080) usando Microsoft Edge.
// Uso:  node herramientas/grabar-video.js
const puppeteer = require('puppeteer-core');
const ffmpeg = require('ffmpeg-static');
const { execFileSync } = require('child_process');
const fs = require('fs'), path = require('path'), os = require('os');
const { pathToFileURL } = require('url');

const RAIZ = path.join(__dirname, '..');
const FRAMES = path.join(os.tmpdir(), 'gils-frames');
const SALIDA = path.join(RAIZ, 'video-propuesta-gils.mp4');
const FPS = 30;
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const url = (f, hash = '') => pathToFileURL(path.join(RAIZ, f)).href + hash;
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

let n = 0;
async function frame(page) {
  await page.screenshot({ path: path.join(FRAMES, `f${String(n++).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 88 });
}
async function quieto(page, seg) { for (let i = 0; i < seg * FPS; i++) await frame(page); }
async function abrir(page, u) {
  await page.goto(u, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await new Promise(r => setTimeout(r, 150));
}
// desplaza la ventana (o un iframe) de forma suave
async function desplazar(ctx, page, hasta, seg) {
  const desde = await ctx.evaluate(() => scrollY);
  const tope = await ctx.evaluate(h => Math.min(h, document.documentElement.scrollHeight - innerHeight), hasta);
  const total = Math.round(seg * FPS);
  for (let i = 1; i <= total; i++) {
    const y = desde + (tope - desde) * ease(i / total);
    await ctx.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), y);
    await frame(page);
  }
}

(async () => {
  fs.rmSync(FRAMES, { recursive: true, force: true }); fs.mkdirSync(FRAMES, { recursive: true });
  const browser = await puppeteer.launch({ executablePath: EDGE, headless: 'new',
    args: ['--allow-file-access-from-files', '--hide-scrollbars', '--disable-web-security'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1.5 });

  // 1. Portada
  await abrir(page, url('herramientas/escena.html', '#inicio')); await quieto(page, 3.5);
  // 2. Página web
  await abrir(page, url('herramientas/escena.html', '#web')); await quieto(page, 2);
  await abrir(page, url('index.html')); await quieto(page, 2.5);
  const paradas = await page.evaluate(() =>
    ['#historia', '#favoritos', '.qr-banda', '#visitanos'].map(s => document.querySelector(s).offsetTop - 70)
      .concat(document.documentElement.scrollHeight));
  for (const p of paradas) { await desplazar(page, page, p, 1.8); await quieto(page, 1.2); }
  // 3. Menú digital en celular
  await abrir(page, url('herramientas/escena.html', '#menu')); await quieto(page, 2);
  await abrir(page, url('herramientas/vitrina.html', '#menu'));
  const f = page.frames().find(x => x.url().includes('menu.html'));
  await f.waitForSelector('.item'); await quieto(page, 2);
  await desplazar(f, page, 700, 2); await quieto(page, 0.6);
  // agregar platillos al pedido
  for (const i of [0, 1, 1, 3]) {
    await f.evaluate(i => document.querySelectorAll('.mas')[i].click(), i);
    await quieto(page, 0.5);
  }
  await quieto(page, 1);
  await desplazar(f, page, 1700, 2.2); await quieto(page, 0.8);
  // búsqueda
  await f.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  for (const ch of 'gordita') {
    await f.evaluate(ch => { const q = document.querySelector('#q'); q.value += ch; q.dispatchEvent(new Event('input')); }, ch);
    await quieto(page, 0.15);
  }
  await quieto(page, 2);
  // 4. QR
  await abrir(page, url('herramientas/escena.html', '#qr')); await quieto(page, 2);
  await abrir(page, url('herramientas/vitrina.html', '#qr')); await quieto(page, 3);
  await abrir(page, url('qr-mesa.html')); await quieto(page, 3);
  // 5. Cierre
  await abrir(page, url('herramientas/escena.html', '#fin')); await quieto(page, 4.5);
  await browser.close();

  console.log(`${n} cuadros capturados. Codificando…`);
  execFileSync(ffmpeg, ['-y', '-framerate', String(FPS), '-i', path.join(FRAMES, 'f%05d.jpg'),
    '-vf', 'scale=1920:1080:flags=lanczos,format=yuv420p', '-c:v', 'libx264', '-preset', 'medium', '-crf', '20',
    '-movflags', '+faststart', SALIDA], { stdio: 'inherit' });
  fs.rmSync(FRAMES, { recursive: true, force: true });
  console.log('Video listo:', SALIDA);
})().catch(e => { console.error(e); process.exit(1); });
