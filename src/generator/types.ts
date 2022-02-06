export type Mob = {
  name: string;
  id: string;
  traits: Traits;
};

export type Traits = {
  species: Species;
  color: Color;
  background?: Background;
  hat?: Hat;
  eyewear?: Glasses;
  perk?: Perk;
};

export type Attribute = {
  trait_type: string;
  value: string;
};

export type Metadata = {
  description: string;
  external_url: string;
  image: string;
  name: string;
  attributes: Attribute[];
};
export const backgrounds = [
  "smoothDawn",
  "smoothNight",
  "smoothSnset",
  "smoothVapor",
];

export const colors = [
  "base",
  "emerald",
  "aquamarine",
  "golden",
  "pink",
  "crimson",
  "rainbow",
];

export const perks = ["", "spirits", "kraken", "bloodCircle"];

export const glasses = [
  "",
  "geek",
  "goof",
  "cyberpunk",
  "vaporwave",
  "sun",
  "synthblue",
  "synthred",
  "robot",
  "specops",
];

export const hats = [
  "",
  "bowler",
  "top",
  "witchblue",
  "witchpurple",
  "santa",
  "leaf",
  "pope",
  "officer",
  "cowboy",
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

export type Perk = typeof perks[number];

export type Glasses = typeof glasses[number];

export type Hat = typeof hats[number];

export type Background = typeof backgrounds[number];
