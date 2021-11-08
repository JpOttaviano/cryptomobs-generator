const colors = ["", "emerald", "aquamarine", "golden", "pink"];

const glasses = ["", "geek", "cool", "cyberpunk", "vaporwave", "goof"];

const hats = ["", "holy", "elegant", "sporty", "festive", "witch"];

const species = ["skeleton", "slime", "goblin", "troll", "demoness", "mimic"];

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

export type Species = typeof species[number];
