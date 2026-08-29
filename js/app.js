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

const MINIMUM_ORDER = 5000;
const LAST_ORDER_KEY = "romayor-last-order";
const BANK_TRANSFER_CONFIG = {
  bank: "BancoEstado",
  accountType: "Cuenta Vista",
  holder: "ROMAYOR DEMO",
  rut: "00.000.000-0",
  accountNumber: "00000000",
  email: "pagos@romayor.cl"
};
const ROMERAL_SECTORS = [];
const CUSTOMER_DATA_KEY = "romayor-customer-data";
const ANALYTICS_KEY = "romayor-local-analytics";

const formatCurrency = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0
});

const createProductImage = (label, color = "#0875c1", accent = "#9ee4f5") => {
  const initials = label.split(" ").slice(0, 2).map((word) => word[0]).join("").toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="560" height="400" viewBox="0 0 560 400" role="img" aria-label="${label}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f7fcff"/><stop offset="1" stop-color="${accent}"/></linearGradient></defs><rect width="560" height="400" fill="url(#g)"/><circle cx="420" cy="80" r="55" fill="#fff" opacity=".65"/><circle cx="95" cy="325" r="72" fill="#fff" opacity=".55"/><rect x="185" y="72" width="190" height="255" rx="46" fill="${color}"/><rect x="230" y="39" width="100" height="55" rx="14" fill="#173044"/><rect x="207" y="170" width="146" height="90" rx="18" fill="#fff" opacity=".94"/><text x="280" y="225" font-family="Arial,sans-serif" font-size="42" font-weight="700" text-anchor="middle" fill="${color}">${initials}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const PRODUCT_PHOTOS = {
  bags: "https://images.unsplash.com/photo-1611567332772-a9ddb21695cd?auto=format&fit=crop&w=800&q=80",
  sponges: "https://images.pexels.com/photos/9462196/pexels-photo-9462196.jpeg?auto=compress&cs=tinysrgb&w=800",
  microfiber: "https://images.pexels.com/photos/4440535/pexels-photo-4440535.jpeg?auto=compress&cs=tinysrgb&w=800",
  yellowCloth: "https://images.pexels.com/photos/7814881/pexels-photo-7814881.jpeg?auto=compress&cs=tinysrgb&w=800",
  gloves: "https://images.pexels.com/photos/7856723/pexels-photo-7856723.jpeg?auto=compress&cs=tinysrgb&w=800",
  paper: "https://images.pexels.com/photos/3958200/pexels-photo-3958200.jpeg?auto=compress&cs=tinysrgb&w=800",
  mop: "https://images.pexels.com/photos/7513158/pexels-photo-7513158.jpeg?auto=compress&cs=tinysrgb&w=800",
  brush: "https://images.pexels.com/photos/45059/pexels-photo-45059.jpeg?auto=compress&cs=tinysrgb&w=800"
};

/* PRODUCTOS: precios, medidas y presentaciones se administran desde este único arreglo. */
const PRODUCTS = [
  {
    id: "bolsas-basura", name: "Bolsas de basura 80×110 cm", category: "limpieza",
    price: 1990, baseUnits: 10, recommendedVariant: "pack-20", image: PRODUCT_PHOTOS.bags, fallbackImage: createProductImage("Bolsas 80x110", "#287ea8", "#d8f2f8"),
    description: "Bolsas resistentes de 120 litros para hogar, local u oficina.", badge: "Más vendido", stockStatus: "available",
    variants: [{ id: "pack-10", label: "10 unidades", units: 10, price: 1990 }, { id: "pack-20", label: "20 unidades", units: 20, price: 3490 }, { id: "pack-50", label: "50 unidades", units: 50, price: 6990 }, { id: "pack-100", label: "100 unidades", units: 100, price: 11990 }]
  },
  {
    id: "esponjas", name: "Esponja lavaloza multiuso", category: "cocina",
    price: 690, recommendedVariant: "pack-10", image: PRODUCT_PHOTOS.sponges, fallbackImage: createProductImage("Esponja lavaloza", "#d6a020", "#fff4c8"),
    description: "Limpieza eficaz para loza, ollas y superficies de cocina.", badge: "", stockStatus: "available",
    variants: [{ id: "unidad", label: "1 unidad", units: 1, price: 690 }, { id: "pack-5", label: "5 unidades", units: 5, price: 2990 }, { id: "pack-10", label: "10 unidades", units: 10, price: 4990 }, { id: "pack-20", label: "20 unidades", units: 20, price: 8990 }, { id: "pack-50", label: "50 unidades", units: 50, price: 19990 }]
  },
  {
    id: "microfibra", name: "Paño de microfibra 40×40 cm", category: "limpieza",
    price: 1490, recommendedVariant: "pack-10", image: PRODUCT_PHOTOS.microfiber, fallbackImage: createProductImage("Microfibra 40x40", "#299b83", "#d8f4eb"),
    description: "Absorbente y reutilizable para cocina, muebles, vidrios y automóvil.", badge: "Recomendado", stockStatus: "available",
    variants: [{ id: "unidad", label: "1 unidad", units: 1, price: 1490 }, { id: "pack-3", label: "3 unidades", units: 3, price: 3990 }, { id: "pack-5", label: "5 unidades", units: 5, price: 5990 }, { id: "pack-10", label: "10 unidades", units: 10, price: 9990 }, { id: "pack-20", label: "20 unidades", units: 20, price: 17990 }, { id: "pack-50", label: "50 unidades", units: 50, price: 34990 }]
  },
  {
    id: "panos-amarillos", name: "Paño amarillo 38×38 cm", category: "cocina",
    price: 590, recommendedVariant: "pack-20", image: PRODUCT_PHOTOS.yellowCloth, fallbackImage: createProductImage("Paño 38x38", "#d7a821", "#fff4c7"),
    description: "Básico rendidor para cocinas, restaurantes, oficinas y empresas de aseo.", badge: "", stockStatus: "available",
    variants: [{ id: "unidad", label: "1 unidad", units: 1, price: 590 }, { id: "pack-5", label: "5 unidades", units: 5, price: 2490 }, { id: "pack-10", label: "10 unidades", units: 10, price: 4490 }, { id: "pack-20", label: "20 unidades", units: 20, price: 7990 }, { id: "pack-50", label: "50 unidades", units: 50, price: 16990 }, { id: "pack-100", label: "100 unidades", units: 100, price: 29990 }]
  },
  {
    id: "guantes-nitrilo", name: "Guantes de nitrilo texturizados", category: "proteccion",
    price: 7990, recommendedVariant: "caja", image: PRODUCT_PHOTOS.gloves, fallbackImage: createProductImage("Guantes nitrilo", "#665eb5", "#e5e2fa"),
    description: "Caja de 100 unidades para limpieza, estética, gastronomía y talleres.", badge: "100 por caja", stockStatus: "available",
    variants: [{ id: "caja", label: "1 caja · 100 unidades", units: 1, price: 7990 }, { id: "pack-2", label: "2 cajas · 200 unidades", units: 2, price: 14990 }, { id: "pack-5", label: "5 cajas · 500 unidades", units: 5, price: 34990 }, { id: "pack-10", label: "10 cajas · 1.000 unidades", units: 10, price: 64990 }]
  },
  {
    id: "papel-higienico", name: "Papel higiénico Elite Ultra", category: "hogar",
    price: 23990, baseUnits: 32, recommendedVariant: "pack-32", image: PRODUCT_PHOTOS.paper, fallbackImage: createProductImage("Elite 32 rollos", "#65a7c4", "#e4f3f8"),
    description: "Doble hoja, 32 rollos de 50 metros cada uno.", badge: "Elite · 50 m", stockStatus: "available",
    variants: [{ id: "pack-32", label: "32 rollos × 50 m", units: 32, price: 23990 }, { id: "pack-64", label: "2 packs · 64 rollos", units: 64, price: 44990 }]
  },
  {
    id: "trapero", name: "Trapero de algodón 50×70 cm", category: "hogar",
    price: 2490, recommendedVariant: "pack-3", image: PRODUCT_PHOTOS.mop, fallbackImage: createProductImage("Trapero 50x70", "#3489ad", "#d9eff7"),
    description: "Trapero de algodón con ojal, absorbente y práctico para pisos.", badge: "", stockStatus: "available",
    variants: [{ id: "unidad", label: "1 unidad", units: 1, price: 2490 }, { id: "pack-2", label: "2 unidades", units: 2, price: 4490 }, { id: "pack-3", label: "3 unidades", units: 3, price: 6490 }, { id: "pack-5", label: "5 unidades", units: 5, price: 9990 }, { id: "pack-10", label: "10 unidades", units: 10, price: 18990 }]
  },
  {
    id: "cepillo", name: "Cepillo multiuso para limpieza", category: "automovil",
    price: 1990, recommendedVariant: "pack-3", image: PRODUCT_PHOTOS.brush, fallbackImage: createProductImage("Cepillo limpieza", "#37799a", "#d5edf7"),
    description: "Escobilla práctica para hogar, taller y limpieza del automóvil.", badge: "Multiuso", stockStatus: "available",
    variants: [{ id: "unidad", label: "1 unidad", units: 1, price: 1990 }, { id: "pack-3", label: "3 unidades", units: 3, price: 4990 }, { id: "pack-5", label: "5 unidades", units: 5, price: 7490 }]
  }
];

/* PACKS ESPECIALES: cada elemento se muestra con cantidad y medida claras. */
const PACKS = [
  { id: "pack-hogar", name: "Pack Hogar", kicker: "Para la limpieza semanal", category: "packs", price: 19990, originalPrice: 23440, savings: 3450, badge: "Más vendido", stockStatus: "available", description: "Una selección equilibrada con los básicos que más se usan en casa.", items: [{ quantity: "20", name: "bolsas de basura 80×110 cm" }, { quantity: "10", name: "esponjas lavaloza" }, { quantity: "10", name: "paños amarillos 38×38 cm" }, { quantity: "5", name: "paños de microfibra 40×40 cm" }, { quantity: "1", name: "trapero 50×70 cm" }, { quantity: "1", name: "cepillo multiuso" }] },
  { id: "pack-limpieza", name: "Pack Limpieza", kicker: "Para abastecer todo el mes", category: "packs", price: 34990, originalPrice: 42430, savings: 7440, badge: "Mejor precio", stockStatus: "available", description: "Más unidades de cada básico para limpiar con tranquilidad y reponer menos.", items: [{ quantity: "50", name: "bolsas de basura 80×110 cm" }, { quantity: "20", name: "esponjas lavaloza" }, { quantity: "20", name: "paños amarillos 38×38 cm" }, { quantity: "10", name: "paños de microfibra 40×40 cm" }, { quantity: "2", name: "traperos 50×70 cm" }, { quantity: "2", name: "cepillos multiuso" }] },
  { id: "pack-negocio", name: "Pack Negocio", kicker: "Para locales y oficinas", category: "packs", price: 59990, originalPrice: 91940, savings: 31950, badge: "Ahorro mayorista", stockStatus: "available", description: "Stock de alto uso para restaurantes, barberías, talleres y empresas de aseo.", items: [{ quantity: "100", name: "bolsas de basura 80×110 cm" }, { quantity: "50", name: "esponjas lavaloza" }, { quantity: "50", name: "paños amarillos 38×38 cm" }, { quantity: "20", name: "paños de microfibra 40×40 cm" }, { quantity: "2", name: "cajas de guantes de nitrilo (100 u c/u)" }, { quantity: "5", name: "traperos 50×70 cm" }] },
  { id: "pack-emprendedor", name: "Pack Emprendedor", kicker: "Máximo volumen", category: "packs", price: 89990, originalPrice: 145410, savings: 55420, badge: "Máximo ahorro", stockStatus: "available", description: "La alternativa más completa para operación frecuente o reventa.", items: [{ quantity: "150", name: "bolsas de basura 80×110 cm" }, { quantity: "50", name: "esponjas lavaloza" }, { quantity: "50", name: "paños amarillos 38×38 cm" }, { quantity: "30", name: "paños de microfibra 40×40 cm" }, { quantity: "5", name: "cajas de guantes de nitrilo (100 u c/u)" }, { quantity: "10", name: "traperos 50×70 cm" }, { quantity: "5", name: "cepillos multiuso" }] }
].map((pack, index) => ({ ...pack, image: createProductImage(pack.name, ["#299b83", "#287ea8", "#426f8c", "#3d647b"][index], "#d9f2ed") }));

/* PROMOCIONES: no se acumulan; siempre gana la de mayor beneficio monetario. */
const PROMOTIONS = {
  packHogarGift: { id: "gift", name: "Paño amarillo gratis por Pack Hogar", value: 590 },
  twoPacks: { id: "packs-5", name: "5% de descuento por 2 packs", minimum: 2, rate: 0.05 },
  threePacks: { id: "packs-10", name: "10% de descuento por 3 packs", minimum: 3, rate: 0.10 }
};

const VOLUME_PRODUCT_IDS = ["bolsas-basura", "microfibra", "panos-amarillos", "guantes-nitrilo", "trapero"];

const CATEGORIES = [
  { id: "all", label: "Todos" }, { id: "limpieza", label: "Limpieza" }, { id: "cocina", label: "Cocina" },
  { id: "proteccion", label: "Protección" }, { id: "automovil", label: "Automóvil" }, { id: "hogar", label: "Hogar" }, { id: "packs", label: "Packs" }
];

let cart = [];
let activeCategory = "all";
let searchTerm = "";
const productQuantities = new Map();

const getProduct = (id) => PRODUCTS.find((product) => product.id === id);
const getPack = (id) => PACKS.find((pack) => pack.id === id);
const getCartKey = (id, variantId = "default") => `${id}:${variantId}`;
const normalizeText = (text) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function getVariant(product, variantId) {
  return product?.variants.find((variant) => variant.id === variantId) || product?.variants[0];
}

function getItemDetails(item) {
  if (item.type === "pack") {
    const pack = getPack(item.productId);
    return pack ? { ...pack, variantLabel: "Pack especial", unitPrice: pack.price, baseValue: pack.originalPrice || pack.price } : null;
  }
  const product = getProduct(item.productId);
  const variant = getVariant(product, item.variantId);
  return product && variant ? { ...product, variantLabel: variant.label, unitPrice: variant.price, baseValue: (product.price / (product.baseUnits || 1)) * variant.units } : null;
}

function renderCategoryFilters() {
  const container = document.querySelector("#category-filters");
  container.innerHTML = CATEGORIES.map((category) => `<button type="button" class="filter-button ${activeCategory === category.id ? "active" : ""}" data-category="${category.id}" aria-pressed="${activeCategory === category.id}">${category.label}</button>`).join("");
}

function productCardTemplate(product) {
  const selectedVariant = getVariant(product, product.recommendedVariant);
  const outOfStock = product.stockStatus === "out";
  const lowStock = product.stockStatus === "low";
  const options = product.variants.map((variant) => `<option value="${variant.id}" ${variant.id === selectedVariant.id ? "selected" : ""}>${variant.label} — ${formatCurrency.format(variant.price)}${variant.id === product.recommendedVariant ? " · Recomendado" : ""}</option>`).join("");
  return `<article class="product-card" data-product-card="${product.id}">
    <div class="product-image"><img src="${product.image}" data-fallback="${product.fallbackImage}" alt="Imagen referencial de ${product.name}" loading="lazy" width="560" height="400">${product.badge ? `<span class="badge">${product.badge}</span>` : ""}${lowStock ? '<span class="badge stock-badge">Últimas unidades</span>' : ""}<small class="reference-photo">Imagen referencial</small></div>
    <div class="product-body"><span class="product-category">${CATEGORIES.find((item) => item.id === product.category)?.label || product.category}</span><h3>${product.name}</h3><p class="product-description">${product.description}</p>
      <label class="variant-label" for="variant-${product.id}">Elige una presentación</label><select class="variant-select" id="variant-${product.id}" data-variant="${product.id}" ${outOfStock ? "disabled" : ""}>${options}</select>
      <div class="price-row"><div><strong class="price-main" data-price="${product.id}">${formatCurrency.format(selectedVariant.price)}</strong><small class="per-unit" data-unit-price="${product.id}">${getUnitPriceText(product, selectedVariant)}</small></div><span class="unit-saving" data-saving="${product.id}">${getVariantSavingsText(product, selectedVariant)}</span></div>
      <span class="selected-total" data-selected-total="${product.id}">Esta selección incluye ${selectedVariant.units} ${getUnitName(product, selectedVariant.units)}</span>
      <div class="product-controls"><div><span class="control-label">Cantidad</span><div class="quantity-control" aria-label="Cantidad de presentaciones"><button type="button" data-product-quantity="decrease" data-id="${product.id}" aria-label="Disminuir cantidad">−</button><output data-product-output="${product.id}">1</output><button type="button" data-product-quantity="increase" data-id="${product.id}" aria-label="Aumentar cantidad">+</button></div></div><button class="add-button" type="button" data-add-product="${product.id}" ${outOfStock ? "disabled" : ""}>${outOfStock ? "Agotado" : "Agregar"}</button></div>
      ${VOLUME_PRODUCT_IDS.includes(product.id) ? `<button class="volume-quote" type="button" data-volume-quote="${product.id}">¿Necesitas más? Cotizar volumen</button>` : ""}
    </div></article>`;
}

function getVariantSavingsText(product, variant) {
  const savings = Math.max(0, (product.price / (product.baseUnits || 1)) * variant.units - variant.price);
  return savings ? `Ahorras ${formatCurrency.format(savings)}` : "Precio normal";
}

function getUnitName(product, quantity) {
  if (product.id === "guantes-nitrilo") return quantity === 1 ? "caja" : "cajas";
  if (product.id === "papel-higienico") return quantity === 1 ? "rollo" : "rollos";
  return quantity === 1 ? "unidad" : "unidades";
}

function getUnitPriceText(product, variant) {
  const unitPrice = Math.round(variant.price / variant.units);
  const unit = product.id === "guantes-nitrilo" ? "por caja" : product.id === "papel-higienico" ? "por rollo" : "cada unidad";
  return `${formatCurrency.format(unitPrice)} ${unit}`;
}

function updateSelectedTotal(productId) {
  const product = getProduct(productId);
  const select = document.querySelector(`[data-variant="${productId}"]`);
  const target = document.querySelector(`[data-selected-total="${productId}"]`);
  if (!product || !select || !target) return;
  const variant = getVariant(product, select.value);
  const totalUnits = variant.units * (productQuantities.get(productId) || 1);
  target.textContent = `Total seleccionado: ${totalUnits} ${getUnitName(product, totalUnits)}`;
}

function renderProducts() {
  const grid = document.querySelector("#product-grid");
  let items = activeCategory === "packs" ? [] : PRODUCTS;
  items = items.filter((product) => (activeCategory === "all" || product.category === activeCategory) && normalizeText(`${product.name} ${product.description}`).includes(normalizeText(searchTerm)));
  grid.innerHTML = items.length ? items.map(productCardTemplate).join("") : `<div class="empty-products"><strong>No encontramos productos</strong><p>Prueba con otra búsqueda o categoría.</p></div>`;
  document.querySelector("#results-status").textContent = activeCategory === "packs" ? "Los packs especiales están justo debajo." : `${items.length} producto${items.length === 1 ? "" : "s"} disponible${items.length === 1 ? "" : "s"}.`;
  attachImageFallbacks(grid);
  productQuantities.clear();
}

function attachImageFallbacks(scope = document) {
  scope.querySelectorAll("img[data-fallback]").forEach((image) => image.addEventListener("error", () => {
    if (image.src !== image.dataset.fallback) image.src = image.dataset.fallback;
  }, { once: true }));
}

function renderPacks() {
  document.querySelector("#pack-grid").innerHTML = PACKS.map((pack, index) => `<article class="pack-card ${index < 2 ? "highlight" : ""}">
    <div class="pack-card-head"><div class="pack-icon" aria-hidden="true">${["⌂", "✦", "▦", "↑"][index]}</div><div><span class="pack-kicker">${pack.kicker}</span><h3>${pack.name}</h3></div><span class="pack-ribbon">${pack.badge}</span></div>
    <p class="pack-audience">${pack.description}</p><div class="pack-includes"><span>Este pack incluye</span><strong>${pack.items.length} tipos de productos</strong></div>
    <ul class="pack-items">${pack.items.map((item) => `<li><strong>${item.quantity}</strong><span>${item.name}</span></li>`).join("")}</ul>
    <div class="pack-price-block"><div><span class="pack-original">Valor comprando por separado <del>${formatCurrency.format(pack.originalPrice)}</del></span><strong class="pack-price">${formatCurrency.format(pack.price)}</strong></div><span class="pack-save">Ahorras<br><strong>${formatCurrency.format(pack.savings)}</strong></span></div>
    <button type="button" data-add-pack="${pack.id}" ${pack.stockStatus === "out" ? "disabled" : ""}>${pack.stockStatus === "out" ? "Agotado" : `Agregar ${pack.name}`}</button></article>`).join("");
}

function addToCart(productId, variantId = "default", quantity = 1, type = "product") {
  const source = type === "pack" ? getPack(productId) : getProduct(productId);
  if (!source || source.stockStatus === "out") return;
  const safeQuantity = Math.max(1, Math.min(99, Number(quantity) || 1));
  const key = getCartKey(productId, variantId);
  const existing = cart.find((item) => item.key === key);
  if (existing) existing.quantity = Math.min(99, existing.quantity + safeQuantity);
  else cart.push({ key, productId, variantId, quantity: safeQuantity, type });
  saveCart();
  renderCart();
  trackEvent(type === "pack" ? "pack_added" : "product_added", productId);
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

function getPackStats() {
  return cart.reduce((stats, item) => {
    if (item.type !== "pack") return stats;
    const details = getItemDetails(item);
    stats.count += item.quantity;
    stats.total += details ? details.unitPrice * item.quantity : 0;
    if (item.productId === "pack-hogar") stats.homeCount += item.quantity;
    return stats;
  }, { count: 0, total: 0, homeCount: 0 });
}

function applyBestPromotion() {
  const stats = getPackStats();
  const candidates = [{ id: "none", name: "", discount: 0, gift: "" }];
  if (stats.homeCount > 0) candidates.push({ id: PROMOTIONS.packHogarGift.id, name: PROMOTIONS.packHogarGift.name, discount: 0, benefit: PROMOTIONS.packHogarGift.value, gift: "1 paño amarillo GRATIS" });
  if (stats.count >= PROMOTIONS.twoPacks.minimum) candidates.push({ id: PROMOTIONS.twoPacks.id, name: PROMOTIONS.twoPacks.name, discount: Math.round(stats.total * PROMOTIONS.twoPacks.rate), benefit: Math.round(stats.total * PROMOTIONS.twoPacks.rate), gift: "" });
  if (stats.count >= PROMOTIONS.threePacks.minimum) candidates.push({ id: PROMOTIONS.threePacks.id, name: PROMOTIONS.threePacks.name, discount: Math.round(stats.total * PROMOTIONS.threePacks.rate), benefit: Math.round(stats.total * PROMOTIONS.threePacks.rate), gift: "" });
  return candidates.sort((a, b) => (b.benefit || b.discount) - (a.benefit || a.discount))[0];
}

function calculateDiscount() {
  return applyBestPromotion().discount || 0;
}

function calculateTotal() {
  return Math.max(0, calculateSubtotal() - calculateDiscount());
}

function calculateSavings() {
  const intrinsic = cart.reduce((total, item) => {
    const details = getItemDetails(item);
    return total + (details ? Math.max(0, details.baseValue - details.unitPrice) * item.quantity : 0);
  }, 0);
  return intrinsic + calculateDiscount();
}

function renderCart() {
  cart = cart.filter((item) => getItemDetails(item));
  const container = document.querySelector("#cart-items");
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const total = calculateTotal();
  document.querySelectorAll("[data-cart-count]").forEach((badge) => badge.textContent = totalItems);
  document.querySelectorAll("[data-open-cart]").forEach((button) => button.setAttribute("aria-label", `Abrir carrito, ${totalItems} producto${totalItems === 1 ? "" : "s"}`));
  document.querySelectorAll("[data-cart-summary]").forEach((summary) => summary.textContent = cart.length ? `${totalItems} artículo${totalItems === 1 ? "" : "s"} · ${formatCurrency.format(total)}` : "Tu carrito está vacío");
  if (!cart.length) container.innerHTML = `<div class="empty-cart"><div><span aria-hidden="true">🛒</span><h3>Tu carrito está vacío</h3><p>Agrega productos o packs para comenzar.</p></div></div>`;
  else container.innerHTML = cart.map((item) => {
    const details = getItemDetails(item);
    const fallback = details.fallbackImage || details.image;
    return `<article class="cart-item"><img class="cart-item-image" src="${details.image}" data-fallback="${fallback}" alt="" width="58" height="58"><div><h3>${details.name}</h3><span class="cart-item-variant">${details.variantLabel} · ${item.quantity} presentación${item.quantity === 1 ? "" : "es"}</span><strong class="cart-item-price">${formatCurrency.format(details.unitPrice * item.quantity)}</strong><div class="cart-item-actions"><button type="button" data-cart-change="-1" data-key="${item.key}" aria-label="Disminuir ${details.name}">−</button><output aria-label="Cantidad de packs">${item.quantity}</output><button type="button" data-cart-change="1" data-key="${item.key}" aria-label="Aumentar ${details.name}">+</button></div></div><button type="button" class="remove-item" data-remove="${item.key}" aria-label="Eliminar ${details.name}">Eliminar</button></article>`;
  }).join("");
  attachImageFallbacks(container);
  const promotion = applyBestPromotion();
  const promoBox = document.querySelector("#active-promo");
  promoBox.hidden = !promotion.name;
  promoBox.textContent = promotion.name ? `✓ Promoción aplicada: ${promotion.name}` : "";
  document.querySelector("#cart-subtotal").textContent = formatCurrency.format(calculateSubtotal());
  document.querySelector("#cart-discount").textContent = `-${formatCurrency.format(calculateDiscount())}`;
  document.querySelector("#cart-savings").textContent = formatCurrency.format(calculateSavings());
  document.querySelector("#cart-total").textContent = formatCurrency.format(total);
  document.querySelector("#checkout-total").textContent = formatCurrency.format(total);
  const remaining = Math.max(0, MINIMUM_ORDER - total);
  const minimumBox = document.querySelector("#minimum-order");
  minimumBox.className = `minimum-order ${remaining ? "pending" : "reached"}`;
  minimumBox.textContent = cart.length ? (remaining ? `Agrega ${formatCurrency.format(remaining)} para alcanzar el mínimo de compra.` : "✓ Mínimo de compra alcanzado.") : `Compra mínima: ${formatCurrency.format(MINIMUM_ORDER)}.`;
  const continueButton = document.querySelector("#go-checkout");
  continueButton.disabled = !cart.length || remaining > 0;
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
  const errors = [];
  if (!cart.length) errors.push("Agrega al menos un producto al carrito.");
  if (calculateTotal() < MINIMUM_ORDER) errors.push(`La compra mínima es de ${formatCurrency.format(MINIMUM_ORDER)}.`);
  if (name.length < 3) errors.push("Ingresa tu nombre completo.");
  if (phoneDigits.length < 9) errors.push("Ingresa un número de WhatsApp válido.");
  if (email && !emailInput.validity.valid) errors.push("Revisa el formato del correo electrónico.");
  if (delivery === "delivery" && sector.length < 2) errors.push("Selecciona o escribe un sector de Romeral.");
  if (delivery === "delivery" && address.length < 4) errors.push("Ingresa una dirección dentro de Romeral.");
  document.querySelector("#form-errors").innerHTML = errors.map((error) => `<div>• ${error}</div>`).join("");
  if (errors.length) showToast("Revisa los datos marcados para continuar.", "error");
  return { valid: errors.length === 0, data: { name, phone, email, delivery, sector, address, payment, notes } };
}

function generateWhatsAppMessage(customer = {}) {
  const promotion = applyBestPromotion();
  const lines = cart.map((item) => {
    const details = getItemDetails(item);
    return `- ${details.name} - ${details.variantLabel} x${item.quantity}\n  ${formatCurrency.format(details.unitPrice * item.quantity)}`;
  }).join("\n\n");
  const promotionLine = promotion.name ? `\nPromocion aplicada: ${promotion.name}${promotion.gift ? ` (${promotion.gift})` : ""}\n` : "";
  const emailLine = customer.email ? `\nCorreo:\n${customer.email}\n` : "";
  const deliveryText = customer.delivery === "delivery" ? `Delivery dentro de Romeral\nSector: ${customer.sector}\nDireccion: ${customer.address}` : "Retiro por coordinar";
  const paymentText = customer.payment === "cash-delivery" ? "Efectivo al recibir" : "Transferencia antes de confirmar el pedido";
  const notesLine = customer.notes ? `\nINDICACIONES\n${customer.notes}\n` : "";
  return `Hola, quiero realizar el siguiente pedido:\n\nCLIENTE\nNombre: ${customer.name}\nWhatsApp: ${customer.phone}\n${emailLine}\nENTREGA\n${deliveryText}\n\nPAGO\n${paymentText}\n${notesLine}\nPEDIDO\n\n${lines}\n\n--------------------\n\nSubtotal: ${formatCurrency.format(calculateSubtotal())}\nDescuento: ${formatCurrency.format(calculateDiscount())}\nTotal productos: ${formatCurrency.format(calculateTotal())}\n${promotionLine}\nAhorro obtenido: ${formatCurrency.format(calculateSavings())}\n\nEntiendo que el costo de delivery no esta incluido y que el stock, la entrega y la confirmacion final se coordinan por WhatsApp.`;
}

function sendOrderToWhatsApp(event) {
  event?.preventDefault();
  const validation = validateCheckout();
  if (!validation.valid) return;
  const message = generateWhatsAppMessage(validation.data);
  const url = `https://wa.me/${BUSINESS_CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;
  saveLastOrder();
  saveCustomerData(validation.data);
  trackEvent("whatsapp_order_opened");
  showToast("Tu pedido está listo. Se abrirá WhatsApp para enviarlo.", "success");
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
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.querySelector("#toast-region").append(toast);
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
  select.innerHTML = `${ROMERAL_SECTORS.length ? '<option value="">Selecciona un sector</option>' : ""}${ROMERAL_SECTORS.map((sector) => `<option value="${sector}">${sector}</option>`).join("")}<option value="other">${ROMERAL_SECTORS.length ? "Otro sector" : "Escribir sector manualmente"}</option>`;
  select.value = "other";
  updateSectorField();
}

function updateSectorField() {
  const manual = document.querySelector("#delivery-sector").value === "other";
  document.querySelector("#custom-sector-label").hidden = !manual;
  document.querySelector("#custom-sector").required = manual;
}

function updateDeliveryFields() {
  const delivery = document.querySelector('input[name="delivery"]:checked').value;
  const show = delivery === "delivery";
  document.querySelector("#delivery-fields").hidden = !show;
  document.querySelector("#delivery-address").required = show;
  document.querySelector("#delivery-sector").required = show;
  document.querySelector("#custom-sector").required = show && document.querySelector("#delivery-sector").value === "other";
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
    if (data.sector && ROMERAL_SECTORS.includes(data.sector)) document.querySelector("#delivery-sector").value = data.sector;
    else if (data.sector) document.querySelector("#custom-sector").value = data.sector;
    document.querySelector("#remember-customer").checked = true;
    updateSectorField(); updateDeliveryFields(); updatePaymentFields();
  } catch (error) { localStorage.removeItem(CUSTOMER_DATA_KEY); }
}

function renderCustomPackBuilder() {
  document.querySelector("#custom-pack-items").innerHTML = PRODUCTS.map((product) => `<label><span>${product.name}</span><input type="number" min="0" max="999" step="1" value="0" data-custom-product="${product.id}" aria-label="Cantidad de ${product.name}"></label>`).join("");
}

function getCustomPackSelection() {
  return [...document.querySelectorAll("[data-custom-product]")].map((input) => ({ product: getProduct(input.dataset.customProduct), quantity: Math.max(0, Number(input.value) || 0) })).filter((item) => item.quantity > 0);
}

function updateCustomPackCount() {
  const total = getCustomPackSelection().reduce((sum, item) => sum + item.quantity, 0);
  document.querySelector("#custom-pack-count").textContent = `${total} unidad${total === 1 ? "" : "es"} seleccionada${total === 1 ? "" : "s"}`;
}

function sendCustomPackQuote(event) {
  event.preventDefault();
  const selection = getCustomPackSelection();
  if (!selection.length) return showToast("Selecciona al menos un producto para cotizar.", "error");
  const lines = selection.map((item) => `- ${item.product.name}: ${item.quantity} unidades`).join("\n");
  trackEvent("custom_pack_quote");
  window.open(`https://wa.me/${BUSINESS_CONFIG.whatsapp}?text=${encodeURIComponent(`Hola, quiero cotizar un pack personalizado:\n\n${lines}\n\nEntrega dentro de Romeral. Quedo atento al precio y disponibilidad.`)}`, "_blank", "noopener,noreferrer");
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
  document.title = `Productos de Aseo a Buen Precio | ${BUSINESS_CONFIG.name}`;
  document.querySelector("#business-whatsapp").href = `https://wa.me/${BUSINESS_CONFIG.whatsapp}?text=${encodeURIComponent("Hola, tengo un negocio y me gustaría consultar por precios para compras por volumen.")}`;
}

async function copyBankDetails() {
  const text = `Banco: ${BANK_TRANSFER_CONFIG.bank}\nTipo de cuenta: ${BANK_TRANSFER_CONFIG.accountType}\nTitular: ${BANK_TRANSFER_CONFIG.holder}\nRUT: ${BANK_TRANSFER_CONFIG.rut}\nN.º de cuenta: ${BANK_TRANSFER_CONFIG.accountNumber}\nCorreo: ${BANK_TRANSFER_CONFIG.email}`;
  try {
    await navigator.clipboard.writeText(text);
    showToast("Datos de transferencia copiados.", "success");
  } catch (error) { showToast("No fue posible copiar los datos.", "error"); }
}

function updateDrawDate() {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const days = Math.max(0, Math.ceil((lastDay.setHours(23, 59, 59, 999) - now) / 86400000));
  document.querySelector("#draw-date").textContent = lastDay.toLocaleDateString("es-CL", { day: "numeric", month: "long" });
  document.querySelector("#draw-countdown").textContent = `${days} día${days === 1 ? "" : "s"} restante${days === 1 ? "" : "s"}`;
}

function handleDocumentClick(event) {
  const addProductButton = event.target.closest("[data-add-product]");
  const addPackButton = event.target.closest("[data-add-pack]");
  const quantityButton = event.target.closest("[data-product-quantity]");
  const cartChange = event.target.closest("[data-cart-change]");
  const removeButton = event.target.closest("[data-remove]");
  const volumeButton = event.target.closest("[data-volume-quote]");
  if (volumeButton) sendVolumeQuote(volumeButton.dataset.volumeQuote);
  else if (addProductButton) {
    const id = addProductButton.dataset.addProduct;
    const variantId = document.querySelector(`[data-variant="${id}"]`).value;
    const quantity = productQuantities.get(id) || 1;
    addToCart(id, variantId, quantity);
    addProductButton.classList.add("added");
    setTimeout(() => addProductButton.classList.remove("added"), 400);
  } else if (addPackButton) addToCart(addPackButton.dataset.addPack, "default", 1, "pack");
  else if (quantityButton) {
    const id = quantityButton.dataset.id;
    const current = productQuantities.get(id) || 1;
    const next = quantityButton.dataset.productQuantity === "increase" ? Math.min(99, current + 1) : Math.max(1, current - 1);
    productQuantities.set(id, next);
    document.querySelector(`[data-product-output="${id}"]`).textContent = next;
    updateSelectedTotal(id);
  } else if (cartChange) {
    const item = cart.find((entry) => entry.key === cartChange.dataset.key);
    if (item) updateQuantity(item.key, item.quantity + Number(cartChange.dataset.cartChange));
  } else if (removeButton) removeFromCart(removeButton.dataset.remove);
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
  document.querySelector("#copy-bank-details").addEventListener("click", copyBankDetails);
  document.querySelector("#indications-toggle").addEventListener("click", (event) => {
    const field = document.querySelector("#indications-field");
    field.hidden = !field.hidden;
    event.currentTarget.setAttribute("aria-expanded", String(!field.hidden));
    event.currentTarget.textContent = field.hidden ? "+ Agregar indicaciones" : "- Ocultar indicaciones";
    if (!field.hidden) document.querySelector("#order-notes").focus();
  });
  document.querySelector("#custom-pack-form").addEventListener("submit", sendCustomPackQuote);
  document.querySelector("#custom-pack-items").addEventListener("input", updateCustomPackCount);
  document.querySelector("#category-filters").addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    activeCategory = button.dataset.category;
    renderCategoryFilters();
    if (activeCategory === "packs") document.querySelector("#packs").scrollIntoView({ behavior: "smooth" });
    else renderProducts();
  });
  document.querySelector("#product-search").addEventListener("input", (event) => { searchTerm = event.target.value; renderProducts(); });
  document.querySelector("#product-grid").addEventListener("change", (event) => {
    const select = event.target.closest("[data-variant]");
    if (!select) return;
    const product = getProduct(select.dataset.variant);
    const variant = getVariant(product, select.value);
    document.querySelector(`[data-price="${product.id}"]`).textContent = formatCurrency.format(variant.price);
    document.querySelector(`[data-unit-price="${product.id}"]`).textContent = getUnitPriceText(product, variant);
    document.querySelector(`[data-saving="${product.id}"]`).textContent = getVariantSavingsText(product, variant);
    updateSelectedTotal(product.id);
  });
  const menuToggle = document.querySelector("#menu-toggle");
  menuToggle.addEventListener("click", () => {
    const menu = document.querySelector("#main-menu");
    const open = menu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  });
  document.querySelectorAll("#main-menu a").forEach((link) => link.addEventListener("click", () => {
    document.querySelector("#main-menu").classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }));
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && document.querySelector("#cart-drawer").classList.contains("open")) closeCart(); });
}

function initializeApp() {
  updateBusinessContent();
  renderSectors();
  updateDeliveryFields();
  updatePaymentFields();
  renderCategoryFilters();
  renderProducts();
  renderPacks();
  renderCustomPackBuilder();
  loadCustomerData();
  loadCart();
  renderLastOrder();
  trackEvent("page_view");
  updateDrawDate();
  initializeEvents();
  document.querySelector("#current-year").textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", initializeApp);
