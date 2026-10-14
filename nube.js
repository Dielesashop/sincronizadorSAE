require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Divide un array grande en bloques más pequeños
function dividirEnLotes(arreglo, tamanoLote) {
  const lotes = [];
  for (let i = 0; i < arreglo.length; i += tamanoLote) {
    lotes.push(arreglo.slice(i, i + tamanoLote));
  }
  return lotes;
}

async function actualizarProductosEnNube(productos) {
  const datosFormateados = productos.map(p => ({
    clave: p.cve_art,
    descripcion: p.descr,
    existencia: p.exist,
    precio: p.ult_costo
  }));

  const lotes = dividirEnLotes(datosFormateados, 500); // 500 productos por lote
  let totalSubidos = 0;

  for (let i = 0; i < lotes.length; i++) {
    const { error } = await supabase
      .from('productos')
      .upsert(lotes[i], { onConflict: 'clave' });

    if (error) throw error;

    totalSubidos += lotes[i].length;
    console.log(`   📤 Lote ${i + 1}/${lotes.length} subido (${totalSubidos} productos en total)`);
  }

  return totalSubidos;
}

module.exports = { actualizarProductosEnNube };