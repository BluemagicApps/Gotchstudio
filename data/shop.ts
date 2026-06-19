/**
 * Shop catalog. A small set of curated hero pieces, plus a procedurally
 * generated catalog (deterministic, so SSG is stable) that gives the shop real
 * depth across many categories. Prices are illustrative; imagery is drawn from a
 * verified, curated pool and is intentionally placeholder — wire to a real
 * commerce backend (Shopify/Stripe) and swap in product photography before
 * launch.
 */

export interface ShopItem {
  slug: string;
  name: string;
  category: string;
  maker: string;
  price: number;
  currency: string;
  image: string;
  description: string;
}

const U = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1000&q=80`;

export const shopCategories = [
  "Seating",
  "Lighting",
  "Tables",
  "Rugs",
  "Storage",
  "Textiles",
  "Mirrors",
  "Wall Art",
  "Decor",
  "Outdoor",
  "Dining",
] as const;

/** Curated hero pieces (hand-authored). */
const curatedItems: ShopItem[] = [
  {
    slug: "halden-lounge-chair",
    name: "Halden Lounge Chair",
    category: "Seating",
    maker: "Gotch Studio Custom",
    price: 4200,
    currency: "USD",
    image: U("photo-1567538096630-e0c55bd6374c"),
    description:
      "A sculptural lounge chair in hand-finished oak and natural bouclé, built to last generations.",
  },
  {
    slug: "lumen-table-lamp",
    name: "Lumen Table Lamp",
    category: "Lighting",
    maker: "Atelier Noir",
    price: 980,
    currency: "USD",
    image: U("photo-1507473885765-e6ed057f782c"),
    description:
      "Hand-thrown ceramic base with an unlacquered brass stem and linen shade.",
  },
  {
    slug: "monolith-coffee-table",
    name: "Monolith Coffee Table",
    category: "Tables",
    maker: "Widell + Boschetti",
    price: 5600,
    currency: "USD",
    image: U("photo-1532372320572-cda25653a26d"),
    description: "A single slab of honed travertine on a minimal blackened-steel base.",
  },
  {
    slug: "highland-wool-throw",
    name: "Highland Wool Throw",
    category: "Textiles",
    maker: "Gotch Studio Custom",
    price: 320,
    currency: "USD",
    image: U("photo-1600369671236-e74521d4b6ad"),
    description:
      "Heavyweight undyed wool, woven by a family mill in the Scottish borders.",
  },
  {
    slug: "vessel-no-3",
    name: "Vessel No. 3",
    category: "Decor",
    maker: "Studio Ceramics",
    price: 460,
    currency: "USD",
    image: U("photo-1578500494198-246f612d3b3d"),
    description: "A generous stoneware vessel with a matte, mineral glaze in warm bone.",
  },
  {
    slug: "arc-floor-lamp",
    name: "Arc Floor Lamp",
    category: "Lighting",
    maker: "Atelier Noir",
    price: 1740,
    currency: "USD",
    image: U("photo-1540932239986-30128078f3c5"),
    description:
      "A quietly dramatic arc in patinated brass with a hand-stitched leather switch.",
  },
];

// ── Procedural catalog ──────────────────────────────────────────────────────

const PHOTO_POOL = [
  "photo-1567538096630-e0c55bd6374c",
  "photo-1507473885765-e6ed057f782c",
  "photo-1532372320572-cda25653a26d",
  "photo-1600369671236-e74521d4b6ad",
  "photo-1578500494198-246f612d3b3d",
  "photo-1540932239986-30128078f3c5",
  "photo-1493663284031-b7e3aefcae8e",
  "photo-1567016432779-094069958ea5",
  "photo-1505693416388-ac5ce068fe85",
  "photo-1586023492125-27b2c045efd7",
  "photo-1556909212-d5b604d0c90d",
  "photo-1493809842364-78817add7ffb",
  "photo-1600210492486-724fe5c67fb0",
  "photo-1600121848594-d8644e57abab",
  "photo-1618219908412-a29a1bb7b86e",
  "photo-1600585154340-be6161a56a0c",
  "photo-1524758631624-e2822e304c36",
  "photo-1497215728101-856f4ea42174",
  "photo-1560448204-e02f11c3d0e2",
  "photo-1505691938895-1758d7feb511",
  "photo-1556228453-efd6c1ff04f6",
  "photo-1583847268964-b28dc8f51f92",
];

const MAKERS = [
  "Gotch Studio Custom",
  "Atelier Noir",
  "Widell + Boschetti",
  "Studio Ceramics",
  "Maison Lutz",
  "Borghese Atelier",
  "Nord & Co.",
  "Hewn Workshop",
];

const MATERIALS = [
  "Oak", "Walnut", "Travertine", "Brass", "Linen", "Bouclé", "Marble", "Rattan",
  "Ceramic", "Bronze", "Alabaster", "Cane", "Limestone", "Velvet", "Ash", "Teak",
];

const SERIES = [
  "Atelier", "Heritage", "Reserve", "Signature", "Maison", "Studio", "Edition", "Collection",
];

interface CatSpec {
  forms: string[];
  min: number;
  max: number;
  desc: (material: string, form: string) => string;
}

const CATEGORY_SPEC: Record<string, CatSpec> = {
  Seating: {
    forms: ["Lounge Chair", "Sofa", "Armchair", "Stool", "Bench", "Accent Chair", "Daybed"],
    min: 900, max: 9800,
    desc: (m, f) => `A sculptural ${f.toLowerCase()} in hand-finished ${m.toLowerCase()}, tailored for comfort and built to last generations.`,
  },
  Lighting: {
    forms: ["Table Lamp", "Floor Lamp", "Pendant", "Sconce", "Chandelier", "Lantern"],
    min: 380, max: 6400,
    desc: (m, f) => `A ${f.toLowerCase()} in ${m.toLowerCase()} with a warm, dimmable glow and considered proportions.`,
  },
  Tables: {
    forms: ["Coffee Table", "Side Table", "Dining Table", "Console", "Desk", "Nesting Tables"],
    min: 700, max: 8800,
    desc: (m, f) => `A ${f.toLowerCase()} in honed ${m.toLowerCase()} on a quietly minimal base.`,
  },
  Rugs: {
    forms: ["Hand-Knotted Rug", "Flatweave Rug", "Wool Runner", "Tufted Rug"],
    min: 600, max: 7200,
    desc: (m, f) => `A ${f.toLowerCase()} in natural fibers and undyed tones, made to ground a room.`,
  },
  Storage: {
    forms: ["Cabinet", "Sideboard", "Bookshelf", "Credenza", "Dresser", "Display Case"],
    min: 1200, max: 9400,
    desc: (m, f) => `A ${f.toLowerCase()} in solid ${m.toLowerCase()} with hand-fitted joinery and soft-close detailing.`,
  },
  Textiles: {
    forms: ["Throw", "Cushion", "Bedding Set", "Drapery Panel", "Wool Blanket"],
    min: 120, max: 1400,
    desc: (m, f) => `A ${f.toLowerCase()} woven from natural ${m.toLowerCase()}, soft to the touch and beautifully durable.`,
  },
  Mirrors: {
    forms: ["Wall Mirror", "Floor Mirror", "Vanity Mirror", "Arched Mirror"],
    min: 420, max: 3800,
    desc: (m, f) => `A ${f.toLowerCase()} framed in ${m.toLowerCase()}, with antiqued glass for a soft reflection.`,
  },
  "Wall Art": {
    forms: ["Framed Print", "Canvas", "Wall Sculpture", "Triptych", "Study"],
    min: 280, max: 5200,
    desc: (m, f) => `An original ${f.toLowerCase()} with ${m.toLowerCase()} accents, signed and ready to hang.`,
  },
  Decor: {
    forms: ["Vase", "Vessel", "Bowl", "Candleholder", "Sculpture", "Tray", "Bookends"],
    min: 90, max: 1600,
    desc: (m, f) => `A ${f.toLowerCase()} in ${m.toLowerCase()} with a tactile, hand-finished surface.`,
  },
  Outdoor: {
    forms: ["Outdoor Sofa", "Lounger", "Garden Bench", "Planter", "Outdoor Chair"],
    min: 500, max: 8200,
    desc: (m, f) => `A weather-ready ${f.toLowerCase()} in ${m.toLowerCase()} and all-season textiles for effortless outdoor living.`,
  },
  Dining: {
    forms: ["Dinnerware Set", "Glassware Set", "Flatware Set", "Carafe", "Serving Platter"],
    min: 110, max: 1900,
    desc: (m, f) => `A ${f.toLowerCase()} in ${m.toLowerCase()} and hand-glazed stoneware for the table.`,
  },
};

const TOTAL = 554;

function generateCatalog(): ShopItem[] {
  const cats = shopCategories as readonly string[];
  const out: ShopItem[] = [];
  for (let i = 0; i < TOTAL - curatedItems.length; i++) {
    const category = cats[i % cats.length];
    const spec = CATEGORY_SPEC[category];
    const material = MATERIALS[(i * 3) % MATERIALS.length];
    const form = spec.forms[(i * 2) % spec.forms.length];
    const series = SERIES[i % SERIES.length];
    const name = `${material} ${form}`;
    const steps = 24;
    const price =
      spec.min +
      Math.round(((spec.max - spec.min) * ((i * 7) % steps)) / steps / 10) * 10;
    out.push({
      slug: `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${i + 1}`,
      name: `${series} ${name}`,
      category,
      maker: MAKERS[i % MAKERS.length],
      price,
      currency: "USD",
      image: U(PHOTO_POOL[(i * 5) % PHOTO_POOL.length]),
      description: spec.desc(material, form),
    });
  }
  return out;
}

export const shopItems: ShopItem[] = [...curatedItems, ...generateCatalog()];
