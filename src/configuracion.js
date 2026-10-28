const puertoTexto = process.env.PORT || "3000";
const puerto = Number(puertoTexto);

if (!Number.isInteger(puerto) || puerto < 1 || puerto > 65535) {
  throw new Error("PORT debe ser un número entero entre 1 y 65535.");
}

const entorno = process.env.NODE_ENV || "development";

const formatoMorgan = entorno === "production" ? "combined" : "dev";

module.exports = {
  puerto,
  entorno,
  formatoMorgan,
};
