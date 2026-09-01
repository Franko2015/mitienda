/* CONFIGURACIÓN: edita aquí los datos públicos del negocio. */
const BUSINESS_CONFIG = {
  name: "Romayor",
  whatsapp: "56998110665",
  displayWhatsapp: "+56 9 9811 0665",
  email: "correo@negocio.cl",
  hours: "HORARIO POR CONFIGURAR",
  instagram: "",
  facebook: ""
};

let MINIMUM_ORDER = 5000;
let URBAN_SECTORS = [];
let RURAL_SECTORS = [];
let URBAN_DELIVERY_COST = 0;
let RURAL_DELIVERY_COST = 5000;
const LAST_ORDER_KEY = "romayor-last-order";
const BANK_TRANSFER_CONFIG = {
  bank: "BancoEstado",
  accountType: "Cuenta Vista",
  holder: "ROMAYOR DEMO",
  rut: "00.000.000-0",
  accountNumber: "00000000",
  email: "pagos@romayor.cl"
};
const CUSTOMER_DATA_KEY = "romayor-customer-data";
const ANALYTICS_KEY = "romayor-local-analytics";
let SORTEO = { numero: "001", fecha: "Último día del mes", premio: "1 producto a elección GRATIS", link: "", canal: "", canalId: "" };

const formatCurrency = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0
});

const LAZY_IMAGE_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='560' height='400'%3E%3Crect width='100%25' height='100%25' fill='%23eef5f7'/%3E%3C/svg%3E";

