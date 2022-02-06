export const type = [
  "Normal",
  "Poison",
  "Ice",
  "Golden",
  "Cursed",
  "Crimson",
  "Rainbow",
];

export const perks = ["None", "Spirits", "Kraken", "Blood Circle"];

export const eyes = [
  "None",
  "3D",
  "Comedian",
  "Cyberpunk",
  "Vaporwave",
  "Sunglasses",
  "Blue Synth",
  "Red Synth",
  "Robot",
  "Nigth Vision",
];

export const head = [
  "None",
  "Bowler",
  "Top",
  "Blue Witch",
  "Purple Witch",
  "Stocking Cap",
  "Leaf",
  "Pope Tiara",
  "Officer",
  "Cowboy",
  "Halo",
];

export const species = [
  "Skeleton",
  "Slime",
  "Goblin",
  "Troll",
  "Succubus",
  "Mimic",
];

export type Color = typeof type[number];

export type Glasses = typeof eyes[number];

export type Hats = typeof head[number];

export type Perks = typeof perks[number];

export type Species = typeof species[number];
