// Graba el video de presentación (MP4 1920x1080, 30 fps) a partir de herramientas/video.html
// Cada cuadro se dibuja con window.render(t) para que las animaciones salgan perfectas.
//   node herramientas/grabar-video.js                → video completo
//   node herramientas/grabar-video.js --ver 3,8,20   → solo capturas de esos segundos (revisión)
const puppeteer = require('puppeteer-core');
const ffmpeg = require('ffmpeg-static');
const { execFileSync } = require('child_process');
const fs = require('fs'), path = require('path'), os = require('os');
const { pathToFileURL } = require('url');

const RAIZ = path.join(__dirname, '..');
const FRAMES = path.join(os.tmpdir(), 'gils-frames');
const SALIDA = path.join(RAIZ, 'video-propuesta-gils.mp4');
const FPS = 30;
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const ver = process.argv.includes('--ver') ? process.argv[process.argv.indexOf('--ver') + 1].split(',').map(Number) : null;

(async () => {
  fs.rmSync(FRAMES, { recursive: true, force: true }); fs.mkdirSync(FRAMES, { recursive: true });
  const browser = await puppeteer.launch({ executablePath: EDGE, headless: 'new',
    args: ['--allow-file-access-from-files', '--disable-web-security', '--hide-scrollbars', '--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(path.join(__dirname, 'video.html')).href, { waitUntil: 'networkidle0' });
  await page.evaluate(() => preparar());
  await new Promise(r => setTimeout(r, 800));
  const total = await page.evaluate(() => TOTAL);
  const N = Math.round(total * FPS);

  const tiempos = ver ? ver : null;
  let n = 0;
  for (let f = 0; f < N; f++) {
    const t = f / FPS;
    await page.evaluate((t, f) => render(t, f), t, f);
    if (tiempos) {
      const hit = tiempos.find(x => Math.round(x * FPS) === f);
      if (hit !== undefined) await page.screenshot({ path: path.join(os.tmpdir(), 'gils-check', `t${hit}.jpg`), type: 'jpeg', quality: 80 });
      continue;
    }
    await page.screenshot({ path: path.join(FRAMES, `f${String(n++).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 90 });
    if (f % 150 === 0) console.log(`  ${Math.round(f / N * 100)}%`);
  }
  await browser.close();
  if (tiempos) { console.log('Capturas en', path.join(os.tmpdir(), 'gils-check')); return; }

  console.log(`${n} cuadros. Codificando…`);
  execFileSync(ffmpeg, ['-y', '-framerate', String(FPS), '-i', path.join(FRAMES, 'f%05d.jpg'),
    '-vf', 'format=yuv420p', '-c:v', 'libx264', '-preset', 'slow', '-crf', '19',
    '-movflags', '+faststart', SALIDA], { stdio: 'ignore' });
  fs.rmSync(FRAMES, { recursive: true, force: true });
  console.log('Video listo:', SALIDA);
})().catch(e => { console.error(e); process.exit(1); });
