import { Moodboard } from "./types";

// Curated stock of beautiful luxury and minimal Unsplash image IDs grouped by theme
export const THEME_IMAGES: Record<string, string[]> = {
  fashion: [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80"
  ],
  architecture: [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=600&q=80"
  ],
  tech: [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1457305237443-44c3d5a30b89?auto=format&fit=crop&w=600&q=80"
  ],
  gastronomy: [
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1547049082-1a12c3bf2366?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=600&q=80"
  ],
  music: [
    "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80"
  ],
  art: [
    "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=600&q=80"
  ]
};

// Returns a beautiful mock asset matching the industry/tag
export function getIndustryImage(industry: string, index: number, keywords: string[] = []): string {
  const norm = industry.toLowerCase();
  let category = "art";
  if (norm.includes("fashion") || norm.includes("apparel")) category = "fashion";
  else if (norm.includes("architect") || norm.includes("interior") || norm.includes("stone")) category = "architecture";
  else if (norm.includes("tech") || norm.includes("digital") || norm.includes("cyber")) category = "tech";
  else if (norm.includes("gastron") || norm.includes("food") || norm.includes("culinary")) category = "gastronomy";
  else if (norm.includes("music") || norm.includes("perform") || norm.includes("aud")) category = "music";

  const list = THEME_IMAGES[category] || THEME_IMAGES["art"];
  const imgIdx = Math.abs(index + (keywords.length * 2)) % list.length;
  return list[imgIdx];
}

export const INTEREST_TAGS = [
  "Brand Identity",
  "Logo Design",
  "UI/UX Design",
  "Web Design",
  "Typography Design",
  "Editorial Layout",
  "Package Design",
  "Photography Style",
  "Art Direction",
  "Product Design",
  "Motion Graphics",
  "Minimalist Branding"
];

