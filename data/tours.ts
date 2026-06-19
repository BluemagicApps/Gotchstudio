/**
 * 360° virtual-tour scenes for the AI Studio's immersive walkthrough.
 *
 * Each `src` is a true equirectangular (2:1) panorama bundled in /public/panoramas
 * so the viewer is fully self-contained — no third-party hotlinking, no CORS, and
 * nothing to break at runtime. These are tastefully-chosen, openly-licensed
 * placeholder interiors; swap them for the studio's own 360° captures
 * (Matterport / Insta360 / Theta) before launch. Attribution is required by the
 * source licenses — see /public/panoramas/CREDITS.md and the `credit` field,
 * which is surfaced in the viewer.
 */
export interface TourScene {
  id: string;
  /** Display name shown in the scene switcher. */
  name: string;
  /** Equirectangular panorama in /public/panoramas (served same-origin). */
  src: string;
  /** Attribution line rendered in the viewer (license compliance). */
  credit: string;
}

export const tourScenes: TourScene[] = [
  {
    id: "living-room",
    name: "Guesthouse Living Room",
    src: "/panoramas/living-room.jpg",
    credit: "© ESO · CC BY 4.0",
  },
  {
    id: "conservatory",
    name: "Villa Conservatory",
    src: "/panoramas/conservatory.jpg",
    credit: "© 1971markus · CC BY-SA 4.0",
  },
  {
    id: "villa-hall",
    name: "Villa La Quiete — Hall",
    src: "/panoramas/villa-hall.jpg",
    credit: "© Diego Brugnoni · CC BY-SA 4.0",
  },
];
