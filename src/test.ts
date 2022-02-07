import dotenv from "dotenv";
import {
  createAndUploadMetadata,
  generateMetadata,
} from "./generator/metadataGenerator";
/*import * as cloudinary from "cloudinary";
import { generateJsons } from "./generator/metadataGenerator";

async function metadataTest(): Promise<void> {
  cloudinary.v2.config({
    cloud_name: "",
    api_key: "",
    api_secret: "",
  });
  const dnas = ["d01232", "d01233", "d01234"];
  const jsons = generateJsons(dnas);
  let num = 0;
  for (const json of jsons) {
    const jsonName = `assets/${num}.json`;
    const data = Buffer.from(JSON.stringify(json)).toString("base64");
    const base64String = `data:application/json;base64,${data}`;
    const res = await cloudinary.v2.uploader.upload(
      base64String,
      { public_id: jsonName, resource_type: "raw" },
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

/*void (async function () {
  console.log("Starting");
  await metadataTest();
  console.log("Done");
})();*/

async function testMetadata(dna: string) {
  const json = generateMetadata(dna);
  console.log(json);
}

dotenv.config();

console.log(process.env.CLOUD_NAME);

const json = testMetadata("d160h0");