export const INITIAL_EXPLORE_BOARDS: Moodboard[] = [
  {
    id: "mb-seed-1",
    title: "Sartorial Silence",
    tagline: "Unfolding tactile surfaces and structural shadow lines in contemporary tailoring.",
    adjectives: ["Sculptural", "Quiet Luxury", "Tactile", "Limen"],
    colors: [
      { hex: "#FFFFFF", name: "Paper Bleach", role: "Primary Background" },
      { hex: "#2B00EB", name: "Ink Accent", role: "Sartorial Contrast" },
      { hex: "#F5F3EF", name: "Raw Oatmeal", role: "Textile Linen" },
      { hex: "#625E54", name: "Warm Drab", role: "Seam Muted" },
      { hex: "#111111", name: "Charcoal Obsidian", role: "Core Text Display" }
    ],
    editorialSpecs: {
      typographyPairing: "Poppins Display Medium + Courier Prime, tracked, vertical alignments",
      photographyStyle: "Diffused golden hour morning illumination, light film grain noise layer",
      layoutConcept: "Asymmetrical 4-block columns with breathing negative space"
    },
    panels: [
      {
        id: "p1",
        type: "image_reference",
        title: "Folded Seams Study",
        subtitle: "Texture Detail",
        content: "#F5F3EF",
        imageKeywords: ["fabrics drape minimalism model linen"],
        colSpan: 2,
        rowSpan: 1,
        imageUrl: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "p2",
        type: "color_accent",
        title: "Contrast Blue Depth",
        subtitle: "Swatch Frame",
        content: "#2B00EB",
        imageKeywords: ["blue solid color backdrop"],
        colSpan: 1,
        rowSpan: 1
      },
      {
        id: "p3",
        type: "typography_spec",
        title: "01",
        subtitle: "Form Pairing",
        content: "Silence is creative density in disguise.",
        imageKeywords: ["text concept font print poster"],
        colSpan: 1,
        rowSpan: 1
      },
      {
        id: "p4",
        type: "concept_words",
        title: "Sensory Mind",
        subtitle: "Mantra",
        content: "Craftsmanship lies in executing the request with zero unnecessary weight.",
        imageKeywords: ["concept model aesthetic text spacing"],
        colSpan: 1,
        rowSpan: 1
      },
      {
        id: "p5",
        type: "abstract_graphic",
        title: "Geometric Tension",
        subtitle: "Abstract Blueprint",
        content: "Draft outline 135px alignment tension",
        imageKeywords: ["outline geometrical blueprints blueprint detail layout"],
        colSpan: 1,
        rowSpan: 1,
        imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80"
      }
    ],
    createdBy: "Creative Studio Copenhagen",
    createdAt: "2026-05-26T20:53:00Z",
    likesCount: 142,
    likedByMe: false,
    savedByMe: true,
    industry: "Fashion & Apparel",
    creativeDirection: "Copenhagen organic wools and deep deep shadow contrasts with minimal cobalt pigment accent paths."
  },
  {
    id: "mb-seed-2",
    title: "Monolithic Travertine",
    tagline: "Brutalist block placements and sharp mineral textures reflecting under direct summer sun.",
    adjectives: ["Brutalist", "Stone", "Volumetric", "Tonal"],
    colors: [
      { hex: "#FAFAFA", name: "Alabaster Powder", role: "Primary Canvas Block" },
      { hex: "#2B00EB", name: "Electric Blue Focus", role: "Interaction Thread" },
      { hex: "#EADCC1", name: "Raw Tufa Travertine", role: "Masonry Frame" },
      { hex: "#7E7666", name: "Cast Shadow Clay", role: "Dappled Dark Line" },
      { hex: "#1C1C1E", name: "Basalt Obsidian", role: "Heading Display Ink" }
    ],
    editorialSpecs: {
      typographyPairing: "Space Grotesk & Garamond Display, tracked-out numbers",
      photographyStyle: "Direct sunlight, harsh geometric shadow silhouettes, raw plaster grain",
      layoutConcept: "Large vertical spans, heavy baseline weights"
    },
    panels: [
      {
        id: "pa-1",
        type: "image_reference",
        title: "Masonry Junction",
        subtitle: "Travertine Block",
        content: "#EADCC1",
        imageKeywords: ["stone concrete wall architectural shadow Travertine"],
        colSpan: 1,
        rowSpan: 2,
        imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "pa-2",
        type: "color_accent",
        title: "Structural Accent",
        subtitle: "#2B00EB Spot Layer",
        content: "#2B00EB",
        imageKeywords: ["color block contrast"],
        colSpan: 1,
        rowSpan: 1
      },
      {
        id: "pa-3",
        type: "concept_words",
        title: "Materiality First",
        subtitle: "Brutalist Mantra",
        content: "Let materials stand as their unpolished state dictates.",
        imageKeywords: ["concrete block stone surface detail"],
        colSpan: 1,
        rowSpan: 1
      },
      {
        id: "pa-4",
        type: "image_reference",
        title: "Casting Negative Space",
        subtitle: "Shadow Study",
        content: "#7E7666",
        imageKeywords: ["interior structure column archway daylighting"],
        colSpan: 2,
        rowSpan: 1,
        imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80"
      }
    ],
    createdBy: "Studio Raw Travertine",
    createdAt: "2026-05-25T14:23:10Z",
    likesCount: 96,
    likedByMe: true,
    savedByMe: false,
    industry: "Interior & Architecture",
    creativeDirection: "Rough masonry stone-like walls with sharp, cast direct sunlight and brutal block formations."
  },
  {
    id: "mb-seed-3",
    title: "Warm Gastronomic Archival",
    tagline: "Organic earthenware textures and elegant smoke streams evoking slow mornings.",
    adjectives: ["Sensory", "Ceramic", "Warm Wood", "Atmospheric"],
    colors: [
      { hex: "#FFFFFF", name: "Bleached Porcelain", role: "Primary Glaze base" },
      { hex: "#2B00EB", name: "Ultramarine Stamp", role: "Makers Seal" },
      { hex: "#D6C3B0", name: "Drying Clay Oatmeal", role: "Unfired Body Texture" },
      { hex: "#5C4A3A", name: "Burnt Alderwood Wood", role: "Atmospheric Smoke Shadow" },
      { hex: "#111111", name: "Raw Charcoal", role: "Primary Text" }
    ],
    editorialSpecs: {
      typographyPairing: "Inter Light Letter-spaced & Editorial Italics",
      photographyStyle: "Atmospheric side window daylight, steam trails, moody grain contrast",
      layoutConcept: "Square central grid bento, high white border margins"
    },
    panels: [
      {
        id: "pb-1",
        type: "typography_spec",
        title: "Glaze",
        subtitle: "Tactile Finish",
        content: "A study of imperfect edges, clay shrinkings, and wood kiln smoke marks.",
        imageKeywords: ["tactile surface art direction layout"],
        colSpan: 1,
        rowSpan: 1
      },
      {
        id: "pb-2",
        type: "image_reference",
        title: "Wheel Crafting Study",
        subtitle: "Clay forming",
        content: "#D6C3B0",
        imageKeywords: ["pottery wheel crafting clay shaping hands studio"],
        colSpan: 1,
        rowSpan: 2,
        imageUrl: "https://images.unsplash.com/photo-1547049082-1a12c3bf2366?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "pb-3",
        type: "color_accent",
        title: "Cobalt Pottery Stamp",
        subtitle: "Primary Accent",
        content: "#2B00EB",
        imageKeywords: ["cobalt blue design pigment mark abstract"],
        colSpan: 1,
        rowSpan: 1
      },
      {
        id: "pb-4",
        type: "image_reference",
        title: "Atmospheric Sourdough Plate",
        subtitle: "Sensory plate",
        content: "#5C4A3A",
        imageKeywords: ["food sourdough loaf modern plating restaurant light shadow"],
        colSpan: 2,
        rowSpan: 1,
        imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80"
      }
    ],
    createdBy: "Savoir culinary lab",
    createdAt: "2026-05-24T09:11:42Z",
    likesCount: 228,
    likedByMe: false,
    savedByMe: false,
    industry: "Gastronomy & Food",
    creativeDirection: "Curated organic plate presentations, ceramic studio dust, steam, smoke streams and warm unpolished alderwood accents."
  }
];
