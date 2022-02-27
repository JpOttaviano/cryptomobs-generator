import fs from "fs";
import {
  createAllPossibleNFTs,
  createFrame,
  generateNewAsset,
  generateSpecials,
} from "./generator/mobGenerator";
import { Traits } from "./generator/types";

async function createAll(): Promise<void> {
  await createAllPossibleNFTs();
  //await generateSpecials()
}

async function frameTest(): Promise<Buffer> {
  const traits: Traits = {
    species: "skeleton",
    color: "pink",
    background: "neondilth",
    hat: "top",
    eyewear: "goof",
  };
  const image = await createFrame(traits, 1);
  fs.writeFileSync("test.png", image);
  return image;
}

async function gifTest(): Promise<Buffer> {
  const gif = await generateNewAsset("d50000");
  console.log(gif);
  fs.writeFileSync("test.gif", gif);
  return gif;
}

/*const images = createAll().then(() => {
  console.log("succes");
});*/

//const img = gifTest();

const img = createAll();
