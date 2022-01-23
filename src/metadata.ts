import { createAndUploadMetadata } from "./generator/metadataGenerator";
import { createAllPossibleDNAs } from "./generator/mobGenerator";


void(async () => {
    const dnas = createAllPossibleDNAs()
    await createAndUploadMetadata(dnas)
})()