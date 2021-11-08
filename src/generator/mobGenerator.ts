import fs from "fs";
import Jimp from "jimp";
import { createCanvas, Image } from "canvas";
import GIFEncoder from "gif-encoder-2";
import { colors, glasses, hats, species, Traits } from "./types";

function generateRandomDNA(): string {
  return Math.floor(Math.random() * 100).toString();
}

export async function createFrame(
  traits: Traits,
  index: number
): Promise<Buffer> {
  // retrieve traits from traits id
  const { color, background, species, eyewear, hat } = traits;
  const mobPath = `./src/assets/mobs/${species}`;
  const colorPath = `${mobPath}/body/${color}/${index}.png`;
  const eyePath =
    eyewear != "" ? `${mobPath}/glasses/${eyewear}/${index}.png` : undefined;
  const hatPath = hat != "" ? `${mobPath}/hats/${hat}/${index}.png` : undefined;

  // generate frame with traits
  const composites = [];
  if (hatPath) {
    composites.push(hatPath);
  }
  if (eyePath) {
    composites.push(eyePath);
  }
  const image = await Jimp.read(colorPath);
  for (const composite of composites) {
    const compositeImage = await Jimp.read(composite);
    image.composite(compositeImage, 0, 0);
  }
  const buffer = await image.getBufferAsync(Jimp.MIME_PNG);
  console.log(buffer);
  return buffer;
}

function getTraitsFromDNA(dna: string): Traits {
  // retrieve traits from dna
  const traitNums = dna.toString().split("");
  const [, specie, color, eyewear, hat] = traitNums;

  // example:
  const traits: Traits = {
    color: colors[color],
    background: "dungeon",
    species: species[specie],
    eyewear: glasses[eyewear],
    hat: hats[hat],
  };

  return traits;
}

export async function generateNewAsset(dna: string): Promise<Buffer> {
  // parse traits id from dna
  const traits = getTraitsFromDNA(dna);
  /*const traits: Traits = {
    species: "skeleton",
    color: "golden",
    background: "balck",
    hat: "",
    eyewear: "sun"
  }*/
  // genertate 4 frames with traits id
  const frames = [];

  const encoder = new GIFEncoder(320, 480, "neuquant");
  encoder.setDelay(130);
  encoder.start();

  const canvas = createCanvas(320, 480);
  const ctx = canvas.getContext("2d");

  for (let i = 0; i < 5; i++) {
    const frameNum = i < 2 ? 1 : i > 3 ? 2 : i;
    const buffer = await createFrame(traits, frameNum);
    await new Promise<void>(async (resolve) => {
      const image = new Image();
      image.onload = () => {
        ctx.fillStyle = "#b3b3cc";
        ctx.fillRect(0, 0, 320, 480);
        ctx.drawImage(image, 0, 0);
        encoder.addFrame(ctx);
        resolve();
      };
      image.src = buffer;
    });
  }
  console.log(frames);
  encoder.finish();
  const buffer = encoder.out.getData();

  return buffer;
}

async function generateRandomNFTAsset(): Promise<void> {
  // Generate DNA
  const dna = generateRandomDNA();

  // Generate Asset
  const asset = await generateNewAsset(dna);

  // Save Asset file by dna
  const path = `./assets/${dna.toString()}.gif`;
  fs.writeFileSync(path, asset);
}

async function generateNFTAssetFromDNA(dna: string): Promise<void> {
  // Generate Asset
  const asset = await generateNewAsset(dna);

  // Save Asset file by dna
  const path = `./nfts/${dna.toString()}.gif`;
  fs.writeFileSync(path, asset);
}

export function createAllPossibleDNAs(): string[] {
  const dnaList = [];
  for (let s = 0; s < 6; s++) {
    for (let c = 0; c < 5; c++) {
      for (let e = 0; e < 5; e++) {
        for (let h = 0; h < 9; h++) {
          dnaList.push(`d${s}${c}${e}${h}`);
        }
      }
    }
  }
  return dnaList;
}

export async function createAllPossibleNFTs(): Promise<void> {
  // Create a list of all possible DNAs
  const dnaList = createAllPossibleDNAs();
  console.log(`Generating all possible NFTs: ${dnaList.length}...`);
  // Generate Asset for each DNA
  for (const dna of dnaList) {
    console.log(`Generating NFT with DNA: ${dna}`);
    await generateNFTAssetFromDNA(dna);
  }
}
