/**
 * Studio team. Portrait URLs are Unsplash placeholders — replace with
 * professional headshots before launch.
 */

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  photo: string;
}

const P = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;

export const team: TeamMember[] = [
  {
    name: "Marin Gotch",
    role: "Founder & Creative Director",
    bio: "Marin founded the studio in 2002 with a belief that great design quietly improves daily life. Her work has been recognized internationally for its restraint and warmth.",
    photo: P("photo-1573497019940-1c28c88b4f3e"),
  },
  {
    name: "Elias Ravnar",
    role: "Principal, Interior Architecture",
    bio: "Elias leads our architectural collaborations, translating ambitious visions into buildable, beautifully detailed reality.",
    photo: P("photo-1500648767791-00dcc994a43e"),
  },
  {
    name: "Noor Haddad",
    role: "Design Director",
    bio: "Noor shapes the studio's signature material language, with a particular gift for palettes that feel both timeless and alive.",
    photo: P("photo-1494790108377-be9c29b29330"),
  },
  {
    name: "Theo Lindqvist",
    role: "Senior Designer, Furnishings",
    bio: "Theo curates and commissions the custom pieces that give each project its soul, drawing on a global network of makers.",
    photo: P("photo-1507003211169-0a1dd7228f2d"),
  },
  {
    name: "Camille Brisson",
    role: "Senior Designer, Residential",
    bio: "Camille brings a refined European sensibility and an obsessive eye for the details clients never knew they needed.",
    photo: P("photo-1438761681033-6461ffad8d80"),
  },
  {
    name: "Daniel Osei",
    role: "Project Director",
    bio: "Daniel keeps complex projects on time and on budget across continents, with a calm that clients and contractors equally trust.",
    photo: P("photo-1506794778202-cad84cf45f1d"),
  },
  {
    name: "Saki Tanaka",
    role: "Wellness & Neuroaesthetics Lead",
    bio: "Saki integrates the science of well-being into every plan — light, air, acoustics, and materiality tuned to how spaces make us feel.",
    photo: P("photo-1534528741775-53994a69daeb"),
  },
  {
    name: "Lucia Marín",
    role: "Procurement & Logistics Manager",
    bio: "Lucia orchestrates sourcing and white-glove delivery worldwide, ensuring every piece arrives perfectly and on schedule.",
    photo: P("photo-1487412720507-e7ab37603c6f"),
  },
  {
    name: "Anders Holm",
    role: "Sustainability Lead",
    bio: "Anders guides responsible sourcing and healthy-material choices, proving that conscience and luxury belong together.",
    photo: P("photo-1463453091185-61582044d556"),
  },
];

export interface Award {
  year: string;
  title: string;
  org: string;
}

export const awards: Award[] = [
  { year: "2024", title: "Best Residential Interior", org: "International Design Awards" },
  { year: "2023", title: "Wellness Project of the Year", org: "Luxe Interiors + Design" },
  { year: "2023", title: "Top 100 Designers", org: "Andrew Martin International" },
  { year: "2022", title: "Sustainable Interior, Honoree", org: "AD Great Design" },
  { year: "2021", title: "Showroom of the Year", org: "Interior Design Magazine" },
];

export const press: { outlet: string; quote: string }[] = [
  { outlet: "Architectural Digest", quote: "A master class in restraint and warmth." },
  { outlet: "Elle Decor", quote: "Timeless interiors that feel quietly radical." },
  { outlet: "Dwell", quote: "Proof that luxury and wellness belong in the same room." },
  { outlet: "Vogue Living", quote: "Gotch Studio designs homes you never want to leave." },
];
