/**
 * Journal / insights posts. `body` is an array of paragraphs; for richer markup
 * later this can migrate to MDX. Images are Unsplash placeholders.
 */

export interface JournalPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string; // ISO
  readingTime: number; // minutes
  cover: string;
  body: string[];
}

const U = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=80`;

export const journal: JournalPost[] = [
  {
    slug: "designing-for-wellbeing",
    title: "Designing for Well-Being: The Quiet Science of Calm",
    excerpt:
      "How neuroaesthetics is reshaping the way we design homes — and why the way a room makes you feel is no longer an afterthought.",
    category: "Wellness",
    author: "Saki Tanaka",
    date: "2025-03-12",
    readingTime: 6,
    cover: U("photo-1600047509807-ba8f99d2cdde"),
    body: [
      "For decades, interior design measured success in style. Today, a growing body of research asks a deeper question: how does a space make us feel — physiologically, measurably, every single day?",
      "Neuroaesthetics, the study of how the brain responds to beauty and environment, gives us tools to design for the nervous system. Natural light tuned to our circadian rhythm, materials that invite touch, ceilings that breathe, acoustics that soften — these are not luxuries. They are the difference between a house that looks good and a home that helps you live well.",
      "In our own practice, we now begin every project by mapping the emotional arc of a day: the calm of waking, the focus of work, the release of evening. Each room is then designed to support that moment, not merely to photograph well.",
      "The result is a quieter kind of luxury — one you feel in your shoulders before you notice it with your eyes.",
    ],
  },
  {
    slug: "timeless-vs-trend",
    title: "Timeless vs. Trend: How to Invest in Interiors That Last",
    excerpt:
      "A practical philosophy for choosing pieces that will still feel right in twenty years.",
    category: "Philosophy",
    author: "Marin Gotch",
    date: "2025-02-02",
    readingTime: 5,
    cover: U("photo-1493809842364-78817add7ffb"),
    body: [
      "Trends are seductive precisely because they are everywhere. But the homes we love most are rarely on-trend — they are coherent, personal, and quietly confident.",
      "Our rule of thumb: invest in the permanent, experiment with the temporary. Spend on architecture, upholstery frames, stone, and lighting — the bones. Be playful with the things that are easy to change: a cushion, a coat of paint, a seasonal object.",
      "Timelessness is not about beige restraint. It is about intention. A bold emerald study can be timeless if it is honest to the house and to you.",
    ],
  },
  {
    slug: "art-of-collected-rooms",
    title: "The Art of the Collected Room",
    excerpt:
      "Why the most soulful interiors look gathered over time — and how to achieve it on purpose.",
    category: "Styling",
    author: "Noor Haddad",
    date: "2025-01-15",
    readingTime: 4,
    cover: U("photo-1505691938895-1758d7feb511"),
    body: [
      "A collected room tells a story. It mixes eras, origins, and price points with such ease that it feels accidental — though it almost never is.",
      "The secret is contrast held together by a through-line: a consistent palette, a repeated material, or a shared sense of patina. Within that discipline, you can layer freely.",
      "Buy what you love, slowly. The best rooms are never finished in a single shopping trip.",
    ],
  },
  {
    slug: "sustainable-luxury",
    title: "Sustainable Luxury Is Not a Contradiction",
    excerpt:
      "Responsible sourcing, healthy materials, and designs built to last a lifetime.",
    category: "Sustainability",
    author: "Anders Holm",
    date: "2024-12-08",
    readingTime: 5,
    cover: U("photo-1600210492486-724fe5c67fb0"),
    body: [
      "The most sustainable object is the one you never replace. That single idea reframes luxury: not excess, but endurance.",
      "We prioritize natural, low-VOC materials, vintage and antique sourcing, and local makers whose work is built to be repaired rather than discarded.",
      "Designing this way asks more of us — and rewards our clients with healthier homes and a lighter footprint.",
    ],
  },
  {
    slug: "light-as-material",
    title: "Light as a Material",
    excerpt:
      "Lighting is the most underestimated tool in interior design. Here is how we layer it.",
    category: "Craft",
    author: "Elias Ravnar",
    date: "2024-11-03",
    readingTime: 6,
    cover: U("photo-1556909212-d5b604d0c90d"),
    body: [
      "We treat light the way a sculptor treats stone — as a material to be shaped. A room without a considered lighting plan can never feel finished, no matter how beautiful the furniture.",
      "Our approach layers four registers: ambient, task, accent, and the all-important warmth of low, human-height light at night.",
      "Get the light right and the room will work in every season, at every hour. Get it wrong and nothing else can save it.",
    ],
  },
  {
    slug: "kitchen-as-heart",
    title: "The Kitchen as the Heart of the Home",
    excerpt:
      "Designing kitchens that are as gracious as they are hard-working.",
    category: "Residential",
    author: "Camille Brisson",
    date: "2024-10-12",
    readingTime: 4,
    cover: U("photo-1556911220-bff31c812dba"),
    body: [
      "The modern kitchen is rarely just a kitchen — it is the room where life actually happens. Designing one well means choreographing cooking, gathering, working, and lingering in a single space.",
      "We hide the hardest work in a scullery, keep the visible kitchen serene, and always make room to sit. A kitchen you want to linger in is a kitchen that has done its job.",
    ],
  },
  {
    slug: "global-influence-local-soul",
    title: "Global Influence, Local Soul",
    excerpt:
      "What designing across four continents has taught us about place.",
    category: "Travel",
    author: "Daniel Osei",
    date: "2024-09-01",
    readingTime: 5,
    cover: U("photo-1502672260266-1c1ef2d93688"),
    body: [
      "Working internationally is a privilege and a discipline. Every project must honor its place — its light, its climate, its craft traditions — while carrying the studio's voice.",
      "We never import a look. We listen to a location and let it shape the work, which is why a home in Kyoto and one in the Hamptons can both be unmistakably ours, yet entirely themselves.",
    ],
  },
  {
    slug: "color-confidence",
    title: "On Color Confidence",
    excerpt:
      "How to use color bravely without losing the calm that makes a home feel like home.",
    category: "Color",
    author: "Noor Haddad",
    date: "2024-08-04",
    readingTime: 4,
    cover: U("photo-1556228453-efd6c1ff04f6"),
    body: [
      "Most people are not afraid of color — they are afraid of regret. The trick is to anchor boldness in a disciplined neutral base, then commit fully where it counts.",
      "A deep, saturated room can be the most restful in the house when the tone is warm and the finish is right. Confidence, not caution, is what reads as elegant.",
    ],
  },
];

export function getPost(slug: string) {
  return journal.find((p) => p.slug === slug);
}
