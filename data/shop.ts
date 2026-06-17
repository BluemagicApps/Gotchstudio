/**
 * Curated furnishings for the light Shop integration. Prices are illustrative.
 * Replace imagery and wire to a real commerce backend (Shopify/Stripe) later.
 */

export interface ShopItem {
  slug: string;
  name: string;
  category: "Seating" | "Lighting" | "Tables" | "Textiles" | "Objects";
  maker: string;
  price: number;
  currency: string;
  image: string;
  description: string;
}

const U = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1000&q=80`;

export const shopItems: ShopItem[] = [
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
    description: "Hand-thrown ceramic base with an unlacquered brass stem and linen shade.",
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
    description: "Heavyweight undyed wool, woven by a family mill in the Scottish borders.",
  },
  {
    slug: "vessel-no-3",
    name: "Vessel No. 3",
    category: "Objects",
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
    description: "A quietly dramatic arc in patinated brass with a hand-stitched leather switch.",
  },
  {
    slug: "savile-sofa",
    name: "Savile Sofa",
    category: "Seating",
    maker: "Gotch Studio Custom",
    price: 8900,
    currency: "USD",
    image: U("photo-1493663284031-b7e3aefcae8e"),
    description: "A deep, down-wrapped sofa tailored in your choice of linen or mohair velvet.",
  },
  {
    slug: "terra-side-table",
    name: "Terra Side Table",
    category: "Tables",
    maker: "Widell + Boschetti",
    price: 1280,
    currency: "USD",
    image: U("photo-1567016432779-094069958ea5"),
    description: "Turned solid walnut with a softly waxed finish that warms with age.",
  },
];

export const shopCategories = [
  "Seating",
  "Lighting",
  "Tables",
  "Textiles",
  "Objects",
] as const;
