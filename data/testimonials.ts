export interface Testimonial {
  quote: string;
  name: string;
  detail: string;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "Gotch Studio gave us the calmest home we have ever lived in. Every room feels intentional, and somehow more 'us' than we could have imagined.",
    name: "The Harmon Family",
    detail: "Hudson Loft · Jersey City",
  },
  {
    quote:
      "They listened more than they talked, and the result is a Parisian apartment that feels like it has always been ours. Flawless from concept to install.",
    name: "Élodie M.",
    detail: "Maison Lumière · Paris",
  },
  {
    quote:
      "Working across continents could have been chaos. Instead it was the most organized, joyful project of our lives. The villa is breathtaking.",
    name: "A. & R. Conti",
    detail: "Villa Aurora · Lake Como",
  },
  {
    quote:
      "Our showroom finally feels like the brand we always wanted to be. Clients walk in and simply stop. That is the Gotch effect.",
    name: "Atelier Noir",
    detail: "Flagship · New York",
  },
  {
    quote:
      "The wellness focus changed how our family lives. We sleep better, we gather more, and we genuinely never want to leave.",
    name: "The Delgado Family",
    detail: "Casa Serena · Marbella",
  },
];
