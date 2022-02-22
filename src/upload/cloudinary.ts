import dotenv from "dotenv";
import cloudinary from "cloudinary";

dotenv.config();

const {
  CLOUD_NAME = "",
  API_KEY = "",
  API_SECRET = "",
} = process.env;

const ASSETS_PATH = "assets";
const METADATA_PATH = "metadata";

export async function uploadJsonToCloudinary(
  json: any,
  name: string
): Promise<any> {
  const data = Buffer.from(JSON.stringify(json)).toString("base64");
  console.log(`Uploading asset: ${name}`);
  cloudinary.v2.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
  });
  const jsonName = `${METADATA_PATH}/${name}.json`;
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
      //console.log(result);
    }
  );
  return res;
}

export async function uploadGifToCloudinary(
  name: string,
  buffer: Buffer
): Promise<any> {
  // Upload asset to cloudinary
  console.log(`Uploading asset: ${name}`);
  cloudinary.v2.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
  });
  const jsonName = `${ASSETS_PATH}/${name}`;
  const data = buffer.toString("base64");
  const base64String = `data:image/gif;base64,${data}`;
  const res = await cloudinary.v2.uploader.upload(
    base64String,
    { public_id: jsonName },
    (err, result) => {
      if (err) {
        console.log(err);
      }
      //console.log(result);
    }
  );
  console.log(res);
}
