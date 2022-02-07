export type Mob = {
  name: string;
  id: string;
  traits: Traits;
};

export type Traits = {
  species: Species;
  color: Color;
  background?: Background;
  hat?: string;
  eyewear?: string;
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
  "chest",
  "toilette",
];

export const perks = ["", "spirits", "kraken", "bloodCircle", "wings"];

export const glasses = {
  0: "",
  1: "geek",
  2: "goof",
  3: "cyberpunk",
  4: "vaporwave",
  5: "sun",
  6: "synthblue",
  7: "synthred",
  8: "robot",
  9: "specops",
  c: "clown",
};

export const hats = {
  0: "",
  1: "bowler",
  2: "top",
  3: "witchblue",
  4: "witchpurple",
  5: "santa",
  6: "leaf",
  7: "pope",
  8: "officer",
  9: "cowboy",
  h: "halo",
  g: "headset",
};

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

//export type Glasses = typeof glasses[number];

//export type Hat = typeof hats[number];

export type Background = typeof backgrounds[number];
