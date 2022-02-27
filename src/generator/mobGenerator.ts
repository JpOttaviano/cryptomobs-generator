import fs from "fs";
import Jimp from "jimp";
import sharp from "sharp";
import { createCanvas, Image } from "canvas";
import GIFEncoder from "gif-encoder-2";
import {
  backgrounds,
  colors,
  glasses,
  hats,
  perks,
  species,
  Traits,
} from "./types";
import { createAndUploadMetadata, removeMetadata } from "./metadataGenerator";

const DIM_X = 1280;
const DIM_Y = 1920;
const PLTFRM_PATH = "./src/assets/backgrounds/platform118.png";
const X_OFFSET = 0;
const Y_OFFSET = 0;

function spliceIntoChunks(arr: string[], chunkSize: number): string[][] {
  const res = [];
  while (arr.length > 0) {
    const chunk = arr.splice(0, chunkSize);
    res.push(chunk);
  }
  return res;
}

function generateRandomDNA(): string {
  return Math.floor(Math.random() * 100).toString();
}

export async function createSharpFrame(
  traits: Traits,
  index: number,
  bcIndex: number,
  specIndex: number,
  mimicIndex: number
): Promise<Buffer> {
  // retrieve traits from traits id
  const { color, background, species, eyewear, hat, perk } = traits;
  const mobPath = `./src/assets/mobs/${species}`;
  const colorPath =
    color !== "rainbow"
      ? species != "mimic"
        ? `${mobPath}/body/${color}/${index}.png`
        : `${mobPath}/body/${color}/${mimicIndex}.png`
      : `${mobPath}/body/${color}/${specIndex}.png`;
  const eyePath =
    eyewear != "" ? `${mobPath}/glasses/${eyewear}/${index}.png` : undefined;
  const hatPath = hat != "" ? `${mobPath}/hats/${hat}/${index}.png` : undefined;
  const extrPath =
    perk !== ""
      ? perk != "bloodCircle"
        ? `./src/assets/extras/${perk}/${index}.png`
        : `./src/assets/extras/${perk}/${bcIndex}.png`
      : undefined;
  const backgroundPath = `./src/assets/backgrounds/${background}.png`;
  const composites = [];

  const yOffset = Y_OFFSET;

  composites.push({
    input: PLTFRM_PATH,
    top: yOffset,
    left: X_OFFSET,
  });

  if (extrPath && perk != "wings") {
    composites.push({
      input: extrPath,
      top: yOffset,
      left: X_OFFSET,
    });
  }

  if (perk == "bloodCircle") {
    composites.push({
      input: `./src/assets/extras/summonCircle/${index}.png`,
      top: yOffset,
      left: X_OFFSET,
    });
  }

  composites.push({
    input: colorPath,
    top: yOffset,
    left: X_OFFSET,
  });

  if (perk == "wings") {
    composites.push({
      input: extrPath,
      top: yOffset,
      left: X_OFFSET,
    });
  }

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
  let imageBuffer;
  try {
    imageBuffer = await sharp(backgroundPath).composite(composites).toBuffer();
  } catch (error) {
    console.log(error);
  }
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
  const [, specie, color, eyewear, hat, perk] = traitNums;

  // Get Random or looped background?
  const bckgId = Math.floor(Math.random() * backgrounds.length);

  // example:
  const traits: Traits = {
    color: colors[color],
    background: backgrounds[bckgId],
    species: species[specie],
    perk: perks[perk],
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
  encoder.setDelay(150);
  encoder.start();

  const canvas = createCanvas(DIM_X, DIM_Y);
  const ctx = canvas.getContext("2d");

  // Rainbow slime contains 13 frames for a full loop
  const frameAmnt =
    traits.color != "rainbow" ? (traits.species != "mimic" ? 5 : 6) : 13;

  const frameNums = [1, 2, 3, 2, 1, 2, 3, 2, 1, 2, 3, 2, 1];
  const mimicFrames = [1, 2, 3, 4, 3, 2, 1];
  let bcIndex = 0;

  for (let i = 0; i < frameAmnt; i++) {
    bcIndex = bcIndex < 4 ? bcIndex + 1 : 1;
    const specIndex = i + 1;
    const buffer = await createSharpFrame(
      traits,
      frameNums[i],
      bcIndex,
      specIndex,
      mimicFrames[i]
    );
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
    //await uploadGifToCloudinary(dna, asset);
    console.log("skipped upload");
  } catch (error) {
    let retry = 0;
    console.log(`[ALERT]Error uploading. retrying in 4 secs.`, error);
    await delay(3000);
    while (retry < 3) {
      console.log(`Retry: ${retry}`);
      try {
        //await uploadGifToCloudinary(dna, asset);
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

/**
 * Generate a string[] list of all possible dnas
 * @returns dna list
 */
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

/**
 * Create dna list from starting dna (included)
 * @param start
 * @returns dna list
 */
export function createDnaListFromStart(start: string): string[] {
  const dnaList = createAllPossibleDNAs();
  const startIndex = dnaList.indexOf(start);
  return dnaList.slice(startIndex);
}

async function generateNFTAssetFromDNAList(dnaList: string[]): Promise<void> {
  for (const dna of dnaList) {
    console.log(`Generating NFT with DNA: ${dna}`);
    await generateNFTAssetFromDNA(dna);
  }
  await createAndUploadMetadata(dnaList);
}

/**
 * Generate specials assets and replace in dna lists
 * Specials are:
 *  - rainbow slime (d16xxx) 5
 *  - demoness wings (d4xxx4) 5
 *  - crimson skeleton (d05xxx) 20
 *  - clown sekeleton (d0xc0x) 5
 *  - halo (dxxxhx) 15
 *  - gaming (dxx0gx) 10
 *  - mimic chest (d57000) only 1
 *  - mimic toilette (d58000) only 1
 *  - egg (d60000) only 1 added manually
 *
 * 63 specials
 *
 * rainbow has 13 frames.
 * mimic and toilette have only 1 model * perks. no hats or eyewear
 * crimson and rainbow replace colors
 * halo and gaming replace hats, no eyewear for gaming
 * sekele clown mask replaces eyewear, no hats
 * demoness wings replaces perk
 *
 * 62 specials to count
 *
 * after all is done, we need to manually remove 62
 *
 * egg and egg metadata d60000 are added and uploaded manually already
 * @param dnaList
 */
export async function generateSpecials(): Promise<number> {
  const rnbSlimesDnas = ["d16000", "d16001", "d16030", "d16040", "d160h0"];
  const demonessWingsDnas = ["d40004", "d41004", "d42004", "d43004", "d44004"];
  const crmsonSkeleDnas = [
    "d05000",
    "d05001",
    "d05002",
    "d05003",
    "d05100",
    "d05100",
    "d05300",
    "d05400",
    "d05600",
    "d05700",
    "d05800",
    "d05900",
    "d05500",
    "d05200",
    "d05050",
    "d05010",
    "d05030",
    "d05040",
    "d050g0",
    "d050h0",
  ];
  const clownSkeleDnas = ["d00c00", "d01c00", "d02c00", "d03c00", "d04c00"];
  const haloDnas = [
    "d000h0",
    "d010h0",
    "d021h0",
    "d123h0",
    "d145h0",
    "d127h0",
    "d218h0",
    "d233h0",
    "d224h0",
    "d329h0",
    "d342h0",
    "d318h0",
    "d419h0",
    "d434h0",
    "d443h0",
  ];
  const gamingDnas = [
    "d010g0",
    "d140g0",
    "d220g0",
    "d300g0",
    "d447g0",
    "d030g0",
    "d120g0",
    "d204g0",
    "d345g0",
    "d410g0",
  ];
  const mimicChestDnas = ["d50000"];
  const mimicToiletteDnas = ["d57000"];
  const specialDnas = [
    ...rnbSlimesDnas,
    ...demonessWingsDnas,
    ...crmsonSkeleDnas,
    ...clownSkeleDnas,
    ...haloDnas,
    ...gamingDnas,
    ...mimicChestDnas,
    ...mimicToiletteDnas,
  ];

  /*const mimics = [
    ...mimicChestDnas,
    ...mimicToiletteDnas,
  ]*/
  console.log(`Generating specials, ${specialDnas.length} + 1`);
  await generateNFTAssetFromDNAList(specialDnas);

  //await createAndUploadMetadata(specialDnas);
  return specialDnas.length;
}

function deleteAsset(dna: string) {
  const path = `./nfts/${dna}.gif`;
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
    removeMetadata(dna);
  }
}

/**
 * Remove extra jsons generated files and gifs. Even though uploaded, they wont be accesible.
 * @param dnaList complete list to randomly iterate and remove
 */
export async function removeExtras(
  dnaList: string[],
  specNum: number
): Promise<void> {
  if (specNum !== 63) {
    throw new Error(
      `[ERROR]Specials number is not 63, generated ${specNum}. Please assess removal accordingly out of ${dnaList.length} assets`
    );
  }
  console.log(`Removing extras, ${dnaList.length}`);
  let deletedAssets = 0;
  const randomDnas = [];
  for (let i = 0; i < 63; i++) {
    const randomIndex = Math.floor(Math.random() * dnaList.length);
    const assetToDelete = dnaList[randomIndex];
    randomDnas.push(dnaList[randomIndex]);
    dnaList.splice(randomIndex, 1);
    try {
      deleteAsset(assetToDelete);
    } catch (e) {
      console.log(e);
      throw new Error(
        `[ERROR] Deleting asset ${assetToDelete}. Deleted ${deletedAssets} of 63 assets. Please manually delete remaining ${
          63 - deletedAssets
        } assets.`
      );
    }
    deletedAssets++;
  }
}

async function generateNFTAssetsFromDNAList(
  dnaList: string[],
  order: number
): Promise<void> {
  // Generate Asset for each DNA
  for (const dna of dnaList) {
    console.log(`Generating NFT with DNA: ${dna}`);
    await generateNFTAssetFromDNA(dna);
  }
  console.log(`Finished generating NFTs for order: ${order}`);
}

/**
 * Generate, upload and save all possible NFTS
 */
export async function createAllPossibleNFTs(): Promise<void> {
  // Create a list of all possible DNAs
  //const dnaList = createAllPossibleDNAs();
  const dnaList = createDnaListFromStart("d00000");

  // Select 63 (or n) random items from the list

  /*for (let i = 0; i < 63; i++) {
    const randomIndex = Math.floor(Math.random() * dnaList.length);
    randomDnas.push(dnaList[randomIndex]);
    dnaList.splice(randomIndex, 1);
  }*/
  //console.log(`NFTs reomved for specials:${randomDnas}`);
  console.log(`Generating all possible NFTs: ${dnaList.length}...`);
  // Generate Asset for each DNA
  await generateNFTAssetFromDNAList(dnaList);

  // Generate specials replacing removed values
  console.log(`Generating specials...`);
  const specialsNum = await generateSpecials();
  const removeNum = specialsNum + 1;
  console.log(
    `Removing extras: ${removeNum} <- thhis number should be 63. SI NO ES 63 ALGO ANDA MAL`
  );
  // Remove extras
  await removeExtras(dnaList, removeNum);
}
