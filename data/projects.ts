/**
 * Portfolio projects. Image URLs are curated Unsplash interior photographs used
 * as placeholders — replace with licensed or commissioned photography before
 * launch. Each `gallery` entry should be a high-resolution editorial shot.
 *
 * `style`, `type`, and `location` power the portfolio filters.
 */

export type ProjectStyle =
  | "Modern"
  | "Classic"
  | "Eclectic"
  | "Minimal"
  | "Coastal"
  | "Wellness";

export type ProjectType =
  | "Residential"
  | "Commercial"
  | "New Build"
  | "Renovation"
  | "Kitchen & Bath";

export interface ProjectImage {
  url: string;
  alt: string;
}

export interface Project {
  slug: string;
  title: string;
  location: string;
  country: string;
  year: number;
  style: ProjectStyle;
  type: ProjectType;
  /** Short card/teaser line. */
  summary: string;
  /** Long-form client story (2–3 paragraphs). */
  story: string[];
  /** Scope bullet list. */
  scope: string[];
  hero: ProjectImage;
  gallery: ProjectImage[];
  beforeAfter?: { before: ProjectImage; after: ProjectImage };
  featured: boolean;
}

const U = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const curatedProjects: Project[] = [
  {
    slug: "hudson-loft",
    title: "Hudson Loft",
    location: "Jersey City, NJ",
    country: "United States",
    year: 2024,
    style: "Modern",
    type: "Residential",
    summary:
      "A light-flooded riverfront loft balancing industrial bones with warm, collected calm.",
    story: [
      "Set in a converted warehouse overlooking the Hudson, this two-bedroom loft asked for a home that honored its raw architecture while feeling unmistakably warm. We preserved the original timber columns and exposed brick, then layered them with plaster walls, oak millwork, and a deeply considered lighting plan.",
      "The result reads as a quiet gallery for living: a custom kitchen in honed limestone, a sculptural plaster fireplace, and a palette of soft ivories and rich woods that shifts beautifully with the river light.",
      "Every furnishing was sourced or commissioned to last — a study in restraint that the clients describe as 'the calmest room we have ever stood in.'",
    ],
    scope: [
      "Full-service interior architecture",
      "Custom millwork & kitchen",
      "Lighting design",
      "Furnishings procurement",
    ],
    hero: {
      url: U("photo-1505693416388-ac5ce068fe85"),
      alt: "Sunlit modern loft living room with warm wood and neutral textiles",
    },
    gallery: [
      { url: U("photo-1505693416388-ac5ce068fe85"), alt: "Open-plan living area with river light" },
      { url: U("photo-1586023492125-27b2c045efd7"), alt: "Honed limestone kitchen" },
      { url: U("photo-1556909212-d5b604d0c90d"), alt: "Sculptural plaster fireplace detail" },
      { url: U("photo-1493809842364-78817add7ffb"), alt: "Reading nook with oak shelving" },
    ],
    beforeAfter: {
      before: { url: U("photo-1581858726788-75bc0f6a952d"), alt: "Empty warehouse shell before renovation" },
      after: { url: U("photo-1505693416388-ac5ce068fe85"), alt: "Finished warm modern loft" },
    },
    featured: true,
  },
  {
    slug: "maison-lumiere",
    title: "Maison Lumière",
    location: "Paris, France",
    country: "France",
    year: 2023,
    style: "Classic",
    type: "Renovation",
    summary:
      "A Haussmann apartment reawakened — original mouldings paired with quiet contemporary luxury.",
    story: [
      "Behind a classic Parisian façade, this apartment had wonderful bones obscured by decades of unfortunate updates. We restored the cornices, herringbone parquet, and marble mantels, then edited everything else back to serenity.",
      "Antique finds from the Marché aux Puces sit alongside commissioned upholstery and a restrained palette of bone, taupe, and brass. The effect is collected rather than decorated — a home that feels like it has always been this beautiful.",
    ],
    scope: ["Heritage restoration", "Space planning", "Bespoke upholstery", "Art advisory"],
    hero: { url: U("photo-1600210492486-724fe5c67fb0"), alt: "Elegant Parisian living room with mouldings" },
    gallery: [
      { url: U("photo-1600210492486-724fe5c67fb0"), alt: "Restored salon with herringbone floors" },
      { url: U("photo-1600121848594-d8644e57abab"), alt: "Marble mantel with antique mirror" },
      { url: U("photo-1618219908412-a29a1bb7b86e"), alt: "Bedroom in bone and taupe" },
    ],
    featured: true,
  },
  {
    slug: "dune-house",
    title: "Dune House",
    location: "The Hamptons, NY",
    country: "United States",
    year: 2024,
    style: "Coastal",
    type: "New Build",
    summary:
      "A breezy oceanfront new build where natural materials meet effortless modern coastal living.",
    story: [
      "Conceived alongside the architect from the studs up, Dune House is a celebration of light, air, and texture. White oak, lime-washed walls, and bouclé invite touch; floor-to-ceiling glazing dissolves the line between living room and dunes.",
      "We kept the palette barely-there so the Atlantic does the talking, then grounded each room with one or two sculptural moments — a slab travertine table, a hand-thrown ceramic lamp.",
    ],
    scope: ["New build interiors", "Architectural collaboration", "Custom furniture", "Styling"],
    hero: { url: U("photo-1600585154340-be6161a56a0c"), alt: "Bright coastal living room with white oak" },
    gallery: [
      { url: U("photo-1600585154340-be6161a56a0c"), alt: "Coastal living room" },
      { url: U("photo-1600566753086-00f18fb6b3ea"), alt: "Lime-washed bedroom" },
      { url: U("photo-1600607687939-ce8a6c25118c"), alt: "Travertine dining table" },
    ],
    featured: true,
  },
  {
    slug: "atelier-noir",
    title: "Atelier Noir",
    location: "New York, NY",
    country: "United States",
    year: 2023,
    style: "Modern",
    type: "Commercial",
    summary:
      "A flagship design showroom staged as a moody, architectural stage for custom furniture.",
    story: [
      "For a furniture maker's first flagship, we built a deliberately dramatic envelope: charcoal plaster, blackened steel, and pools of warm light that let each piece perform like sculpture.",
      "Movable plinths and a flexible lighting grid let the team restage the space monthly, keeping the showroom as dynamic as the collection it holds.",
    ],
    scope: ["Retail design", "Lighting", "Display systems", "Brand environment"],
    hero: { url: U("photo-1497366811353-6870744d04b2"), alt: "Moody modern showroom with dramatic lighting" },
    gallery: [
      { url: U("photo-1497366811353-6870744d04b2"), alt: "Charcoal showroom" },
      { url: U("photo-1497366754035-f200968a6e72"), alt: "Blackened steel display" },
    ],
    featured: false,
  },
  {
    slug: "casa-serena",
    title: "Casa Serena",
    location: "Marbella, Spain",
    country: "Spain",
    year: 2022,
    style: "Wellness",
    type: "Residential",
    summary:
      "A Mediterranean retreat designed around light, air, and the science of feeling well at home.",
    story: [
      "Casa Serena was our deepest exploration of neuroaesthetics to date: every decision — ceiling height, material warmth, the path of morning light — was made to lower the nervous system the moment you arrive.",
      "Tadelakt plaster, untreated woods, and a spa-grade primary bath turn an ordinary morning into a ritual. The clients now spend three months a year here instead of three weeks.",
    ],
    scope: ["Wellness-led design", "Spa bath", "Biophilic planting", "Lighting circadian plan"],
    hero: { url: U("photo-1600047509807-ba8f99d2cdde"), alt: "Serene Mediterranean interior with plaster walls" },
    gallery: [
      { url: U("photo-1600047509807-ba8f99d2cdde"), alt: "Tadelakt living space" },
      { url: U("photo-1600566752355-35792bedcfea"), alt: "Spa bathroom" },
      { url: U("photo-1600210491892-03d54c0aaf87"), alt: "Biophilic courtyard" },
    ],
    featured: true,
  },
  {
    slug: "the-brownstone",
    title: "The Brownstone",
    location: "Brooklyn, NY",
    country: "United States",
    year: 2023,
    style: "Eclectic",
    type: "Renovation",
    summary:
      "A historic brownstone layered with global finds, bold art, and deeply livable comfort.",
    story: [
      "Four floors of classic Brooklyn brownstone became a collector's home. We restored period detail and then had fun: a lacquered emerald study, a parlor of vintage rugs from three continents, and a kitchen built for Sunday crowds.",
      "It is unapologetically personal — proof that timeless and characterful are not opposites.",
    ],
    scope: ["Whole-home renovation", "Custom cabinetry", "Art & rug sourcing", "Color strategy"],
    hero: { url: U("photo-1505691938895-1758d7feb511"), alt: "Eclectic brownstone parlor with vintage rugs" },
    gallery: [
      { url: U("photo-1505691938895-1758d7feb511"), alt: "Layered parlor" },
      { url: U("photo-1556228453-efd6c1ff04f6"), alt: "Emerald lacquered study" },
    ],
    featured: false,
  },
  {
    slug: "skyline-penthouse",
    title: "Skyline Penthouse",
    location: "Dubai, UAE",
    country: "United Arab Emirates",
    year: 2024,
    style: "Modern",
    type: "Residential",
    summary:
      "A glass-wrapped penthouse where restrained luxury frames an extraordinary skyline.",
    story: [
      "With views this commanding, our job was to stay out of the way and elevate. A monochrome envelope of stone and bronze lets the city become the art, while bespoke seating choreographs how guests gather at golden hour.",
      "Concealed automation, acoustic tuning, and a private hammam complete a home built for both serenity and spectacle.",
    ],
    scope: ["Penthouse interiors", "Smart-home integration", "Bespoke seating", "Stone selection"],
    hero: { url: U("photo-1545324418-cc1a3fa10c00"), alt: "Modern penthouse with skyline view" },
    gallery: [
      { url: U("photo-1545324418-cc1a3fa10c00"), alt: "Penthouse living room" },
      { url: U("photo-1567767292278-a4f21aa2d36e"), alt: "Bronze and stone bar" },
    ],
    featured: true,
  },
  {
    slug: "garden-kitchen",
    title: "Garden Kitchen",
    location: "Montclair, NJ",
    country: "United States",
    year: 2023,
    style: "Classic",
    type: "Kitchen & Bath",
    summary:
      "An English-inspired kitchen and pantry that opens generously onto a walled garden.",
    story: [
      "This kitchen renovation reorganized a dark rear addition into a light-filled heart of the home. Hand-painted cabinetry, unlacquered brass, and a soapstone island anchor the room; a new bank of steel windows pulls the garden inside.",
      "A scullery hides the mess; an integrated banquette invites lingering long after dinner.",
    ],
    scope: ["Kitchen & pantry design", "Steel glazing", "Cabinetry", "Material selection"],
    hero: { url: U("photo-1556911220-bff31c812dba"), alt: "English-inspired kitchen with brass fixtures" },
    gallery: [
      { url: U("photo-1556911220-bff31c812dba"), alt: "Painted cabinetry kitchen" },
      { url: U("photo-1600489000022-c2086d79f9d4"), alt: "Soapstone island" },
    ],
    featured: false,
  },
  {
    slug: "kyoto-residence",
    title: "Kyoto Residence",
    location: "Kyoto, Japan",
    country: "Japan",
    year: 2022,
    style: "Minimal",
    type: "Residential",
    summary:
      "A contemporary home in dialogue with Japanese craft — quiet, precise, profoundly calm.",
    story: [
      "In collaboration with local artisans, we shaped a home where every joint, screen, and shadow is intentional. Hinoki wood, washi paper, and tatami meet discreet modern comfort.",
      "Restraint here is not absence but presence — a deliberate emptiness that makes daily life feel like a meditation.",
    ],
    scope: ["Interior architecture", "Artisan collaboration", "Joinery", "Lighting"],
    hero: { url: U("photo-1503174971373-b1f69850bded"), alt: "Minimal Japanese-inspired interior" },
    gallery: [
      { url: U("photo-1503174971373-b1f69850bded"), alt: "Tatami living space" },
      { url: U("photo-1522708323590-d24dbb6b0267"), alt: "Hinoki bath" },
    ],
    featured: false,
  },
  {
    slug: "alpine-chalet",
    title: "Alpine Chalet",
    location: "Zermatt, Switzerland",
    country: "Switzerland",
    year: 2023,
    style: "Wellness",
    type: "New Build",
    summary:
      "A mountain retreat that wraps modern wellness in reclaimed timber and stone.",
    story: [
      "High above the village, this chalet pairs centuries-old reclaimed barnwood with a serene spa level — sauna, plunge, and a relaxation room oriented to the Matterhorn.",
      "Deep upholstery, layered wool, and warm low lighting make the long winters feel like an embrace.",
    ],
    scope: ["Chalet interiors", "Spa level", "Reclaimed materials", "Soft furnishings"],
    hero: { url: U("photo-1600585152220-90363fe7e115"), alt: "Cozy alpine chalet interior with timber" },
    gallery: [
      { url: U("photo-1600585152220-90363fe7e115"), alt: "Chalet living room" },
      { url: U("photo-1601000938259-9e92002320b2"), alt: "Spa relaxation room" },
    ],
    featured: false,
  },
  {
    slug: "gallery-office",
    title: "Gallery Office",
    location: "London, UK",
    country: "United Kingdom",
    year: 2024,
    style: "Modern",
    type: "Commercial",
    summary:
      "A creative agency HQ designed as a working gallery — calm, tactile, and quietly luxe.",
    story: [
      "We reimagined a Clerkenwell floor plate as a hospitality-led workplace: a welcoming café bar, acoustic snugs, and rotating wall space for the team's collected art.",
      "Natural materials and residential comfort make long days feel humane — and make recruiting easy.",
    ],
    scope: ["Workplace design", "Acoustic strategy", "Joinery", "Art curation"],
    hero: { url: U("photo-1524758631624-e2822e304c36"), alt: "Warm modern office lounge" },
    gallery: [
      { url: U("photo-1524758631624-e2822e304c36"), alt: "Office lounge" },
      { url: U("photo-1497215728101-856f4ea42174"), alt: "Acoustic snug" },
    ],
    featured: false,
  },
  {
    slug: "villa-aurora",
    title: "Villa Aurora",
    location: "Lake Como, Italy",
    country: "Italy",
    year: 2022,
    style: "Classic",
    type: "Renovation",
    summary:
      "A lakeside villa restored to timeless Italian grandeur with a softly modern hand.",
    story: [
      "Overlooking Lake Como, Villa Aurora needed reverence and renewal in equal measure. We restored frescoed ceilings and terrazzo floors, then introduced serene modern bathrooms and a kitchen worthy of long Italian lunches.",
      "Linen, limestone, and lake light carry a palette that feels eternal.",
    ],
    scope: ["Villa restoration", "Bathrooms", "Kitchen", "Furnishings"],
    hero: { url: U("photo-1502672260266-1c1ef2d93688"), alt: "Grand Italian villa interior" },
    gallery: [
      { url: U("photo-1502672260266-1c1ef2d93688"), alt: "Frescoed salon" },
      { url: U("photo-1560448204-e02f11c3d0e2"), alt: "Modern villa bathroom" },
    ],
    featured: false,
  },
];