const createProductImage = (label, color = "#0875c1", accent = "#9ee4f5") => {
  const initials = label.split(" ").slice(0, 2).map((word) => word[0]).join("").toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="560" height="400" viewBox="0 0 560 400" role="img" aria-label="${label}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f7fcff"/><stop offset="1" stop-color="${accent}"/></linearGradient></defs><rect width="560" height="400" fill="url(#g)"/><circle cx="420" cy="80" r="55" fill="#fff" opacity=".65"/><circle cx="95" cy="325" r="72" fill="#fff" opacity=".55"/><rect x="185" y="72" width="190" height="255" rx="46" fill="${color}"/><rect x="230" y="39" width="100" height="55" rx="14" fill="#173044"/><rect x="207" y="170" width="146" height="90" rx="18" fill="#fff" opacity=".94"/><text x="280" y="225" font-family="Arial,sans-serif" font-size="42" font-weight="700" text-anchor="middle" fill="${color}">${initials}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

function parseEnv(text) {
  const env = {};
  text.split(/\r?\n/).forEach((line) => {
    line = line.trim();
    if (!line || line.startsWith("#")) return;
    const index = line.indexOf("=");
    if (index === -1) return;
    const key = line.slice(0, index).trim();
    let value = line.slice(index + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  });
  return env;
}

function getEnv(key, fallback = "") {
  const search = key.toLowerCase();
  const found = Object.keys(window.ENV || {}).find((entry) => entry.toLowerCase() === search);
  return found ? window.ENV[found] : fallback;
}

function parseCSV(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];
    if (char === '"') {
      if (inQuotes && next === '"') {
        cell += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (cell !== "" || row.length) {
        row.push(cell);
        rows.push(row);
      }
      row = [];
      cell = "";
      if (char === "\r" && next === "\n") i++;
    } else {
      cell += char;
    }
  }
  if (cell !== "" || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

function normalizeHeader(text) {
  return normalizeText(text).replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

function parseSheetVariants(value, fallbackPrice) {
  const variants = [];
  if (!value) {
    variants.push({ id: "1 unidad", label: "1 unidad", units: 1, price: fallbackPrice });
    return variants;
  }
  const entries = value.split(",").map((entry) => entry.trim()).filter(Boolean);
  for (const entry of entries) {
    const index = entry.indexOf(":");
    const label = index === -1 ? entry : entry.slice(0, index).trim();
    const price = index === -1 ? fallbackPrice : parsePrice(entry.slice(index + 1).trim(), fallbackPrice);
    const units = parseUnits(label);
    variants.push({ id: label, label, units, price });
  }
  if (!variants.length) {
    variants.push({ id: "1 unidad", label: "1 unidad", units: 1, price: fallbackPrice });
  }
  return variants;
}

function buildProductFromSheetRow(row, headers) {
  const get = (key, fallback = "") => {
    const normalizedKey = normalizeHeader(key);
    const index = headers.findIndex((header) => normalizeHeader(header) === normalizedKey);
    return index >= 0 ? (row[index] || "").trim() : fallback;
  };
  const name = get("nombre").trim();
  if (!name) return null;
  const category = get("categoria", "hogar").trim();
  const fallbackPrice = parsePrice(get("precio"), 0);
  const variants = parseSheetVariants(get("variantes"), fallbackPrice);
  const recommendedLabel = get("variante_recomendada") || variants[0].label;
  const recommendedVariant = variants.find((variant) => variant.label === recommendedLabel)?.id || variants[0].id;
  const stockRaw = parseInt(get("stock"), 10);
  const stock = Number.isFinite(stockRaw) ? stockRaw : 999;
  let stockStatus = "available";
  if (stock <= 0) stockStatus = "out";
  else if (stock <= 5) stockStatus = "low";
  const image = normalizeImageUrl(get("imagen"));
  const badge = get("badge").trim();
  const numeroSorteo = get("numero_sorteo").trim();
  const fechaSorteo = get("fecha_sorteo").trim();
  const info = get("info").trim();
  const allowsVolumeQuote = get("cotizar_volumen").trim().toLowerCase() !== "false";
  return {
    id: slugify(get("id").trim() || name),
    name,
    category,
    description: get("descripcion").trim(),
    badge,
    image: image || createProductImage(name, "#287ea8", "#d8f2f8"),
    fallbackImage: createProductImage(name, "#287ea8", "#d8f2f8"),
    price: variants[0].price,
    baseUnits: variants[0].units,
    recommendedVariant,
    variants,
    stockStatus,
    stock,
    numeroSorteo,
    fechaSorteo,
    info,
    allowsVolumeQuote
  };
}

async function loadProductsFromSheet() {
  const sheetUrl = getEnv("SHEET_URL", "").trim();
  if (!sheetUrl) return null;
  try {
    const response = await fetch(sheetUrl, { cache: "no-store" });
    if (!response.ok) throw new Error("No se pudo cargar la hoja");
    const csv = await response.text();
    const rows = parseCSV(csv).filter((row) => row.some((cell) => cell.trim()));
    if (rows.length < 2) return null;
    const headers = rows[0];
    const products = rows.slice(1).map((row) => buildProductFromSheetRow(row, headers)).filter(Boolean);
    return products.length ? products : null;
  } catch (error) {
    console.warn("Error cargando productos desde Google Sheets:", error);
    return null;
  }
}

async function loadProducts() {
  const fromSheet = await loadProductsFromSheet();
  if (fromSheet) return fromSheet;
  return buildProducts();
}

function parsePrice(value, fallback = 0) {
  const cleaned = String(value).replace(/[^0-9-]/g, "");
  const parsed = parseInt(cleaned, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseUnits(label) {
  const match = String(label).match(/\d+/);
  return match ? parseInt(match[0], 10) : 1;
}

function normalizeText(text) {
  return String(text).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function slugify(text) {
  return normalizeText(text).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function escapeHtml(value) {
  return String(value || "").replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  })[character]);
}

function formatProductDescription(description) {
  const text = String(description || "").trim();
  if (!text) return "";
  const items = text.split(/\s*\*\s*/).map((item) => item.trim()).filter(Boolean);
  if (text.includes("*") && items.length) {
    return `<ul class="product-description product-description-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  }
  return `<p class="product-description">${escapeHtml(text)}</p>`;
}

function normalizeImageUrl(rawUrl) {
  const url = String(rawUrl || "").trim();
  if (!url) return "";
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.endsWith("drive.google.com")) return url;
    const pathMatch = parsed.pathname.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    const fileId = pathMatch?.[1] || parsed.searchParams.get("id");
    return fileId ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200` : url;
  } catch (error) {
    return url;
  }
}

function formatWhatsapp(raw) {
  const digits = String(raw).replace(/\D/g, "");
  if (digits.length === 11) return `+56 ${digits.slice(2, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`;
  if (digits.length === 9) return `+56 ${digits.slice(0, 1)} ${digits.slice(1, 5)} ${digits.slice(5)}`;
  return digits ? `+${digits}` : raw;
}

function loadEnv() {
  return fetch(`env.txt?v=${Date.now()}`, { cache: "no-store" })
    .then((response) => {
      if (!response.ok) throw new Error("No se pudo cargar .env");
      return response.text();
    })
    .then((text) => {
      window.ENV = parseEnv(text);
    })
    .catch(() => {
      window.ENV = {};
      console.warn("No se encontro .env; se usan valores por defecto.");
    });
}

function parseList(key) {
  const value = getEnv(key, "");
  return value ? value.split(",").map((item) => item.trim()).filter(Boolean) : [];
}

function buildBusinessConfig() {
  BUSINESS_CONFIG.name = getEnv("NEGOCIO_NOMBRE", BUSINESS_CONFIG.name);
  BUSINESS_CONFIG.whatsapp = getEnv("NEGOCIO_WHATSAPP", BUSINESS_CONFIG.whatsapp).replace(/\D/g, "");
  BUSINESS_CONFIG.displayWhatsapp = formatWhatsapp(BUSINESS_CONFIG.whatsapp);
  BUSINESS_CONFIG.email = getEnv("NEGOCIO_EMAIL", BUSINESS_CONFIG.email);
  BUSINESS_CONFIG.hours = getEnv("NEGOCIO_HORARIO", BUSINESS_CONFIG.hours);
  MINIMUM_ORDER = parsePrice(getEnv("MINIMO_COMPRA", String(MINIMUM_ORDER)), MINIMUM_ORDER);
  URBAN_SECTORS = parseList("SECTORES_URBANOS");
  RURAL_SECTORS = parseList("SECTORES_RURALES");
  URBAN_DELIVERY_COST = parsePrice(getEnv("ENVIO_URBANO", String(URBAN_DELIVERY_COST)), URBAN_DELIVERY_COST);
  RURAL_DELIVERY_COST = parsePrice(getEnv("ENVIO_RURAL", String(RURAL_DELIVERY_COST)), RURAL_DELIVERY_COST);
  BANK_TRANSFER_CONFIG.bank = getEnv("BANCO_NOMBRE", BANK_TRANSFER_CONFIG.bank);
  BANK_TRANSFER_CONFIG.accountType = getEnv("BANCO_TIPO", BANK_TRANSFER_CONFIG.accountType);
  BANK_TRANSFER_CONFIG.holder = getEnv("BANCO_TITULAR", BANK_TRANSFER_CONFIG.holder);
  BANK_TRANSFER_CONFIG.rut = getEnv("BANCO_RUT", BANK_TRANSFER_CONFIG.rut);
  BANK_TRANSFER_CONFIG.accountNumber = getEnv("BANCO_CUENTA", BANK_TRANSFER_CONFIG.accountNumber);
  BANK_TRANSFER_CONFIG.email = getEnv("BANCO_CORREO", BANK_TRANSFER_CONFIG.email);
  SORTEO.numero = getEnv("SORTEO_NUMERO", SORTEO.numero);
  SORTEO.fecha = getEnv("SORTEO_FECHA", SORTEO.fecha);
  SORTEO.premio = getEnv("SORTEO_PREMIO", SORTEO.premio);
  SORTEO.link = getEnv("SORTEO_LINK", SORTEO.link);
  SORTEO.canal = getEnv("SORTEO_CANAL_LINK", SORTEO.canal);
  SORTEO.canalId = getEnv("SORTEO_CANAL_ID", SORTEO.canalId);
}

function getDeliveryZone(sector) {
  if (RURAL_SECTORS.includes(sector)) return "rural";
  if (URBAN_SECTORS.includes(sector)) return "urbano";
  return "urbano";
}

function getDeliveryCostFromData(delivery, sector, subtotal) {
  if (delivery !== "delivery") return 0;
  if (subtotal >= MINIMUM_ORDER) return 0;
  return getDeliveryZone(sector) === "rural" ? RURAL_DELIVERY_COST : URBAN_DELIVERY_COST;
}

function getCurrentDeliveryCost() {
  const deliveryInput = document.querySelector('input[name="delivery"]:checked');
  const sectorSelect = document.querySelector("#delivery-sector");
  const customSector = document.querySelector("#custom-sector");
  const delivery = deliveryInput ? deliveryInput.value : "delivery";
  const sector = sectorSelect ? (sectorSelect.value === "other" ? (customSector ? customSector.value.trim() : "") : sectorSelect.value) : "";
  return getDeliveryCostFromData(delivery, sector, calculateSubtotal());
}

const DEFAULT_PRODUCTS = [
  { id: "bolsas-de-basura-80x110-cm", name: "Bolsas de basura 80x110 cm", category: "limpieza", price: 1990, baseUnits: 10, recommendedVariant: "20 unidades", image: "https://images.unsplash.com/photo-1611567332772-a9ddb21695cd?auto=format&fit=crop&w=800&q=80", description: "Bolsas resistentes de 120 litros para hogar, local u oficina.", badge: "Mas vendido", stockStatus: "available", numeroSorteo: "001", fechaSorteo: "31 de diciembre de 2025", allowsVolumeQuote: true, variants: [{ id: "10 unidades", label: "10 unidades", units: 10, price: 1990 }, { id: "20 unidades", label: "20 unidades", units: 20, price: 3490 }, { id: "50 unidades", label: "50 unidades", units: 50, price: 6990 }, { id: "100 unidades", label: "100 unidades", units: 100, price: 11990 }] },
  { id: "esponja-lavaloza-multiuso", name: "Esponja lavaloza multiuso", category: "cocina", price: 690, baseUnits: 1, recommendedVariant: "10 unidades", image: "https://images.pexels.com/photos/9462196/pexels-photo-9462196.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Limpieza eficaz para loza, ollas y superficies de cocina.", badge: "", stockStatus: "available", numeroSorteo: "001", fechaSorteo: "31 de diciembre de 2025", allowsVolumeQuote: true, variants: [{ id: "1 unidad", label: "1 unidad", units: 1, price: 690 }, { id: "5 unidades", label: "5 unidades", units: 5, price: 2990 }, { id: "10 unidades", label: "10 unidades", units: 10, price: 4990 }, { id: "20 unidades", label: "20 unidades", units: 20, price: 8990 }, { id: "50 unidades", label: "50 unidades", units: 50, price: 19990 }] },
  { id: "pano-de-microfibra-40x40-cm", name: "Pano de microfibra 40x40 cm", category: "limpieza", price: 1490, baseUnits: 1, recommendedVariant: "10 unidades", image: "https://images.pexels.com/photos/4440535/pexels-photo-4440535.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Absorbente y reutilizable para cocina, muebles, vidrios y automovil.", badge: "Recomendado", stockStatus: "available", numeroSorteo: "001", fechaSorteo: "31 de diciembre de 2025", allowsVolumeQuote: true, variants: [{ id: "1 unidad", label: "1 unidad", units: 1, price: 1490 }, { id: "3 unidades", label: "3 unidades", units: 3, price: 3990 }, { id: "5 unidades", label: "5 unidades", units: 5, price: 5990 }, { id: "10 unidades", label: "10 unidades", units: 10, price: 9990 }, { id: "20 unidades", label: "20 unidades", units: 20, price: 17990 }, { id: "50 unidades", label: "50 unidades", units: 50, price: 34990 }] },
  { id: "pano-amarillo-38x38-cm", name: "Pano amarillo 38x38 cm", category: "cocina", price: 590, baseUnits: 1, recommendedVariant: "20 unidades", image: "https://images.pexels.com/photos/7814881/pexels-photo-7814881.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Basico rendidor para cocinas, restaurantes, oficinas y empresas de aseo.", badge: "", stockStatus: "available", numeroSorteo: "001", fechaSorteo: "31 de diciembre de 2025", allowsVolumeQuote: true, variants: [{ id: "1 unidad", label: "1 unidad", units: 1, price: 590 }, { id: "5 unidades", label: "5 unidades", units: 5, price: 2490 }, { id: "10 unidades", label: "10 unidades", units: 10, price: 4490 }, { id: "20 unidades", label: "20 unidades", units: 20, price: 7990 }, { id: "50 unidades", label: "50 unidades", units: 50, price: 16990 }, { id: "100 unidades", label: "100 unidades", units: 100, price: 29990 }] },
  { id: "guantes-de-nitrilo-texturizados", name: "Guantes de nitrilo texturizados", category: "proteccion", price: 7990, baseUnits: 1, recommendedVariant: "1 caja · 100 unidades", image: "https://images.pexels.com/photos/7856723/pexels-photo-7856723.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Caja de 100 unidades para limpieza, estetica, gastronomia y talleres.", badge: "100 por caja", stockStatus: "available", numeroSorteo: "001", fechaSorteo: "31 de diciembre de 2025", allowsVolumeQuote: true, variants: [{ id: "1 caja · 100 unidades", label: "1 caja · 100 unidades", units: 1, price: 7990 }, { id: "2 cajas · 200 unidades", label: "2 cajas · 200 unidades", units: 2, price: 14990 }, { id: "5 cajas · 500 unidades", label: "5 cajas · 500 unidades", units: 5, price: 34990 }, { id: "10 cajas · 1000 unidades", label: "10 cajas · 1000 unidades", units: 10, price: 64990 }] },
  { id: "papel-higienico-elite-ultra", name: "Papel higienico Elite Ultra", category: "hogar", price: 23990, baseUnits: 32, recommendedVariant: "32 rollos x 50 m", image: "https://images.pexels.com/photos/3958200/pexels-photo-3958200.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Doble hoja, 32 rollos de 50 metros cada uno.", badge: "Elite · 50 m", stockStatus: "available", numeroSorteo: "001", fechaSorteo: "31 de diciembre de 2025", allowsVolumeQuote: false, variants: [{ id: "32 rollos x 50 m", label: "32 rollos x 50 m", units: 32, price: 23990 }, { id: "64 rollos", label: "64 rollos", units: 64, price: 44990 }] },
  { id: "trapero-de-algodon-50x70-cm", name: "Trapero de algodon 50x70 cm", category: "hogar", price: 2490, baseUnits: 1, recommendedVariant: "3 unidades", image: "https://images.pexels.com/photos/7513158/pexels-photo-7513158.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Trapero de algodon con ojal, absorbente y practico para pisos.", badge: "", stockStatus: "available", numeroSorteo: "001", fechaSorteo: "31 de diciembre de 2025", allowsVolumeQuote: true, variants: [{ id: "1 unidad", label: "1 unidad", units: 1, price: 2490 }, { id: "2 unidades", label: "2 unidades", units: 2, price: 4490 }, { id: "3 unidades", label: "3 unidades", units: 3, price: 6490 }, { id: "5 unidades", label: "5 unidades", units: 5, price: 9990 }, { id: "10 unidades", label: "10 unidades", units: 10, price: 18990 }] },
  { id: "cepillo-multiuso-para-limpieza", name: "Cepillo multiuso para limpieza", category: "automovil", price: 1990, baseUnits: 1, recommendedVariant: "3 unidades", image: "https://images.pexels.com/photos/45059/pexels-photo-45059.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Escobilla practica para hogar, taller y limpieza del automovil.", badge: "Multiuso", stockStatus: "available", numeroSorteo: "001", fechaSorteo: "31 de diciembre de 2025", allowsVolumeQuote: true, variants: [{ id: "1 unidad", label: "1 unidad", units: 1, price: 1990 }, { id: "3 unidades", label: "3 unidades", units: 3, price: 4990 }, { id: "5 unidades", label: "5 unidades", units: 5, price: 7490 }] }
];

function getCategoryLabel(id) {
  const labels = {
    all: "Todos", limpieza: "Limpieza", cocina: "Cocina", proteccion: "Protección",
    automovil: "Automóvil", hogar: "Hogar", general: "General"
  };
  return labels[id] || (id.charAt(0).toUpperCase() + id.slice(1));
}

function buildProducts() {
  const products = [];
  for (let i = 1; i <= 100; i++) {
    const name = getEnv(`PRODUCTO_${i}_NOMBRE`) || getEnv(`PRODUCTO_${i}`) || getEnv(`producto_${i}`);
    if (!name) break;
    const description = getEnv(`PRODUCTO_${i}_DESCRIPCION`, getEnv(`DESCRIPCION_${i}`, ""));
    const category = (getEnv(`PRODUCTO_${i}_CATEGORIA`, "general")).toLowerCase();
    const image = normalizeImageUrl(getEnv(`PRODUCTO_${i}_IMAGEN`, getEnv(`IMAGEN_${i}`, "")));
    const badge = getEnv(`PRODUCTO_${i}_ETIQUETA`, "");
    const numeroSorteo = getEnv(`PRODUCTO_${i}_NUMERO_SORTEO`, getEnv(`PRODUCTO_${i}_SORTEO_NUMERO`, ""));
    const fechaSorteo = getEnv(`PRODUCTO_${i}_FECHA_SORTEO`, getEnv(`PRODUCTO_${i}_SORTEO_FECHA`, ""));
    const info = getEnv(`PRODUCTO_${i}_INFO`, "");
    const variantStr = getEnv(`PRODUCTO_${i}_VARIANTES`, "");
    let variants = [];
    if (variantStr) {
      variants = variantStr.split(",").map((part) => {
        const [labelRaw, priceRaw] = part.split(":");
        const label = String(labelRaw || "").trim();
        const price = parsePrice(priceRaw, 0);
        return { id: label, label, units: parseUnits(label), price };
      }).filter((variant) => variant.label && variant.price > 0);
    }
    if (!variants.length) {
      const basePrice = parsePrice(getEnv(`PRODUCTO_${i}_PRECIO`, getEnv(`PRECIO_${i}`, "0")), 0);
      variants = [{ id: "1 unidad", label: "1 unidad", units: 1, price: basePrice }];
    }
    const recommendedLabel = getEnv(`PRODUCTO_${i}_VARIANTE_RECOMENDADA`, "").trim();
    const recommendedVariant = variants.find((variant) => variant.label === recommendedLabel)?.id || variants[0].id;
    const allowsVolumeQuote = getEnv(`PRODUCTO_${i}_COTIZAR_VOLUMEN`, "").toLowerCase() !== "false";
    products.push({
      id: slugify(name), name, category, description, badge,
      image, fallbackImage: createProductImage(name, "#287ea8", "#d8f2f8"),
      price: variants[0].price, baseUnits: variants[0].units, recommendedVariant,
      variants, stockStatus: "available", stock: 999, numeroSorteo, fechaSorteo, info, allowsVolumeQuote
    });
  }
  const fallback = products.length ? products : DEFAULT_PRODUCTS;
  return fallback.map((product) => ({ ...product, stock: Number.isFinite(product.stock) ? product.stock : 999 }));
}

function buildCategories() {
  const ids = ["all", ...new Set(PRODUCTS.map((product) => product.category).filter(Boolean))];
  return ids.map((id) => ({ id, label: getCategoryLabel(id) }));
}

let PRODUCTS = DEFAULT_PRODUCTS;
let CATEGORIES = [{ id: "all", label: "Todos" }, { id: "limpieza", label: "Limpieza" }, { id: "cocina", label: "Cocina" }, { id: "proteccion", label: "Protección" }, { id: "automovil", label: "Automóvil" }, { id: "hogar", label: "Hogar" }];

const PRODUCTS_PER_PAGE = 15;
let cart = [];
let activeCategory = "all";
let searchTerm = "";
let currentProductPage = 1;
const productQuantities = new Map();

const getProduct = (id) => PRODUCTS.find((product) => product.id === id);
const getCartKey = (id, variantId = "default") => `${id}:${variantId}`;

function getVariant(product, variantId) {
  return product?.variants.find((variant) => variant.id === variantId) || product?.variants[0];
}

function getItemDetails(item) {
  const product = getProduct(item.productId);
  const variant = getVariant(product, item.variantId);
  return product && variant ? { ...product, variantLabel: variant.label, variantUnits: variant.units, unitPrice: variant.price, baseValue: (product.price / (product.baseUnits || 1)) * variant.units } : null;
}

function getCartUnitsForProduct(productId, excludeKey = null) {
  return cart.reduce((total, item) => {
    if (item.productId !== productId || item.key === excludeKey) return total;
    const details = getItemDetails(item);
    return total + (details ? details.variantUnits * item.quantity : 0);
  }, 0);
}

function renderCategoryFilters() {
  const container = document.querySelector("#category-filters");
  container.innerHTML = CATEGORIES.map((category) => `<button type="button" class="filter-button ${activeCategory === category.id ? "active" : ""}" data-category="${category.id}" aria-pressed="${activeCategory === category.id}">${category.label}</button>`).join("");
}

function productCardTemplate(product) {
  const selectedVariant = getVariant(product, product.recommendedVariant);
  const outOfStock = product.stockStatus === "out";
  const lowStock = product.stockStatus === "low";
  const sorteoLine = product.numeroSorteo ? `<p class="product-draw">Sorteo N°${product.numeroSorteo} · ${product.fechaSorteo}</p>` : "";
  const infoLine = product.info ? `<p class="product-info">${product.info}</p>` : "";
  const stockLine = product.stock < 999 ? `<p class="product-stock">${outOfStock ? "Sin stock" : lowStock ? `Quedan ${product.stock} ${getUnitName(product, product.stock)}` : `Stock: ${product.stock} ${getUnitName(product, product.stock)}`}</p>` : "";
  const description = formatProductDescription(product.description);
  return `<article class="product-card" data-product-card="${product.id}" data-stock="${product.stock}" data-variant-units="${selectedVariant.units}">
    <div class="product-image"><img class="lazy-image" src="${LAZY_IMAGE_PLACEHOLDER}" data-src="${product.image}" data-fallback="${product.fallbackImage}" alt="Imagen referencial de ${product.name}" loading="lazy" decoding="async" width="560" height="400">${product.badge ? `<span class="badge">${product.badge}</span>` : ""}${lowStock ? '<span class="badge stock-badge">Últimas unidades</span>' : ""}<small class="reference-photo">Imagen referencial</small></div>
    <div class="product-body"><span class="product-category">${CATEGORIES.find((item) => item.id === product.category)?.label || product.category}</span><h3>${product.name}</h3>${description}${sorteoLine}${infoLine}
      <div class="price-row"><strong class="price-main" data-price="${product.id}">${formatCurrency.format(selectedVariant.price)}</strong></div>
      ${stockLine}
      <div class="product-controls"><div><span class="control-label">Cantidad</span><div class="quantity-control" aria-label="Cantidad"><button type="button" data-product-quantity="decrease" data-id="${product.id}" aria-label="Disminuir cantidad">−</button><output data-product-output="${product.id}">1</output><button type="button" data-product-quantity="increase" data-id="${product.id}" aria-label="Aumentar cantidad">+</button></div></div><button class="add-button" type="button" data-add-product="${product.id}" ${outOfStock ? "disabled" : ""}>${outOfStock ? "Agotado" : "Agregar"}</button></div>
      ${product.allowsVolumeQuote ? `<button class="volume-quote" type="button" data-volume-quote="${product.id}">¿Necesitas más? Cotizar volumen</button>` : '<span class="volume-quote-placeholder" aria-hidden="true"></span>'}
    </div></article>`;
}

function getUnitName(product, quantity) {
  const name = normalizeText(`${product.name} ${product.category}`);
  if (name.includes("guante") || name.includes("nitrilo")) return quantity === 1 ? "caja" : "cajas";
  if (name.includes("papel")) return quantity === 1 ? "rollo" : "rollos";
  return quantity === 1 ? "unidad" : "unidades";
}

function getUnitPriceText(product, variant) {
  const unitPrice = Math.round(variant.price / variant.units);
  const name = normalizeText(product.name);
  let unit = "cada unidad";
  if (name.includes("guante") || name.includes("nitrilo")) unit = "por caja";
  else if (name.includes("papel")) unit = "por rollo";
  return `${formatCurrency.format(unitPrice)} ${unit}`;
}

function renderPagination(totalPages) {
  const pagination = document.querySelector("#product-pagination");
  if (totalPages <= 1) {
    pagination.innerHTML = "";
    pagination.hidden = true;
    return;
  }
  pagination.hidden = false;
  const pageButtons = Array.from({ length: totalPages }, (_, index) => {
    const page = index + 1;
    return `<button type="button" data-product-page="${page}" class="${page === currentProductPage ? "active" : ""}" aria-label="Ir a la página ${page}" ${page === currentProductPage ? 'aria-current="page"' : ""}>${page}</button>`;
  }).join("");
  pagination.innerHTML = `<button type="button" data-product-page="${currentProductPage - 1}" ${currentProductPage === 1 ? "disabled" : ""} aria-label="Página anterior">‹</button>${pageButtons}<button type="button" data-product-page="${currentProductPage + 1}" ${currentProductPage === totalPages ? "disabled" : ""} aria-label="Página siguiente">›</button>`;
}

function renderProducts() {
  const grid = document.querySelector("#product-grid");
  const items = PRODUCTS
    .filter((product) => (activeCategory === "all" || product.category === activeCategory) && normalizeText(`${product.name} ${product.description}`).includes(normalizeText(searchTerm)))
    .sort((first, second) => first.name.localeCompare(second.name, "es", { sensitivity: "base" }));
  const totalPages = Math.max(1, Math.ceil(items.length / PRODUCTS_PER_PAGE));
  currentProductPage = Math.min(currentProductPage, totalPages);
  const start = (currentProductPage - 1) * PRODUCTS_PER_PAGE;
  const visibleItems = items.slice(start, start + PRODUCTS_PER_PAGE);
  grid.innerHTML = visibleItems.length ? visibleItems.map(productCardTemplate).join("") : `<div class="empty-products"><strong>No encontramos productos</strong><p>Prueba con otra búsqueda o categoría.</p></div>`;
  document.querySelector("#results-status").textContent = `${items.length} producto${items.length === 1 ? "" : "s"} disponible${items.length === 1 ? "" : "s"}${totalPages > 1 ? ` · Página ${currentProductPage} de ${totalPages}` : ""}.`;
  renderPagination(items.length ? totalPages : 0);
  attachImageFallbacks(grid);
  initializeLazyImages(grid);
  productQuantities.clear();
}

function loadLazyImage(image) {
  if (!image.dataset.src) return;
  image.src = image.dataset.src;
  delete image.dataset.src;
}

function initializeLazyImages(scope = document) {
  const images = scope.querySelectorAll("img[data-src]");
  if (!("IntersectionObserver" in window)) {
    images.forEach(loadLazyImage);
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      loadLazyImage(entry.target);
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "300px 0px", threshold: 0.01 });
  images.forEach((image) => observer.observe(image));
}

function attachImageFallbacks(scope = document) {
  scope.querySelectorAll("img[data-fallback]").forEach((image) => {
    image.addEventListener("load", () => image.classList.add("loaded"));
    image.addEventListener("error", () => {
      image.src = image.dataset.fallback;
      delete image.dataset.src;
    }, { once: true });
  });
}

function addToCart(productId, variantId = "default", quantity = 1) {
  const source = getProduct(productId);
  if (!source || source.stockStatus === "out") return;
  const safeQuantity = Math.max(1, Math.min(99, Number(quantity) || 1));
  const key = getCartKey(productId, variantId);
  const existing = cart.find((item) => item.key === key);
  if (existing) existing.quantity = Math.min(99, existing.quantity + safeQuantity);
  else cart.push({ key, productId, variantId, quantity: safeQuantity });
  saveCart();
  renderCart();
  trackEvent("product_added", productId);
  showToast("✓ Agregado al carrito.", "success");
  animateCartBadge();
}

function removeFromCart(key) {
  cart = cart.filter((item) => item.key !== key);
  saveCart();
  renderCart();
  showToast("Producto eliminado del carrito.");
}

function updateQuantity(key, quantity) {
  const item = cart.find((cartItem) => cartItem.key === key);
  if (!item) return;
  if (quantity <= 0) return removeFromCart(key);
  const product = getProduct(item.productId);
  const variant = getVariant(product, item.variantId);
  if (!product || !variant || !Number.isFinite(product.stock)) return;
  const currentUnits = getCartUnitsForProduct(item.productId, item.key);
  const requestedUnits = quantity * variant.units;
  if (currentUnits + requestedUnits > product.stock) {
    showToast(`No hay stock suficiente. Stock disponible: ${product.stock} ${getUnitName(product, product.stock)}.`, "error");
    return;
  }
  item.quantity = Math.min(99, Number(quantity) || 1);
  saveCart();
  renderCart();
}

function clearCart() {
  if (!cart.length) return showToast("Tu carrito está vacío.");
  cart = [];
  saveCart();
  renderCart();
  showToast("Carrito vaciado.");
}

function calculateSubtotal() {
  return cart.reduce((total, item) => {
    const details = getItemDetails(item);
    return total + (details ? details.unitPrice * item.quantity : 0);
  }, 0);
}

function calculateTotal() {
  return Math.max(0, calculateSubtotal() + getCurrentDeliveryCost());
}

function calculateSavings() {
  return cart.reduce((total, item) => {
    const details = getItemDetails(item);
    return total + (details ? Math.max(0, details.baseValue - details.unitPrice) * item.quantity : 0);
  }, 0);
}

function renderCart() {
  cart = cart.filter((item) => getItemDetails(item));
  const container = document.querySelector("#cart-items");
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = calculateSubtotal();
  const deliveryCost = getCurrentDeliveryCost();
  const total = calculateTotal();
  document.querySelectorAll("[data-cart-count]").forEach((badge) => badge.textContent = totalItems);
  document.querySelectorAll("[data-open-cart]").forEach((button) => button.setAttribute("aria-label", `Abrir carrito, ${totalItems} producto${totalItems === 1 ? "" : "s"}`));
  document.querySelectorAll("[data-cart-summary]").forEach((summary) => summary.textContent = cart.length ? `${totalItems} artículo${totalItems === 1 ? "" : "s"} · ${formatCurrency.format(total)}` : "Tu carrito está vacío");
  if (!cart.length) container.innerHTML = `<div class="empty-cart"><div><span aria-hidden="true">🛒</span><h3>Tu carrito está vacío</h3><p>Agrega productos para comenzar.</p></div></div>`;
  else container.innerHTML = cart.map((item) => {
    const details = getItemDetails(item);
    const fallback = details.fallbackImage || details.image;
    return `<article class="cart-item"><img class="cart-item-image" src="${details.image}" data-fallback="${fallback}" alt="" width="58" height="58"><div><h3>${details.name}</h3><span class="cart-item-variant">${details.variantLabel} · ${item.quantity} presentación${item.quantity === 1 ? "" : "es"}</span><strong class="cart-item-price">${formatCurrency.format(details.unitPrice * item.quantity)}</strong><div class="cart-item-actions"><button type="button" data-cart-change="-1" data-key="${item.key}" aria-label="Disminuir ${details.name}">−</button><output aria-label="Cantidad">${item.quantity}</output><button type="button" data-cart-change="1" data-key="${item.key}" aria-label="Aumentar ${details.name}">+</button></div></div><button type="button" class="remove-item" data-remove="${item.key}" aria-label="Eliminar ${details.name}">Eliminar</button></article>`;
  }).join("");
  attachImageFallbacks(container);
  document.querySelector("#active-promo").hidden = true;
  document.querySelector("#cart-subtotal").textContent = formatCurrency.format(subtotal);
  const deliveryBox = document.querySelector("#cart-discount");
  if (!cart.length) deliveryBox.textContent = formatCurrency.format(0);
  else if (deliveryCost === 0) deliveryBox.textContent = subtotal >= MINIMUM_ORDER ? "Gratis" : "Por confirmar";
  else deliveryBox.textContent = formatCurrency.format(deliveryCost);
  document.querySelector("#cart-savings").textContent = formatCurrency.format(calculateSavings());
  document.querySelector("#cart-total").textContent = formatCurrency.format(total);
  document.querySelector("#checkout-total").textContent = formatCurrency.format(total);
  const remaining = Math.max(0, MINIMUM_ORDER - subtotal);
  const minimumBox = document.querySelector("#minimum-order");
  minimumBox.className = `minimum-order ${remaining ? "pending" : "reached"}`;
  minimumBox.textContent = cart.length ? (remaining ? `Te faltan ${formatCurrency.format(remaining)} para delivery gratis.` : "✓ Delivery gratis por compra mínima.") : `Compra mínima para delivery gratis: ${formatCurrency.format(MINIMUM_ORDER)}.`;
  const continueButton = document.querySelector("#go-checkout");
  continueButton.disabled = !cart.length;
  document.querySelector("#clear-cart").disabled = !cart.length;
  const mobileBar = document.querySelector("#mobile-cart-bar");
  mobileBar.hidden = !cart.length;
  document.querySelector("[data-mobile-cart-summary]").textContent = `${totalItems} producto${totalItems === 1 ? "" : "s"}`;
  document.querySelector("[data-mobile-cart-total]").textContent = formatCurrency.format(total);
}

function saveCart() {
  try { localStorage.setItem("aseo-cart", JSON.stringify(cart)); } catch (error) { console.warn("No fue posible guardar el carrito.", error); }
}

function loadCart() {
  try {
    const stored = JSON.parse(localStorage.getItem("aseo-cart") || "[]");
    cart = Array.isArray(stored) ? stored.filter((item) => item && item.key && Number.isFinite(item.quantity)) : [];
  } catch (error) {
    cart = [];
    localStorage.removeItem("aseo-cart");
  }
  renderCart();
}

function validateCheckout() {
  const name = document.querySelector("#customer-name").value.trim();
  const phone = document.querySelector("#customer-phone").value.trim();
  const emailInput = document.querySelector("#customer-email");
  const email = emailInput.value.trim();
  const delivery = document.querySelector('input[name="delivery"]:checked').value;
  const sectorSelect = document.querySelector("#delivery-sector");
  const customSector = document.querySelector("#custom-sector").value.trim();
  const sector = sectorSelect.value === "other" ? customSector : sectorSelect.value;
  const address = document.querySelector("#delivery-address").value.trim();
  const payment = document.querySelector('input[name="payment"]:checked').value;
  const notes = document.querySelector("#order-notes").value.trim();
  const phoneDigits = phone.replace(/\D/g, "");
  const subtotal = calculateSubtotal();
  const zone = getDeliveryZone(sector);
  const deliveryCost = getDeliveryCostFromData(delivery, sector, subtotal);
  const errors = [];
  if (!cart.length) errors.push("Agrega al menos un producto al carrito.");
  if (name.length < 3) errors.push("Ingresa tu nombre completo.");
  if (phoneDigits.length < 9) errors.push("Ingresa un número de WhatsApp válido.");
  if (email && !emailInput.validity.valid) errors.push("Revisa el formato del correo electrónico.");
  if (delivery === "delivery" && sector.length < 2) errors.push("Selecciona o escribe un sector de Romeral.");
  if (delivery === "delivery" && address.length < 4) errors.push("Ingresa una dirección dentro de Romeral.");
  document.querySelector("#form-errors").innerHTML = errors.map((error) => `<div>• ${error}</div>`).join("");
  if (errors.length) showToast("Revisa los datos marcados para continuar.", "error");
  return { valid: errors.length === 0, data: { name, phone, email, delivery, sector, zone, address, payment, notes, deliveryCost } };
}

function generateWhatsAppMessage(customer = {}) {
  const lines = cart.map((item) => {
    const details = getItemDetails(item);
    return `- ${details.name} - ${details.variantLabel} x${item.quantity}\n  ${formatCurrency.format(details.unitPrice * item.quantity)}`;
  }).join("\n\n");
  const emailLine = customer.email ? `\nCorreo:\n${customer.email}\n` : "";
  const zoneText = customer.delivery === "delivery" ? `Zona: ${customer.zone || "urbana"}` : "";
  const deliveryCostText = customer.deliveryCost ? `Costo delivery: ${formatCurrency.format(customer.deliveryCost)}` : "Delivery gratis";
  const deliveryText = customer.delivery === "delivery" ? `Delivery dentro de Romeral\nSector: ${customer.sector}\n${zoneText}\nDireccion: ${customer.address}\n${deliveryCostText}` : "Retiro por coordinar";
  const paymentText = customer.payment === "cash-delivery" ? "Efectivo al recibir" : "Transferencia antes de confirmar el pedido";
  const notesLine = customer.notes ? `\nINDICACIONES\n${customer.notes}\n` : "";
  return `Hola, quiero realizar el siguiente pedido:\n\nCLIENTE\nNombre: ${customer.name}\nWhatsApp: ${customer.phone}\n${emailLine}\nENTREGA\n${deliveryText}\n\nPAGO\n${paymentText}\n${notesLine}\nPEDIDO\n\n${lines}\n\n--------------------\n\nSubtotal productos: ${formatCurrency.format(calculateSubtotal())}\nDelivery: ${customer.deliveryCost ? formatCurrency.format(customer.deliveryCost) : "Gratis"}\nTotal a pagar: ${formatCurrency.format(calculateTotal())}\nAhorro obtenido: ${formatCurrency.format(calculateSavings())}\n\nEntiendo que el stock, la entrega y la confirmacion final se coordinan por WhatsApp.`;
}

async function sendOrderToAppsScript(customerData) {
  const scriptUrl = getEnv("APPS_SCRIPT_URL", "").trim();
  if (!scriptUrl) return null;
  const solicitudId = `WEB-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const productos = cart.map((item) => {
    const details = getItemDetails(item);
    return { id: item.productId, cantidad: item.quantity, variante: item.variantId, precio: details?.unitPrice || 0 };
  });
  const payload = {
    action: "crearPedido",
    solicitud_id: solicitudId,
    cliente: {
      nombre: customerData.name,
      telefono: customerData.phone,
      tipo_entrega: customerData.delivery,
      sector: customerData.sector,
      direccion: customerData.address,
      metodo_pago: customerData.payment
    },
    productos: productos,
    tipo_zona: customerData.zone || "urbano"
  };
  try {
    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      redirect: "follow"
    });
    if (!response.ok) {
      console.warn("Apps Script respondió con status:", response.status);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.warn("Error registrando pedido en Apps Script:", error);
    return null;
  }
}

async function sendOrderToWhatsApp(event) {
  event?.preventDefault();
  const validation = validateCheckout();
  if (!validation.valid) return;
  const submitButton = document.querySelector(".order-button");
  if (submitButton) { submitButton.disabled = true; submitButton.textContent = "Registrando pedido..."; }
  try {
    const result = await sendOrderToAppsScript(validation.data);
    if (result) console.log("Pedido registrado en Apps Script:", result);
  } catch (error) {
    console.warn("No se pudo registrar en Apps Script, el pedido continúa por WhatsApp:", error);
  }
  const message = generateWhatsAppMessage(validation.data);
  const url = `https://wa.me/${BUSINESS_CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;
  saveLastOrder();
  saveCustomerData(validation.data);
  trackEvent("whatsapp_order_opened");
  showToast("Tu pedido está listo. Se abrirá WhatsApp para enviarlo.", "success");
  if (submitButton) { submitButton.disabled = false; submitButton.innerHTML = '<span aria-hidden="true">☎</span> Preparar pedido en WhatsApp'; }
  window.open(url, "_blank", "noopener,noreferrer");
}

function showCartStep(step) {
  document.querySelector("#cart-step-1").classList.toggle("active", step === 1);
  document.querySelector("#checkout-form").classList.toggle("active", step === 2);
  document.querySelectorAll("[data-step-indicator]").forEach((indicator) => indicator.classList.toggle("active", Number(indicator.dataset.stepIndicator) <= step));
  document.querySelector("#cart-title").textContent = step === 1 ? "Tu pedido" : "Completa tus datos";
  document.querySelector("#cart-drawer").scrollTop = 0;
}

function saveLastOrder() {
  try {
    localStorage.setItem(LAST_ORDER_KEY, JSON.stringify({ cart, total: calculateTotal(), date: new Date().toISOString() }));
    renderLastOrder();
  } catch (error) { console.warn("No fue posible guardar el último pedido.", error); }
}

function getLastOrder() {
  try { return JSON.parse(localStorage.getItem(LAST_ORDER_KEY) || "null"); }
  catch (error) { return null; }
}

function renderLastOrder() {
  const lastOrder = getLastOrder();
  const section = document.querySelector("#pedido-anterior");
  const validItems = lastOrder?.cart?.filter((item) => getItemDetails(item)) || [];
  section.hidden = !validItems.length;
  if (validItems.length) {
    const count = validItems.reduce((total, item) => total + item.quantity, 0);
    document.querySelector("#last-order-summary").textContent = `${count} artículo${count === 1 ? "" : "s"} · ${formatCurrency.format(lastOrder.total)} · preparado el ${new Date(lastOrder.date).toLocaleDateString("es-CL")}.`;
  }
}

function repeatLastOrder() {
  const lastOrder = getLastOrder();
  if (!lastOrder?.cart?.length) return showToast("No encontramos un pedido anterior.");
  cart = lastOrder.cart.filter((item) => getItemDetails(item));
  saveCart();
  renderCart();
  openCart();
  showToast("Pedido anterior cargado al carrito.", "success");
}

function getShareText() {
  const items = cart.map((item) => {
    const details = getItemDetails(item);
    return `• ${details.name} — ${details.variantLabel} x${item.quantity}: ${formatCurrency.format(details.unitPrice * item.quantity)}`;
  }).join("\n");
  return `Pedido Romayor\n\n${items}\n\nTotal productos: ${formatCurrency.format(calculateTotal())}\nEntrega disponible dentro de Romeral.`;
}

async function shareCart() {
  if (!cart.length) return showToast("Tu carrito está vacío.");
  const text = getShareText();
  trackEvent("cart_shared");
  try {
    if (navigator.share) await navigator.share({ title: "Pedido Romayor", text });
    else {
      await navigator.clipboard.writeText(text);
      showToast("Resumen copiado. Ya puedes compartirlo.", "success");
    }
  } catch (error) {
    if (error.name !== "AbortError") showToast("No fue posible compartir el resumen.", "error");
  }
}

function openCart() {
  const drawer = document.querySelector("#cart-drawer");
  showCartStep(1);
  trackEvent("cart_opened");
  const overlay = document.querySelector("#drawer-overlay");
  overlay.hidden = false;
  requestAnimationFrame(() => { overlay.classList.add("visible"); drawer.classList.add("open"); });
  drawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("drawer-open");
  document.querySelector("#close-cart").focus();
}

function closeCart() {
  const drawer = document.querySelector("#cart-drawer");
  const overlay = document.querySelector("#drawer-overlay");
  drawer.classList.remove("open");
  overlay.classList.remove("visible");
  drawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("drawer-open");
  setTimeout(() => { overlay.hidden = true; }, 260);
}

function showToast(message, type = "default") {
  const region = document.querySelector("#toast-region");
  const isDuplicate = Array.from(region.children).some((item) => item.textContent === message && item.classList.contains(type) && !item.classList.contains("out"));
  if (isDuplicate) return;
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  region.append(toast);
  setTimeout(() => toast.classList.add("out"), 2600);
  setTimeout(() => toast.remove(), 2900);
}

function animateCartBadge() {
  const badge = document.querySelector(".cart-badge");
  badge.classList.remove("bump");
  requestAnimationFrame(() => badge.classList.add("bump"));
}

function renderSectors() {
  const select = document.querySelector("#delivery-sector");
  const hasSectors = URBAN_SECTORS.length || RURAL_SECTORS.length;
  let options = "";
  if (hasSectors) {
    options += '<option value="">Selecciona un sector</option>';
    if (URBAN_SECTORS.length) options += `<optgroup label="Zona urbana">${URBAN_SECTORS.map((sector) => `<option value="${sector}" data-zone="urbano">${sector}</option>`).join("")}</optgroup>`;
    if (RURAL_SECTORS.length) options += `<optgroup label="Zona rural">${RURAL_SECTORS.map((sector) => `<option value="${sector}" data-zone="rural">${sector}</option>`).join("")}</optgroup>`;
    options += '<option value="other" data-zone="urbano">Otro sector</option>';
  } else {
    options = '<option value="other" data-zone="urbano">Escribir sector manualmente</option>';
  }
  select.innerHTML = options;
  select.value = "other";
  updateSectorField();
}

function updateSectorField() {
  const manual = document.querySelector("#delivery-sector").value === "other";
  document.querySelector("#custom-sector-label").hidden = !manual;
  document.querySelector("#custom-sector").required = manual;
  renderCart();
}

function updateDeliveryFields() {
  const delivery = document.querySelector('input[name="delivery"]:checked').value;
  const show = delivery === "delivery";
  document.querySelector("#delivery-fields").hidden = !show;
  document.querySelector("#delivery-address").required = show;
  document.querySelector("#delivery-sector").required = show;
  document.querySelector("#custom-sector").required = show && document.querySelector("#delivery-sector").value === "other";
  renderCart();
}

function updatePaymentFields() {
  document.querySelector("#bank-details").hidden = document.querySelector('input[name="payment"]:checked').value !== "transfer-now";
}

function saveCustomerData(data) {
  try {
    if (!document.querySelector("#remember-customer").checked) return localStorage.removeItem(CUSTOMER_DATA_KEY);
    localStorage.setItem(CUSTOMER_DATA_KEY, JSON.stringify({ name: data.name, phone: data.phone, email: data.email, delivery: data.delivery, sector: data.sector, address: data.address, payment: data.payment }));
  } catch (error) { console.warn("No fue posible recordar los datos.", error); }
}

function loadCustomerData() {
  try {
    const data = JSON.parse(localStorage.getItem(CUSTOMER_DATA_KEY) || "null");
    if (!data) return;
    document.querySelector("#customer-name").value = data.name || "";
    document.querySelector("#customer-phone").value = data.phone || "+56 9 ";
    document.querySelector("#customer-email").value = data.email || "";
    document.querySelector("#delivery-address").value = data.address || "";
    const deliveryInput = document.querySelector(`input[name="delivery"][value="${data.delivery}"]`);
    const paymentInput = document.querySelector(`input[name="payment"][value="${data.payment}"]`);
    if (deliveryInput) deliveryInput.checked = true;
    if (paymentInput) paymentInput.checked = true;
    if (data.sector && [...URBAN_SECTORS, ...RURAL_SECTORS].includes(data.sector)) document.querySelector("#delivery-sector").value = data.sector;
    else if (data.sector) document.querySelector("#custom-sector").value = data.sector;
    document.querySelector("#remember-customer").checked = true;
    updateSectorField(); updateDeliveryFields(); updatePaymentFields();
  } catch (error) { localStorage.removeItem(CUSTOMER_DATA_KEY); }
}

function sendVolumeQuote(productId) {
  const product = getProduct(productId);
  if (!product) return;
  trackEvent("volume_quote", productId);
  window.open(`https://wa.me/${BUSINESS_CONFIG.whatsapp}?text=${encodeURIComponent(`Hola, quiero cotizar una compra por volumen de ${product.name}. Necesito consultar cantidades, precio y disponibilidad.`)}`, "_blank", "noopener,noreferrer");
}

function trackEvent(eventName, detail = "") {
  try {
    const analytics = JSON.parse(localStorage.getItem(ANALYTICS_KEY) || "{}");
    analytics[eventName] = (analytics[eventName] || 0) + 1;
    analytics.lastEvent = { name: eventName, detail, date: new Date().toISOString() };
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
  } catch (error) { console.warn("Analitica local no disponible.", error); }
}

function updateBusinessContent() {
  document.querySelectorAll("[data-business-name]").forEach((element) => element.textContent = BUSINESS_CONFIG.name);
  document.querySelectorAll("[data-business-email]").forEach((element) => element.textContent = BUSINESS_CONFIG.email);
  document.querySelectorAll("[data-business-hours]").forEach((element) => element.textContent = BUSINESS_CONFIG.hours);
  document.querySelectorAll("[data-bank]").forEach((element) => element.textContent = BANK_TRANSFER_CONFIG[element.dataset.bank]);
  document.querySelectorAll("[data-whatsapp-link]").forEach((element) => {
    const current = new URL(element.href, window.location.href);
    const text = current.searchParams.get("text") || "Hola, quiero consultar por los productos.";
    element.href = `https://wa.me/${BUSINESS_CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
  });
  document.title = `Productos de Aseo a Buen Precio | ${BUSINESS_CONFIG.name}`;
  const businessLink = document.querySelector("#business-whatsapp");
  if (businessLink) businessLink.href = `https://wa.me/${BUSINESS_CONFIG.whatsapp}?text=${encodeURIComponent("Hola, tengo un negocio y me gustaría consultar por precios para compras por volumen.")}`;
}

async function copyBankDetails() {
  const text = `Banco: ${BANK_TRANSFER_CONFIG.bank}\nTipo de cuenta: ${BANK_TRANSFER_CONFIG.accountType}\nTitular: ${BANK_TRANSFER_CONFIG.holder}\nRUT: ${BANK_TRANSFER_CONFIG.rut}\nN.º de cuenta: ${BANK_TRANSFER_CONFIG.accountNumber}\nCorreo: ${BANK_TRANSFER_CONFIG.email}`;
  try {
    await navigator.clipboard.writeText(text);
    showToast("Datos de transferencia copiados.", "success");
  } catch (error) { showToast("No fue posible copiar los datos.", "error"); }
}

function updateDrawDate() {
  const drawNumberEl = document.querySelector("#draw-number");
  const drawDateEl = document.querySelector("#draw-date");
  const drawPrizeEl = document.querySelector("#draw-prize");
  const countdownEl = document.querySelector("#draw-countdown");
  if (drawNumberEl) drawNumberEl.textContent = SORTEO.numero ? `Sorteo N°${SORTEO.numero}` : "Sorteo activo";
  if (drawPrizeEl) drawPrizeEl.textContent = SORTEO.premio;
  if (drawDateEl) drawDateEl.textContent = SORTEO.fecha;
  if (!countdownEl) return;
  const parsed = new Date(SORTEO.fecha.replace(/de /g, "").replace(/ /g, "/"));
  const now = new Date();
  if (Number.isNaN(parsed.getTime())) {
    countdownEl.textContent = "";
    return;
  }
  const days = Math.max(0, Math.ceil((parsed.setHours(23, 59, 59, 999) - now) / 86400000));
  countdownEl.textContent = `${days} día${days === 1 ? "" : "s"} restante${days === 1 ? "" : "s"}`;
}

function toEmbedUrl(url) {
  if (!url) return "";
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === "youtu.be") {
      const id = urlObj.pathname.slice(1).split("/")[0];
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }
    if (urlObj.hostname.includes("youtube.com")) {
      const pathname = urlObj.pathname.toLowerCase();
      if (pathname.startsWith("/create/live/join") || pathname.startsWith("/live_chat") || pathname.startsWith("/studio") || pathname.startsWith("/account") || pathname.startsWith("/signin") || pathname.startsWith("/redirect")) return "";
      const v = urlObj.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
      const list = urlObj.searchParams.get("list");
      if (list) return `https://www.youtube.com/embed/videoseries?list=${list}`;
      const liveMatch = urlObj.pathname.match(/\/live\/([\w-]+)/);
      if (liveMatch) return `https://www.youtube.com/embed/${liveMatch[1]}`;
      const directChannelMatch = urlObj.pathname.match(/^\/(UC[\w-]+)\/?$/);
      if (directChannelMatch) return `https://www.youtube.com/embed/live_stream?channel=${directChannelMatch[1]}`;
      const channelMatch = urlObj.pathname.match(/\/channel\/(UC[\w-]+)/);
      if (channelMatch) return `https://www.youtube.com/embed/live_stream?channel=${channelMatch[1]}`;
      return "";
    }
    return url;
  } catch (error) {
    return "";
  }
}

function updateStreamEmbed(selector, url, fallbackEmbedUrl = "") {
  const iframe = document.querySelector(`[data-${selector}]`);
  const wrapper = document.querySelector(`[data-${selector}-wrapper]`);
  const placeholder = document.querySelector(`[data-${selector}-placeholder]`);
  if (!iframe || !wrapper || !placeholder) return;
  const embedUrl = toEmbedUrl(url) || fallbackEmbedUrl;
  if (embedUrl) {
    iframe.src = embedUrl;
    iframe.hidden = false;
    placeholder.hidden = true;
  } else {
    iframe.src = "";
    iframe.hidden = true;
    placeholder.hidden = false;
    if (url) {
      placeholder.innerHTML = `<p>No se puede reproducir este enlace dentro de la página.</p><a href="${url}" target="_blank" rel="noopener" role="button" class="outline">Abrir en YouTube</a>`;
    }
  }
}

function updateStreamEmbeds() {
  updateStreamEmbed("sorteo-link", SORTEO.link);
}

function updateStreamVisibility() {
  const visible = !!(SORTEO.link || "").trim();
  const section = document.querySelector("#transmision");
  if (section) section.hidden = !visible;
  document.querySelectorAll('a[href="#transmision"]').forEach((link) => { link.hidden = !visible; });
}

function handleDocumentClick(event) {
  const addProductButton = event.target.closest("[data-add-product]");
  const quantityButton = event.target.closest("[data-product-quantity]");
  const cartChange = event.target.closest("[data-cart-change]");
  const removeButton = event.target.closest("[data-remove]");
  const volumeButton = event.target.closest("[data-volume-quote]");
  if (volumeButton) sendVolumeQuote(volumeButton.dataset.volumeQuote);
  else if (addProductButton) {
    const id = addProductButton.dataset.addProduct;
    const product = getProduct(id);
    const variant = product ? getVariant(product, product.recommendedVariant) : null;
    const quantity = productQuantities.get(id) || 1;
    if (!product || !variant || !Number.isFinite(product.stock)) return;
    const currentUnits = getCartUnitsForProduct(id);
    const requestedUnits = quantity * variant.units;
    if (currentUnits + requestedUnits > product.stock) {
      showToast(`No hay stock suficiente. Stock disponible: ${product.stock} ${getUnitName(product, product.stock)}.`, "error");
      return;
    }
    addToCart(id, variant.id, quantity);
    addProductButton.classList.add("added");
    setTimeout(() => addProductButton.classList.remove("added"), 400);
  } else if (quantityButton) {
    const id = quantityButton.dataset.id;
    const product = getProduct(id);
    const variant = product ? getVariant(product, product.recommendedVariant) : null;
    if (!product || !variant || !Number.isFinite(product.stock)) return;
    const current = productQuantities.get(id) || 1;
    const next = quantityButton.dataset.productQuantity === "increase" ? current + 1 : current - 1;
    if (next < 1) return;
    const currentUnits = getCartUnitsForProduct(id);
    const nextUnits = next * variant.units;
    if (nextUnits + currentUnits > product.stock) {
      showToast(`No hay stock suficiente. Stock disponible: ${product.stock} ${getUnitName(product, product.stock)}.`, "error");
      return;
    }
    productQuantities.set(id, next);
    document.querySelector(`[data-product-output="${id}"]`).textContent = next;
  } else if (cartChange) {
    const item = cart.find((entry) => entry.key === cartChange.dataset.key);
    if (item) updateQuantity(item.key, item.quantity + Number(cartChange.dataset.cartChange));
  } else if (removeButton) removeFromCart(removeButton.dataset.remove);
}

function initSmoothScroll() {
  if (!window.Lenis) return;
  const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;
  const lenis = new window.Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: "vertical",
    gestureOrientation: "vertical",
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    infinite: false
  });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target, { offset: -80 });
    });
  });
}

