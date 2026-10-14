const cron = require('node-cron');
const { obtenerProductosSAE } = require('./firebird');
const { actualizarProductosEnNube } = require('./nube');

// Esta función hace UNA sincronización completa
async function sincronizar() {
  console.log('🔄 Iniciando sincronización...', new Date().toLocaleTimeString());

  try {
    // 1. Leemos los productos desde Aspel SAE
    const productos = await obtenerProductosSAE();
    console.log(`📦 ${productos.length} productos encontrados en SAE`);

    // 2. Los subimos a la nube
    await actualizarProductosEnNube(productos);
    console.log('✅ Sincronización completada correctamente\n');

  } catch (error) {
    console.error('❌ Error en la sincronización:', error.message, '\n');
  }
}

// ───────────────────────────────────────────
// Ejecuta la sincronización CADA 5 MINUTOS
// ───────────────────────────────────────────
// cron.schedule('*/5 * * * *', () => {
//   sincronizar();
// });

// También la ejecutamos una vez al iniciar el programa
console.log('🚀 Sincronizador iniciado. Sincronizando cada 5 minutos...\n');
sincronizar();