/* ──────────────────────────────────────────────────────────────────────────
 * Extended portfolio. The curated projects above are hand-authored; these are
 * generated from curated interior imagery + tailored copy templates to give the
 * portfolio real depth. Deterministic, so static generation is stable. Replace
 * with real case studies + commissioned photography before launch.
 * ────────────────────────────────────────────────────────────────────────── */

const PHOTO_POOL = [
  "photo-1505693416388-ac5ce068fe85",
  "photo-1586023492125-27b2c045efd7",
  "photo-1556909212-d5b604d0c90d",
  "photo-1493809842364-78817add7ffb",
  "photo-1600210492486-724fe5c67fb0",
  "photo-1600121848594-d8644e57abab",
  "photo-1618219908412-a29a1bb7b86e",
  "photo-1600585154340-be6161a56a0c",
  "photo-1600566753086-00f18fb6b3ea",
  "photo-1600607687939-ce8a6c25118c",
  "photo-1524758631624-e2822e304c36",
  "photo-1497215728101-856f4ea42174",
  "photo-1502672260266-1c1ef2d93688",
  "photo-1560448204-e02f11c3d0e2",
  "photo-1600585152220-90363fe7e115",
  "photo-1601000938259-9e92002320b2",
  "photo-1567538096630-e0c55bd6374c",
  "photo-1532372320572-cda25653a26d",
  "photo-1493663284031-b7e3aefcae8e",
  "photo-1567016432779-094069958ea5",
  "photo-1505691938895-1758d7feb511",
  "photo-1556228453-efd6c1ff04f6",
  "photo-1600047509807-ba8f99d2cdde",
  "photo-1600566752355-35792bedcfea",
  "photo-1600210491892-03d54c0aaf87",
  "photo-1583847268964-b28dc8f51f92",
];

