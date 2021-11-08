export type Mob = {
  name: string;
  id: string;
  traits: Traits;
};

export type Traits = {
  species: Species;
  color: Color;
  background: string;
  hat?: Hats;
  eyewear?: Glasses;
  weapon?: string;
};

export const colors = ["base", "emerald", "aquamarine", "golden", "pink"];

export const glasses = ["", "geek", "sun", "cyberpunk", "vaporwave", "goof"];

export const hats = [
  "",
  "bluecap",
  "redcap",
  "bowler",
  "top",
  "witchblue",
  "witchpurple",
  "santa",
  "leaf",
  "gnome",
];

export const species = [
  "skeleton",
  "slime",
  "goblin",
  "troll",
  "demoness",
  "mimic",
];

export type Species = typeof species[number];

export type Color = typeof colors[number];

export type Glasses = typeof glasses[number];

export type Hats = typeof hats[number];

export type Weapon =
  | ""
  | "archer"
  | "warrior"
  | "executioner"
  | "mage"
  | "berserk";
