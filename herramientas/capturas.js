// Capturas de revisión: node herramientas/capturas.js <carpeta-salida>
const puppeteer = require('puppeteer-core'), path = require('path');
const { pathToFileURL } = require('url');
const out = process.argv[2] || '.';
const u = f => pathToFileURL(path.join(__dirname, '..', f)).href;
(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: 'new', args: ['--hide-scrollbars'] });
  const p = await b.newPage();
  const shot = async (f, w, h, name, full) => {
    await p.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
    await p.goto(u(f), { waitUntil: 'networkidle0' }); await p.evaluate(() => document.fonts.ready);
    await p.evaluate(() => document.querySelectorAll('.rev').forEach(e => e.classList.add('ver')));
    await new Promise(r => setTimeout(r, 1200));
    await p.screenshot({ path: path.join(out, name), fullPage: !!full });
  };
  await shot('index.html', 1280, 800, 'web.png', true);
  await shot('index.html', 390, 844, 'web-movil.png', false);
  await shot('menu.html', 390, 844, 'menu.png', false);
  await shot('qr-mesa.html', 1000, 700, 'qr.png', false);
  await b.close();
})();