const GEN_STYLES: ProjectStyle[] = [
  "Modern",
  "Classic",
  "Eclectic",
  "Minimal",
  "Coastal",
  "Wellness",
];
const GEN_TYPES: ProjectType[] = [
  "Residential",
  "Commercial",
  "New Build",
  "Renovation",
  "Kitchen & Bath",
];

const STYLE_FEEL: Record<ProjectStyle, string> = {
  Modern: "clean lines and warm minimalism",
  Classic: "timeless elegance and considered detail",
  Eclectic: "collected, well-travelled character",
  Minimal: "quiet restraint and abundant light",
  Coastal: "breezy, natural materials and soft color",
  Wellness: "calm, tactile, restorative spaces",
};

const TYPE_WORK: Record<ProjectType, string> = {
  Residential: "a full-service home",
  Commercial: "a branded commercial environment",
  "New Build": "ground-up interior architecture",
  Renovation: "a sensitive, complete renovation",
  "Kitchen & Bath": "bespoke kitchen and bath interiors",
};

const SCOPE_BY_TYPE: Record<ProjectType, string[]> = {
  Residential: [
    "Full-service interior architecture",
    "Custom furnishings",
    "Lighting design",
    "Styling",
  ],
  Commercial: [
    "Concept & brand environment",
    "Space planning",
    "FF&E",
    "Project management",
  ],
  "New Build": [
    "Architectural collaboration",
    "Interior architecture",
    "Finish schedules",
    "Furnishings",
  ],
  Renovation: [
    "Heritage-sensitive renovation",
    "Space planning",
    "Custom millwork",
    "Furnishings",
  ],
  "Kitchen & Bath": [
    "Custom cabinetry",
    "Stone & material selection",
    "Lighting & plumbing",
    "Installation",
  ],
};

