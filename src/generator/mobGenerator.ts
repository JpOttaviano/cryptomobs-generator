import fs from "fs";
import { Traits } from "./types";

function generateRandomDNA(): number {
  return Math.floor(Math.random() * 100);
}

async function createFrame(traits: Traits): Promise<void> {
  // retrieve traits from traits id
  // generate frame with traits
  // return frame
}

function getTraitsFromDNA(dna: number): Traits {
  // retrieve traits from dna

  // example:
  const traits: Traits = {
    color: "base",
    background: "dungeon",
    species: "skeleton",
    eyewear: "sunglasses",
  };

  return traits;
}

async function generateNewAsset(dna: number): Promise<any> {
  // parse traits id from dna
  const traits = getTraitsFromDNA(dna);
  // genertate 4 frames with traits id
  const frames = [];
  for (let i = 0; i < 4; i++) {
    frames.push(await createFrame(traits));
  }
  // clip frames toghter, generate asset
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

async function generateNFTAssetFromDNA(dna: number): Promise<void> {
  // Generate Asset
  const asset = await generateNewAsset(dna);

  // Save Asset file by dna
  const path = `./assets/${dna.toString()}.gif`;
  fs.writeFileSync(path, asset);
}

async function createAllPossibleNFTs(): Promise<void> {
  // Create a list of all possible DNAs
  const dnaList = [];
  console.log(`Generating all possible NFTs: ${dnaList.length}...`);
  // Generate Asset for each DNA
  for (const dna of dnaList) {
    console.log(`Generating NFT with DNA: ${dna}`);
    await generateNFTAssetFromDNA(dna);
  }
}
