export const type = [
  "Normal",
  "Poison",
  "Ice",
  "Golden",
  "Cursed",
  "Crimson",
  "Rainbow",
  "Toilette",
];

export const perks = ["None", "Spirits", "Kraken", "Blood Circle", "Wings"];

export const eyes = {
  0: "None",
  1: "3D",
  2: "Comedian",
  3: "Cyberpunk",
  4: "Vaporwave",
  5: "Sunglasses",
  6: "Blue Synth",
  7: "Red Synth",
  8: "Robot",
  9: "Nigth Vision",
  c: "Clown",
};

export const head = {
  0: "None",
  1: "Bowler",
  2: "Top",
  3: "Blue Witch",
  4: "Purple Witch",
  5: "Stocking Cap",
  6: "Leaf",
  7: "Pope Tiara",
  8: "Officer",
  9: "Cowboy",
  h: "Halo",
  g: "Gaming Headset",
};

export const species = [
  "Skeleton",
  "Slime",
  "Goblin",
  "Troll",
  "Succubus",
  "Mimic",
  "Egg",
];

export type Color = typeof type[number];

//export type Glasses = typeof eyes[number];

//export type Hats = typeof head[number];

export type Perks = typeof perks[number];

export type Species = typeof species[number];