const NAME_A = [
  "Cedar", "Marble", "Linen", "Ember", "Slate", "Ivory", "Hazel", "Onyx",
  "Saffron", "Willow", "Cove", "Aurora", "Meridian", "Solace", "Atlas",
  "Verdant", "Lumen", "Quartz", "Hearth", "Dune", "Bramble", "Noble", "Serra",
  "Calder", "Ashford", "Bellwood", "Coral", "Drift", "Elmwood", "Fern", "Grove",
  "Harlow", "Indigo", "Juniper", "Kestrel", "Larkspur", "Marlowe", "Nocturne",
  "Oriel", "Persimmon", "Quill", "Rowan", "Sable", "Thistle", "Umber",
  "Veranda", "Wren", "Yarrow",
];
const NAME_B = [
  "House", "Residence", "Penthouse", "Retreat", "Loft", "Villa", "Pavilion",
  "Quarters", "Townhouse", "Manor", "Apartment", "Studio",
];

const PLACES: { location: string; country: string }[] = [
  { location: "Aspen, CO", country: "United States" },
  { location: "Montauk, NY", country: "United States" },
  { location: "Beverly Hills, CA", country: "United States" },
  { location: "Greenwich, CT", country: "United States" },
  { location: "Miami, FL", country: "United States" },
  { location: "Austin, TX", country: "United States" },
  { location: "Chicago, IL", country: "United States" },
  { location: "Seattle, WA", country: "United States" },
  { location: "London, UK", country: "United Kingdom" },
  { location: "Paris, France", country: "France" },
  { location: "Milan, Italy", country: "Italy" },
  { location: "Lisbon, Portugal", country: "Portugal" },
  { location: "Barcelona, Spain", country: "Spain" },
  { location: "Copenhagen, Denmark", country: "Denmark" },
  { location: "Amsterdam, Netherlands", country: "Netherlands" },
  { location: "Zurich, Switzerland", country: "Switzerland" },
  { location: "Dubai, UAE", country: "United Arab Emirates" },
  { location: "Singapore", country: "Singapore" },
  { location: "Tokyo, Japan", country: "Japan" },
  { location: "Sydney, Australia", country: "Australia" },
  { location: "Toronto, Canada", country: "Canada" },
  { location: "Marrakesh, Morocco", country: "Morocco" },
  { location: "Cape Town, South Africa", country: "South Africa" },
  { location: "Côte d'Azur, France", country: "France" },
];

