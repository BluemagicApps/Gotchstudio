/**
 * 360° virtual-tour scenes for the AI Studio's immersive walkthrough.
 *
 * Each `src` is a true equirectangular (2:1) panorama bundled in /public/panoramas
 * so the viewer is fully self-contained — no third-party hotlinking, no CORS, and
 * nothing to break at runtime. Scenes are grouped by space type so visitors can
 * tour different kinds of interiors. These are tastefully-chosen, openly-licensed
 * placeholder interiors; swap them for the studio's own 360° captures
 * (Matterport / Insta360 / Theta) before launch. Attribution is required by the
 * source licenses — see /public/panoramas/CREDITS.md and the `credit` field.
 *
 * 360° VIDEO: set the optional `video` field on a scene (or add new scenes) to an
 * equirectangular .mp4/.webm — same-origin (in /public) or a CORS-enabled URL —
 * and the viewer plays it as a 360° video instead of a still. See the
 * `videoTourSlots` list below for the studio's planned video walkthroughs.
 */
export type TourCategory = "Homes" | "Hotels" | "Restaurants" | "Other";

export interface TourScene {
  id: string;
  /** Display name shown in the scene switcher. */
  name: string;
  /** Space type used to group scenes in the viewer. */
  category: TourCategory;
  /** Equirectangular panorama in /public/panoramas (served same-origin). */
  src: string;
  /** Attribution line rendered in the viewer (license compliance). */
  credit: string;
  /** Optional equirectangular 360° video; when set the scene plays as video. */
  video?: string;
}

export const tourCategories: TourCategory[] = [
  "Homes",
  "Hotels",
  "Restaurants",
  "Other",
];

export const tourScenes: TourScene[] = [
  // ── Homes ──
  {
    id: "living-room",
    name: "Living Room",
    category: "Homes",
    src: "/panoramas/living-room.jpg",
    credit: "© ESO · CC BY 4.0",
  },
  {
    id: "conservatory",
    name: "Conservatory",
    category: "Homes",
    src: "/panoramas/conservatory.jpg",
    credit: "© 1971markus · CC BY-SA 4.0",
  },
  {
    id: "villa-hall",
    name: "Villa Hall",
    category: "Homes",
    src: "/panoramas/villa-hall.jpg",
    credit: "© Diego Brugnoni · CC BY-SA 4.0",
  },
  // ── Hotels ──
  {
    id: "foyer",
    name: "Grand Foyer",
    category: "Hotels",
    src: "/panoramas/foyer.jpg",
    credit: "© 1971markus · CC BY-SA 4.0",
  },
  {
    id: "grand-hall",
    name: "Grand Salon",
    category: "Hotels",
    src: "/panoramas/grand-hall.jpg",
    credit: "© 1971markus · CC BY-SA 4.0",
  },
  {
    id: "ballroom",
    name: "Ballroom",
    category: "Hotels",
    src: "/panoramas/ballroom.jpg",
    credit: "© 1971markus · CC BY-SA 4.0",
  },
  // ── Restaurants ──
  {
    id: "bistro",
    name: "Bistro",
    category: "Restaurants",
    src: "/panoramas/bistro.jpg",
    credit: "© 1971markus · CC BY-SA 4.0",
  },
  // ── Other ──
  {
    id: "library",
    name: "Library",
    category: "Other",
    src: "/panoramas/library.jpg",
    credit: "© Lauri Veerde · CC BY-SA 4.0",
  },
  {
    id: "museum",
    name: "Gallery",
    category: "Other",
    src: "/panoramas/museum.jpg",
    credit: "© Cmglee · CC BY-SA 4.0",
  },
];

/**
 * Planned 360° VIDEO walkthroughs (26), grouped by space type, for the studio's
 * own captures. Drop an equirectangular .mp4/.webm (same-origin in /public or a
 * CORS-enabled URL) into each `video` field and add it to `tourScenes` (or render
 * this list) — the viewer's video path will play it as an immersive 360° video.
 * Kept as a ready-to-populate manifest rather than broken placeholders.
 */
export interface VideoTourSlot {
  id: string;
  name: string;
  category: TourCategory;
  /** Set to the studio's equirectangular 360° video URL to activate. */
  video: string;
}

const VIDEO_PLAN: { category: TourCategory; names: string[] }[] = [
  {
    category: "Homes",
    names: [
      "Penthouse Living",
      "Primary Suite",
      "Family Kitchen",
      "Garden Room",
      "Townhouse Stair",
      "Home Spa",
      "Library Study",
    ],
  },
  {
    category: "Hotels",
    names: [
      "Arrival Lobby",
      "Presidential Suite",
      "Rooftop Bar",
      "Spa & Pool",
      "Grand Ballroom",
      "Club Lounge",
      "Wellness Studio",
    ],
  },
  {
    category: "Restaurants",
    names: [
      "Main Dining Room",
      "Chef's Table",
      "Wine Cellar",
      "Garden Terrace",
      "Cocktail Bar",
      "Private Dining",
    ],
  },
  {
    category: "Other",
    names: [
      "Boutique Floor",
      "Gallery Hall",
      "Members' Club",
      "Corporate Lobby",
      "Showroom",
      "Event Space",
    ],
  },
];

export const videoTourSlots: VideoTourSlot[] = VIDEO_PLAN.flatMap((group) =>
  group.names.map((name) => ({
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name,
    category: group.category,
    video: "", // ← add the studio's equirectangular 360° video URL here
  })),
);
