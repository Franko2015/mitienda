const fs = require("fs");
const envPath = "./env.txt";

if (fs.existsSync(envPath)) {
  console.log("env.txt already exists, skipping generation.");
  process.exit(0);
}

const keys = [
  "NEGOCIO_NOMBRE",
  "NEGOCIO_WHATSAPP",
  "NEGOCIO_EMAIL",
  "NEGOCIO_HORARIO",
  "MINIMO_COMPRA",
  "SECTORES_URBANOS",
  "SECTORES_RURALES",
  "ENVIO_URBANO",
  "ENVIO_RURAL",
  "BANCO_NOMBRE",
  "BANCO_TIPO",
  "BANCO_TITULAR",
  "BANCO_RUT",
  "BANCO_CUENTA",
  "BANCO_CORREO",
  "SORTEO_NUMERO",
  "SORTEO_FECHA",
  "SORTEO_PREMIO",
  "SORTEO_LINK",
  "SORTEO_CANAL_LINK",
  "SORTEO_CANAL_ID",
  "SHEET_URL",
  "SHEET_NAME"
];

const lines = keys.map((key) => {
  const value = process.env[key] || "";
  return `${key}="${value.replace(/"/g, '\\"')}"`;
});

fs.writeFileSync(envPath, lines.join("\n") + "\n");
console.log("Generated env.txt from Vercel environment variables.");