const generatedProjects: Project[] = Array.from({ length: 48 }, (_, i) => {
  const style = GEN_STYLES[i % GEN_STYLES.length];
  const type = GEN_TYPES[(i * 2 + 1) % GEN_TYPES.length];
  const place = PLACES[i % PLACES.length];
  const title = `${NAME_A[i % NAME_A.length]} ${NAME_B[i % NAME_B.length]}`;
  const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${i + 1}`;
  const year = 2018 + (i % 8);
  const g = (n: number) => PHOTO_POOL[(i * 3 + n) % PHOTO_POOL.length];
  return {
    slug,
    title,
    location: place.location,
    country: place.country,
    year,
    style,
    type,
    summary: `A ${style.toLowerCase()} ${type.toLowerCase()} in ${place.location} — ${STYLE_FEEL[style]}, realized with enduring materials.`,
    story: [
      `${title} brought us to ${place.location} to create ${TYPE_WORK[type]} defined by ${STYLE_FEEL[style]}. We shaped each room around how our clients actually live, layering natural materials, a considered lighting plan, and furnishings sourced or commissioned to last.`,
      `The result reads as collected rather than decorated — a space that holds ${STYLE_FEEL[style]} and will age gracefully, growing more beloved with time.`,
    ],
    scope: SCOPE_BY_TYPE[type],
    hero: { url: U(g(0)), alt: `${title} — ${style} interior in ${place.location}` },
    gallery: [
      { url: U(g(1)), alt: `${title} interior detail` },
      { url: U(g(2)), alt: `${title} living space` },
      { url: U(g(3)), alt: `${title} material palette` },
    ],
    featured: false,
  };
});

export const projects: Project[] = [...curatedProjects, ...generatedProjects];

export const projectStyles: ProjectStyle[] = [
  "Modern",
  "Classic",
  "Eclectic",
  "Minimal",
  "Coastal",
  "Wellness",
];

export const projectTypes: ProjectType[] = [
  "Residential",
  "Commercial",
  "New Build",
  "Renovation",
  "Kitchen & Bath",
];

export const featuredProjects = projects.filter((p) => p.featured);

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