function initializeEvents() {
  document.addEventListener("click", handleDocumentClick);
  document.querySelectorAll("[data-open-cart]").forEach((button) => button.addEventListener("click", openCart));
  document.querySelector("#close-cart").addEventListener("click", closeCart);
  document.querySelector("#drawer-overlay").addEventListener("click", closeCart);
  document.querySelector("#clear-cart").addEventListener("click", clearCart);
  document.querySelector("#go-checkout").addEventListener("click", () => { trackEvent("checkout_started"); showCartStep(2); });
  document.querySelector("#back-to-cart").addEventListener("click", () => showCartStep(1));
  document.querySelector("#share-cart").addEventListener("click", shareCart);
  document.querySelector("#repeat-order").addEventListener("click", repeatLastOrder);
  document.querySelector("#checkout-form").addEventListener("submit", sendOrderToWhatsApp);
  document.querySelectorAll('input[name="delivery"]').forEach((input) => input.addEventListener("change", updateDeliveryFields));
  document.querySelectorAll('input[name="payment"]').forEach((input) => input.addEventListener("change", updatePaymentFields));
  document.querySelector("#delivery-sector").addEventListener("change", updateSectorField);
  document.querySelector("#custom-sector").addEventListener("input", renderCart);
  document.querySelector("#copy-bank-details").addEventListener("click", copyBankDetails);
  document.querySelector("#indications-toggle").addEventListener("click", (event) => {
    const field = document.querySelector("#indications-field");
    field.hidden = !field.hidden;
    event.currentTarget.setAttribute("aria-expanded", String(!field.hidden));
    event.currentTarget.textContent = field.hidden ? "+ Agregar indicaciones" : "- Ocultar indicaciones";
    if (!field.hidden) document.querySelector("#order-notes").focus();
  });
  document.querySelector("#category-filters").addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    activeCategory = button.dataset.category;
    currentProductPage = 1;
    renderCategoryFilters();
    renderProducts();
  });
  document.querySelector("#product-search").addEventListener("input", (event) => {
    searchTerm = event.target.value;
    currentProductPage = 1;
    renderProducts();
  });
  document.querySelector("#product-pagination").addEventListener("click", (event) => {
    const button = event.target.closest("[data-product-page]");
    if (!button || button.disabled) return;
    currentProductPage = Number(button.dataset.productPage);
    renderProducts();
    document.querySelector("#productos").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  const menuToggle = document.querySelector("#menu-toggle");
  const menu = document.querySelector("#main-menu");
  const closeMenu = () => {
    menu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menú");
  };
  menuToggle.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  });
  document.querySelectorAll("#main-menu a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("click", (event) => {
    if (menu.classList.contains("open") && !event.target.closest(".nav-bar")) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (menu.classList.contains("open")) closeMenu();
    if (document.querySelector("#cart-drawer").classList.contains("open")) closeCart();
  });
}

async function initializeApp() {
  await loadEnv();
  buildBusinessConfig();
  PRODUCTS = await loadProducts();
  CATEGORIES = buildCategories();
  updateBusinessContent();
  renderSectors();
  updateDeliveryFields();
  updatePaymentFields();
  renderCategoryFilters();
  renderProducts();
  loadCustomerData();
  loadCart();
  renderLastOrder();
  trackEvent("page_view");
  updateDrawDate();
  updateStreamEmbeds();
  updateStreamVisibility();
  initializeEvents();
  initSmoothScroll();
  document.querySelector("#current-year").textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", initializeApp);
