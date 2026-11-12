// Quita el fondo de pergamino del logo (flood-fill desde los bordes) y genera:
//  img/logo.png        logo completo, fondo transparente
//  img/logo-claro.png  versión para fondos oscuros (negro -> crema)
//  img/vaquero.png     solo la cabeza del vaquero (ícono)
const sharp = require('sharp'), path = require('path');
const R = p => path.join(__dirname, '..', 'img', p);

(async () => {
  const { data, info } = await sharp(R('logo-original.png')).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, px = Buffer.from(data);
  // ¿es fondo? = claro y poco saturado (pergamino), no blanco puro ni rojo ni negro
  const esFondo = i => {
    const r = px[i], g = px[i + 1], b = px[i + 2];
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    return mx > 150 && (mx - mn) < 70 && r >= b;
  };
  const visto = new Uint8Array(W * H), pila = [];
  for (let x = 0; x < W; x++) pila.push(x, (H - 1) * W + x);
  for (let y = 0; y < H; y++) pila.push(y * W, y * W + W - 1);
  while (pila.length) {
    const p = pila.pop(); if (visto[p]) continue;
    const i = p * 4; if (!esFondo(i)) continue;
    visto[p] = 1; px[i + 3] = 0;
    const x = p % W, y = (p / W) | 0;
    if (x > 0) pila.push(p - 1); if (x < W - 1) pila.push(p + 1);
    if (y > 0) pila.push(p - W); if (y < H - 1) pila.push(p + W);
  }
  // suavizar bordes: píxeles opacos junto a transparentes y claros -> semitransparentes
  for (let p = 0; p < W * H; p++) {
    const i = p * 4; if (!px[i + 3]) continue;
    const x = p % W, y = (p / W) | 0;
    const vecino = [p - 1, p + 1, p - W, p + W].some(q => q >= 0 && q < W * H && visto[q] && Math.abs((q % W) - x) <= 1);
    if (vecino && esFondo(i)) px[i + 3] = 90;
  }
  const base = sharp(px, { raw: { width: W, height: H, channels: 4 } });
  const caja = { left: 175, top: 505, width: 1260, height: 590 };
  await base.clone().extract(caja).png().toFile(R('logo.png'));
  // vaquero: recorte sin la parte de la "G"
  const vq = Buffer.from(px);
  for (let y = 505 + 228; y < H; y++) for (let x = 175 + 388; x < W; x++) vq[(y * W + x) * 4 + 3] = 0;
  const vqBuf = await sharp(vq, { raw: { width: W, height: H, channels: 4 } }).extract({ left: 175, top: 505, width: 480, height: 590 }).png().toBuffer();
  await sharp(vqBuf).trim().png().toFile(R('vaquero.png'));

  // versión clara: negro/gris oscuro -> crema, guinda se queda
  const claro = Buffer.from(px);
  for (let i = 0; i < claro.length; i += 4) {
    const r = claro[i], g = claro[i + 1], b = claro[i + 2];
    if (Math.max(r, g, b) < 90) { claro[i] = 243; claro[i + 1] = 235; claro[i + 2] = 221; }
    else if (r > 110 && g < 80) { claro[i] = 205; claro[i + 1] = 60; claro[i + 2] = 48; } // guinda más vivo sobre negro
  }
  for (let y = 0; y < 740; y++) for (let x = 0; x < 655; x++) claro[(y * W + x) * 4 + 3] = 0; // quitar sombrero
  for (let y = 0; y < H; y++) for (let x = 0; x < 562; x++) claro[(y * W + x) * 4 + 3] = 0;  // quitar vaquero
  await sharp(claro, { raw: { width: W, height: H, channels: 4 } }).extract({ left: 548, top: 505, width: 887, height: 590 }).png().toBuffer().then(b => sharp(b).trim().png().toFile(R('logo-texto-claro.png')));
  console.log('Logos generados en /img');
})();
