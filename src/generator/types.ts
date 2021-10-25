export type Mob = {
  name: string;
  id: string;
  traits: Traits;
};

export type Traits = {
  species: string;
  color: string;
  background: string;
  hat?: string;
  eyewear?: string;
  weapon?: string;
};
