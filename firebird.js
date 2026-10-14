const Firebird = require('node-firebird');
require('dotenv').config();

const opciones = {
  host: process.env.SAE_HOST,
  port: parseInt(process.env.SAE_PORT),
  database: process.env.SAE_DATABASE,
  user: process.env.SAE_USER,
  password: process.env.SAE_PASSWORD,
  lowercase_keys: true
};

// Función que regresa los productos actuales de SAE
function obtenerProductosSAE() {
  return new Promise((resolver, rechazar) => {
    Firebird.attach(opciones, (error, db) => {
      if (error) return rechazar(error);

db.query(
    `SELECT 
        CVE_ART AS "cve_art", 
        DESCR AS "descr", 
        CTRL_ALM AS "ctrl_alm", 
        STOCK_MIN AS "stock_min", 
        STOCK_MAX AS "stock_max", 
        EXIST AS "exist", 
        ULT_COSTO AS "ult_costo", 
        LIN_PROD AS "lin_prod"
    FROM INVE01 
    WHERE CTRL_ALM IS NOT NULL 
        AND CTRL_ALM <> '' 
        AND NOT (STOCK_MIN = 0 AND STOCK_MAX = 0) 
    ORDER BY CTRL_ALM, CVE_ART`,
    [],                            
    (error, productos) => {
        db.detach();
        if (error) return rechazar(error);
        resolver(productos);
    }
);
    });
  });
}

module.exports = { obtenerProductosSAE };