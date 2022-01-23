import dotenv from "dotenv";
import cloudinary from "cloudinary";
import { eyes, head, type, species } from "./traitsnames";
import { Attribute, backgrounds, Metadata, Traits } from "./types";

dotenv.config();

const { BASE_IMAGE_URL } = process.env;
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
    case "3d":
      return "Geek ";
    case "comedian":
      return "Goofy ";
    case "cyberpunk":
    case "vaporwave":
    case "robot":
    case "officer":
    case "cowboy":
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
    default:
      return "";
  }
}

function generateMetadata(dna: string): Metadata {
  // extracts ttraits from dna
  const traitNums = dna.toString().split("");
  const [, specie, color, eyewear, hat, background] = traitNums;

  const atType = type[color];
  const atSpecies = species[specie];
  const atEyes = eyes[eyewear];
  const atHead = head[hat];

  const attributes = [
    generateAttribute("type", atType),
    generateAttribute("species", atSpecies),
    generateAttribute("eyes", atEyes),
    generateAttribute("head", atHead),
  ];

  const image = `${BASE_IMAGE_URL}/${dna}.gif`;

  const eyeAdj = getTraitAdjective(atEyes);
  const headAdj = getTraitAdjective(atHead);

  const atName = atType === "Normal" ? "" : `${atType} `;

  const name = `${eyeAdj}${headAdj}${atName}${atSpecies}`;

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
  const jsons = generateJsons(dnas);
  let num = 0;
  for (const json of jsons) {
    console.log(json);
    num++;
  }
  console.log(`${num} jsons created`);
}
