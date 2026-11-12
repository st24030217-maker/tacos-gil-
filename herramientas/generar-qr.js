// Genera el código QR del menú digital.
// Uso:  node herramientas/generar-qr.js https://TU-DOMINIO/menu.html
const QR = require('qrcode');
const path = require('path');
const url = process.argv[2] || 'https://st24030217-maker.github.io/tacos-gil-/menu.html';
const out = path.join(__dirname, '..');
const opts = { errorCorrectionLevel: 'H', margin: 1, color: { dark: '#1E1512', light: '#FFFFFF' } };
(async () => {
  await QR.toFile(path.join(out, 'qr-menu.png'), url, { ...opts, width: 1200 });
  await QR.toFile(path.join(out, 'qr-menu.svg'), url, { ...opts, type: 'svg' });
  console.log('QR generado para:', url);
})();
