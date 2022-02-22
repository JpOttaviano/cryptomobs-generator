import fs from "fs";
import dotenv from "dotenv";
import cloudinary from "cloudinary";
import { eyes, head, type, species, perks } from "./traitsnames";
import { Attribute, Metadata } from "./types";
import { uploadJsonToCloudinary } from "../upload/cloudinary";

dotenv.config();

const {
  BASE_IMAGE_URL = "https://res.cloudinary.com/crypt0m0b5/image/upload/assets/",
} = process.env;
const EXTERNAL_URL = "https://cryptomobs.world/";
const DESCIPTION = "Monster escaped from a dungeon.";

function generateAttribute(trait: string, value: string): Attribute {
  return {
    trait_type: trait,
    value,
  };
}

function getTraitAdjective(trait: string): string {
  const traitLower = trait.toLowerCase();
  switch (traitLower) {
    case "spirits":
      return "Spiritist ";
    case "kraken":
      return "Summoner ";
    case "blood circle":
      return "Cultist ";
    case "3d":
      return "Geek ";
    case "comedian":
      return "Goofy ";
    case "cyberpunk":
    case "vaporwave":
    case "robot":
    case "officer":
    case "cowboy":
    case "clown":
      return `${trait} `;
    case "sunglasses":
      return "Cool ";
    case "blue synth":
    case "red synth":
      return "Glamorous ";
    case "nigth vision":
      return "PsyOps ";
    case "bowler":
      return "Classy ";
    case "top":
      return "Fancy ";
    case "blue witch":
    case "purple witch":
      return "Magic ";
    case "stocking cap":
      return "Festive ";
    case "leaf":
      return "Plant ";
    case "pope tiara":
      return "Pope ";
    case "halo":
      return "Holy ";
    case "wings":
      return "Flying ";
    case "gaming headset":
      return "Gamer ";
    default:
      return "";
  }
}

export function generateMetadata(dna: string): Metadata {
  // extracts ttraits from dna
  const traitNums = dna.toString().split("");
  const [, specie, color, eyewear, hat, perk] = traitNums;

  const atType = type[color];
  const atSpecies = species[specie];
  const atEyes = eyes[eyewear];
  const atHead = head[hat];
  const atPerk = perks[perk];

  const attributes = [
    generateAttribute("type", atType),
    generateAttribute("species", atSpecies),
    generateAttribute("eyes", atEyes),
    generateAttribute("head", atHead),
    generateAttribute("perk", atPerk),
  ];

  const image = `${BASE_IMAGE_URL}/${dna}.gif`;

  const eyeAdj = getTraitAdjective(atEyes);
  const headAdj = getTraitAdjective(atHead);
  const perkAdj = getTraitAdjective(atPerk);

  const atName = atType === "Normal" ? "" : `${atType} `;

  const name = `${eyeAdj}${headAdj}${atName}${perkAdj}${atSpecies}`;

  const metadata: Metadata = {
    description: DESCIPTION,
    external_url: EXTERNAL_URL,
    image,
    name,
    attributes,
  };

  return metadata;
}

export function generateJsons(dnas: string[]): Metadata[] {
  return dnas.map(generateMetadata);
}

export async function uploadMetadata(data: Metadata[]): Promise<void> {
  cloudinary.v2.config({
    cloud_name: "",
    api_key: "",
    api_secret: "",
  });
  let num = 0;
  for (const json of data) {
    const jsonName = `assets/${num}.json`;
    const data = Buffer.from(JSON.stringify(json)).toString("base64");
    const base64String = `data:application/json;base64,${data}`;
    const res = await cloudinary.v2.uploader.upload(
      base64String,
      {
        public_id: jsonName,
        resource_type: "raw",
      },
      (err, result) => {
        if (err) {
          console.log(err);
        }
        console.log(result);
      }
    );
    console.log(res);
    num++;
  }
}

export async function createAndUploadMetadata(dnas: string[]): Promise<void> {
  //const jsons = generateJsons(dnas);
  let num = 0;
  console.log(`Generating ${dnas.length} metadata files`);
  for (const dna of dnas) {
    const json = generateMetadata(dna);
    //console.log(json);
    num++;
    // upload to cloudinary
    await uploadJsonToCloudinary(json, dna);
    const path = `./metadata/${dna}.json`;
    fs.writeFileSync(path, JSON.stringify(json));
    /*if (num > 10) {
      break;
    }*/
  }
  console.log(`${num} jsons created`);
}

// locally delete metadata
export function removeMetadata(id: string): void {
  const path = `./metadata/${id}.json`;
  if (!fs.existsSync(path)) {
    throw new Error(`Metadata file ${path} does not exist`);
  }
  fs.unlinkSync(path);
}

export async function createAndUploadMetadataRngId(
  dnas: string[]
): Promise<void> {
  let num = 0;
  while (dnas.length > 0) {
    const dna = dnas.splice(Math.floor(Math.random() * dnas.length), 1);
    console.log(dnas.length);
    const json = generateMetadata(dna[0]);
    console.log(json);
    const path = `./metadata/${num}.json`;
    fs.writeFileSync(path, JSON.stringify(json));
    num++;
  }
}
