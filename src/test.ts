import dotenv from "dotenv";
import {
  createAndUploadMetadata,
  generateMetadata,
} from "./generator/metadataGenerator";
import { removeExtras } from "./generator/mobGenerator";
import { uploadJsonToCloudinary } from "./upload/cloudinary";
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
  console.log(JSON.stringify(json));
}

async function uploadJson() {
  const json = JSON.parse(
    '{"description":"Monster egg waiting to hatch... what will it become?","external_url":"https://cryptomobs.world/","image":"https://res.cloudinary.com/crypt0m0b5/image/upload/assets/dxxxxx.gif","name":"Monster Egg","attributes":[{"trait_type":"type","value":"Normal"},{"trait_type":"species","value":"Egg"},{"trait_type":"eyes","value":"None"},{"trait_type":"head","value":"None"},{"trait_type":"perk","value":"None"}]}'
  );

  return await uploadJsonToCloudinary(json, "dxxxxx");
}

async function removalTest() {
  const dnaList = ["d01232", "d01233", "d01234", "d01435"];
  await removeExtras(dnaList, 62);
}

dotenv.config();

//console.log(process.env.CLOUD_NAME);

const json = removalTest();
