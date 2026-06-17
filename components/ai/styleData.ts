/**
 * Shared style definitions used by the Room Visualizer, Style Quiz, and
 * Moodboard Generator. Each "after" image is a curated reference standing in for
 * a generated result; swap for live model output when an API is connected.
 */

const U = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

export interface DesignStyle {
  id: string;
  name: string;
  description: string;
  preview: string;
  moodboard: string[];
}

export const designStyles: DesignStyle[] = [
  {
    id: "warm-minimal",
    name: "Warm Minimal",
    description:
      "Quiet, uncluttered spaces in soft ivories and natural wood — calm you can feel.",
    preview: U("photo-1505693416388-ac5ce068fe85"),
    moodboard: [
      U("photo-1493809842364-78817add7ffb"),
      U("photo-1586023492125-27b2c045efd7"),
      U("photo-1556909212-d5b604d0c90d"),
      U("photo-1583847268964-b28dc8f51f92"),
    ],
  },
  {
    id: "classic-luxe",
    name: "Classic Luxe",
    description:
      "Timeless elegance — mouldings, marble, brass, and richly layered neutrals.",
    preview: U("photo-1600210492486-724fe5c67fb0"),
    moodboard: [
      U("photo-1600121848594-d8644e57abab"),
      U("photo-1618219908412-a29a1bb7b86e"),
      U("photo-1560448204-e02f11c3d0e2"),
      U("photo-1502672260266-1c1ef2d93688"),
    ],
  },
  {
    id: "modern-coastal",
    name: "Modern Coastal",
    description:
      "Breezy and light — white oak, lime-wash, and barely-there color.",
    preview: U("photo-1600585154340-be6161a56a0c"),
    moodboard: [
      U("photo-1600566753086-00f18fb6b3ea"),
      U("photo-1600607687939-ce8a6c25118c"),
      U("photo-1600585154526-990dced4db0d"),
      U("photo-1505691938895-1758d7feb511"),
    ],
  },
  {
    id: "collected-eclectic",
    name: "Collected Eclectic",
    description:
      "Layered, well-travelled, full of character — bold yet deeply livable.",
    preview: U("photo-1556228453-efd6c1ff04f6"),
    moodboard: [
      U("photo-1505691938895-1758d7feb511"),
      U("photo-1524758631624-e2822e304c36"),
      U("photo-1567538096630-e0c55bd6374c"),
      U("photo-1532372320572-cda25653a26d"),
    ],
  },
  {
    id: "wellness-sanctuary",
    name: "Wellness Sanctuary",
    description:
      "Neuroaesthetic calm — tactile plaster, biophilia, and circadian light.",
    preview: U("photo-1600047509807-ba8f99d2cdde"),
    moodboard: [
      U("photo-1600566752355-35792bedcfea"),
      U("photo-1600210491892-03d54c0aaf87"),
      U("photo-1600585152220-90363fe7e115"),
      U("photo-1601000938259-9e92002320b2"),
    ],
  },
];
