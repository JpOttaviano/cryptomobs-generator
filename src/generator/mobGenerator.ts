import fs from "fs";
import Jimp from "jimp";
import sharp from "sharp";
import { createCanvas, Image } from "canvas";
import GIFEncoder from "gif-encoder-2";
import { backgrounds, colors, glasses, hats, species, Traits } from "./types";
import { uploadToCloudinary } from "../upload/cloudinary";

const DIM_X = 1280;
const DIM_Y = 1920;
const PLTFRM_PATH = "./src/assets/backgrounds/platform.png";
const X_OFFSET = 0;
const Y_OFFSET = 0;

function generateRandomDNA(): string {
  return Math.floor(Math.random() * 100).toString();
}

export async function createSharpFrame(
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
  const backgroundPath = `./src/assets/backgrounds/${background}.png`;

  const composites = [];

  const yOffset = Y_OFFSET;

  composites.push({
    input: PLTFRM_PATH,
    top: yOffset,
    left: X_OFFSET,
  });

  composites.push({
    input: colorPath,
    top: yOffset,
    left: X_OFFSET,
  });

  // generate frame with traits
  if (hatPath) {
    composites.push({
      input: hatPath,
      top: yOffset,
      left: X_OFFSET,
    });
  }
  if (eyePath) {
    composites.push({
      input: eyePath,
      top: yOffset,
      left: X_OFFSET,
    });
  }
  //const image = await Jimp.read(colorPath);

  const imageBuffer = await sharp(backgroundPath)
    .composite(composites)
    .toBuffer();
  //console.log(imageBuffer);
  return imageBuffer;
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
  const backgroundPath = `./src/assets/backgrounds/${background}.png`;

  const composites = [];

  //composites.push(PLTFRM_PATH);

  composites.push(colorPath);

  // generate frame with traits
  if (hatPath) {
    composites.push(hatPath);
  }
  if (eyePath) {
    composites.push(eyePath);
  }
  //const image = await Jimp.read(colorPath);

  const image = await Jimp.read(backgroundPath);
  for (const composite of composites) {
    const compositeImage = await Jimp.read(composite);
    image.composite(compositeImage, 0, 100);
  }
  const buffer = await image.getBufferAsync(Jimp.MIME_PNG);
  console.log(buffer);
  return buffer;
}

function getTraitsFromDNA(dna: string): Traits {
  // retrieve traits from dna
  const traitNums = dna.toString().split("");
  const [, specie, color, eyewear, hat, background] = traitNums;

  // example:
  const traits: Traits = {
    color: colors[color],
    background: backgrounds[background],
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

  const encoder = new GIFEncoder(DIM_X, DIM_Y, "octree");
  encoder.setDelay(130);
  encoder.start();

  const canvas = createCanvas(DIM_X, DIM_Y);
  const ctx = canvas.getContext("2d");

  for (let i = 0; i < 5; i++) {
    const frameNum = i < 2 ? 1 : i > 3 ? 2 : i;
    const buffer = await createSharpFrame(traits, frameNum);
    await new Promise<void>(async (resolve) => {
      const image = new Image();
      image.onload = () => {
        ctx.drawImage(image, 0, 0);
        encoder.addFrame(ctx);
        resolve();
      };
      image.src = buffer;
    });
  }
  //console.log(frames);
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

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateNFTAssetFromDNA(dna: string): Promise<void> {
  // Generate Asset
  const asset = await generateNewAsset(dna);

  // Upload asset to cloudinary
  try {
    //await uploadToCloudinary(dna, asset);
    console.log("sipped upload");
  } catch (error) {
    let retry = 0;
    console.log(`[ALERT]Error uploading. retrying in 4 secs.`, error);
    await delay(3000);
    while (retry < 3) {
      console.log(`Retry: ${retry}`);
      try {
        await uploadToCloudinary(dna, asset);
        retry = 5;
      } catch (error) {
        console.log(`[ALERT]Error uploading again, retyring.`, error);
        await delay(3000);
        retry++;
      }
    }
    if (retry === 3) {
      throw new Error("[ERROR]Error uploading to cloudinary. Aborting.");
    }
  }
  //console.log(upldRes);

  // Save Asset file by dna
  const path = `./nfts/${dna.toString()}.gif`;
  fs.writeFileSync(path, asset);
}

export function createAllPossibleDNAs(): string[] {
  const dnaList = [];
  for (let s = 0; s < 5; s++) {
    for (let c = 0; c < 5; c++) {
      for (let e = 0; e < 10; e++) {
        for (let h = 0; h < 10; h++) {
          for (let b = 0; b < 4; b++) {
            dnaList.push(`d${s}${c}${e}${h}${b}`);
          }
        }
      }
    }
  }
  return dnaList;
}

export function createDnaListFromStart(start: string): string[] {
  const dnaList = createAllPossibleDNAs();
  const startIndex = dnaList.indexOf(start);
  return dnaList.slice(startIndex);
}

export async function createAllPossibleNFTs(): Promise<void> {
  // Create a list of all possible DNAs
  //const dnaList = createAllPossibleDNAs();
  const dnaList = createDnaListFromStart("d40300");
  console.log(`Generating all possible NFTs: ${dnaList.length}...`);
  // Generate Asset for each DNA
  for (const dna of dnaList) {
    console.log(`Generating NFT with DNA: ${dna}`);
    await generateNFTAssetFromDNA(dna);
  }
}
