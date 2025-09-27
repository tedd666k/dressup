export type GarmentVariant = "aline" | "mermaid" | "coat" | "gown";

export type Sample = {
  id: string;
  name: string;
  color: string; // hex
  accent?: string; // hex
  bg: "light" | "dark"; // viewer background preference
  variant: GarmentVariant;
};

export const SAMPLES: Sample[] = [
  {
    id: "meya-aline",
    name: "A-Line Classic",
    color: "#202020",
    accent: "#d4af37",
    bg: "light",
    variant: "aline",
  },
  {
    id: "meya-mermaid",
    name: "Mermaid Noir",
    color: "#8a1538",
    accent: "#f2e7dc",
    bg: "light",
    variant: "mermaid",
  },
  {
    id: "meya-coat",
    name: "Trench Sculpt",
    color: "#2e4057",
    accent: "#b8c1ec",
    bg: "light",
    variant: "coat",
  },
  {
    id: "meya-gown",
    name: "Evening Gown",
    color: "#e4c1f9",
    accent: "#1a1a1a",
    bg: "dark",
    variant: "gown",
  },
];
