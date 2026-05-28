import look1 from "@/assets/look-1.jpg";
import look2 from "@/assets/look-2.jpg";
import look3 from "@/assets/look-3.jpg";
import fabric from "@/assets/fabric.jpg";
import studio from "@/assets/studio.jpg";

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  fabric: string;
  image: string;
  model: string;
  colors: { name: string; hex: string }[];
  description: string;
};

export const products: Product[] = [
  {
    id: "obsidian-gown",
    name: "Draped Obsidian Gown",
    category: "Evening",
    price: 2450,
    fabric: "Sand-washed Mulberry Silk",
    image: look1,
    model: "/models/gown.glb",
    colors: [
      { name: "Obsidian", hex: "#0a0a0a" },
      { name: "Garnet", hex: "#722f37" },
      { name: "Pearl", hex: "#e8e4dc" },
      { name: "Midnight", hex: "#1a1a2e" },
    ],
    description:
      "An exercise in shadow. The Obsidian gown is hand-draped over forty hours, allowing the fabric to find its own resting line. Strapless, full-length, made to move with the wearer.",
  },
  {
    id: "structural-trousers",
    name: "Structural Trouser & Blazer",
    category: "Tailoring",
    price: 1100,
    fabric: "Italian Virgin Wool",
    image: look2,
    model: "/models/jacket.glb",
    colors: [
      { name: "Charcoal", hex: "#2a2a2a" },
      { name: "Champagne", hex: "#c9c4b8" },
      { name: "Navy", hex: "#1e3a5f" },
    ],
    description:
      "Architectural lines softened by the natural fall of unstructured wool. A two-piece study in negative space, cut from a single bolt of cream wool sourced from Biella.",
  },
  {
    id: "organza-cape",
    name: "Silk Organza Cape",
    category: "Outerwear",
    price: 3200,
    fabric: "Hand-loomed Silk Organza",
    image: look3,
    model: "/models/jacket1.glb",
    colors: [
      { name: "Smoke", hex: "#3d3d3d" },
      { name: "Sand", hex: "#c9b896" },
      { name: "Ink", hex: "#1a1a1a" },
    ],
    description:
      "Weightless geometry. The organza cape is engineered to hold its silhouette while remaining nearly transparent, a study in the architecture of light.",
  },
  {
    id: "fabric-study",
    name: "Study No. 04",
    category: "Archive",
    price: 1850,
    fabric: "Raw Mulberry Silk",
    image: fabric,
    model: "/models/dress.glb",
    colors: [
      { name: "Onyx", hex: "#1a1a1a" },
      { name: "Ivory", hex: "#faf9f7" },
      { name: "Cocoa", hex: "#4a3728" },
      { name: "Slate", hex: "#2c3e50" },
    ],
    description:
      "A material exploration. Part of our ongoing archive of fabric studies, the surface treatment reveals the natural grain of raw silk under directional light.",
  },
  {
    id: "shadow-piece",
    name: "Shadow Drape",
    category: "Evening",
    price: 2780,
    fabric: "Heavy Crêpe de Chine",
    image: studio,
    model: "/models/shoes.glb",
    colors: [
      { name: "Obsidian", hex: "#1a1a1a" },
      { name: "Umber", hex: "#5c4033" },
      { name: "Ash", hex: "#3d3d3d" },
      { name: "Pearl", hex: "#c9c4b8" },
    ],
    description:
      "An anti-silhouette. The Shadow Drape collapses the boundary between garment and architecture, designed to hold its volume even in motion.",
  },
];

export const getProduct = (id: string) => products.find((p) => p.id === id);

