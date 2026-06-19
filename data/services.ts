/**
 * Service offerings + the studio's full-service process timeline.
 * Icons reference lucide-react icon names (resolved in the ServicesGrid).
 */

export interface Service {
  slug: string;
  icon: string;
  title: string;
  summary: string;
  description: string;
  deliverables: string[];
}

export const services: Service[] = [
  {
    slug: "residential",
    icon: "Home",
    title: "Residential Design",
    summary: "Full-service homes designed for how you actually live.",
    description:
      "From pied-à-terre to estate, we shape residences that are timeless, tactile, and deeply personal — every detail considered, nothing left to chance.",
    deliverables: ["Interior architecture", "Custom furnishings", "Art & accessories", "White-glove installation"],
  },
  {
    slug: "commercial",
    icon: "Building2",
    title: "Commercial & Hospitality",
    summary: "Branded environments that feel like destinations.",
    description:
      "Workplaces, showrooms, and hospitality spaces engineered for experience and longevity, balancing brand expression with human comfort.",
    deliverables: ["Concept & brand environment", "Space planning", "FF&E", "Project management"],
  },
  {
    slug: "new-build-renovation",
    icon: "HardHat",
    title: "New Build & Renovation",
    summary: "Architectural collaboration from foundation to finish.",
    description:
      "We partner with architects and builders from the earliest stages, ensuring the interior architecture and the building rise as one coherent vision.",
    deliverables: ["Architectural collaboration", "Interior architecture", "Finish schedules", "Site supervision"],
  },
  {
    slug: "kitchen-bath",
    icon: "ChefHat",
    title: "Kitchen & Bath",
    summary: "The hardest-working rooms, made beautiful.",
    description:
      "Bespoke cabinetry, considered ergonomics, and enduring materials produce kitchens and baths that are as functional as they are sculptural.",
    deliverables: ["Custom cabinetry", "Material & stone selection", "Plumbing & lighting", "Appliance specification"],
  },
  {
    slug: "furnishings-procurement",
    icon: "Sofa",
    title: "Furnishings & Procurement",
    summary: "Sourcing, custom commissions, and seamless logistics.",
    description:
      "Through our global trade network we source, commission, and manage every furnishing — handling logistics, installation, and styling end to end.",
    deliverables: ["Trade sourcing", "Custom commissions", "Logistics & receiving", "Styling"],
  },
  {
    slug: "e-design",
    icon: "Monitor",
    title: "e-Design",
    summary: "Our signature aesthetic, delivered remotely.",
    description:
      "A flexible, room-by-room digital package for clients anywhere — concept boards, layouts, and a curated shopping list you implement on your schedule.",
    deliverables: ["Concept board", "Floor plan", "Shopping list", "Implementation guide"],
  },
  {
    slug: "virtual-consults",
    icon: "Video",
    title: "Virtual Consultations",
    summary: "Expert guidance, one focused session at a time.",
    description:
      "Book a designer for a single high-impact video session to solve a specific challenge — color, layout, sourcing, or a second opinion.",
    deliverables: ["60-minute session", "Live design feedback", "Action summary", "Resource links"],
  },
  {
    slug: "ai-enhanced-design",
    icon: "Sparkles",
    title: "AI-Enhanced Design",
    summary: "Visualize options instantly, then refine with our team.",
    description:
      "Our AI Studio lets you explore directions in your own space, then collaborate with our designers to bring the chosen vision to life with real materials.",
    deliverables: ["AI room visualizations", "Style profiling", "Moodboards", "Designer handoff"],
  },
];

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Discovery",
    description:
      "We begin by listening. Through an in-depth consultation we map how you live, what moves you, and the life this space needs to support.",
  },
  {
    number: "02",
    title: "Concept",
    description:
      "We translate your story into a clear creative direction — spatial strategy, palette, and a curated set of materials and references.",
  },
  {
    number: "03",
    title: "Design Development",
    description:
      "Layouts, custom millwork, lighting, and furnishings are resolved in detail, presented through drawings, samples, and realistic visualizations.",
  },
  {
    number: "04",
    title: "Procurement",
    description:
      "We source, commission, and manage every element through our global trade network, handling logistics and quality control throughout.",
  },
  {
    number: "05",
    title: "Installation",
    description:
      "Our team manages a white-glove installation down to the final styled detail, so you walk into a home that is complete and ready to live in.",
  },
  {
    number: "06",
    title: "Reveal & Aftercare",
    description:
      "We hand over your finished space and remain on call — because the best interiors only grow more beloved with time.",
  },
];
