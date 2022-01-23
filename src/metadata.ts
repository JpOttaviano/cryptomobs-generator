import { createAndUploadMetadata, createAndUploadMetadataRngId } from "./generator/metadataGenerator";
import { createAllPossibleDNAs } from "./generator/mobGenerator";

void (async () => {
  const dnas = createAllPossibleDNAs();
  await createAndUploadMetadataRngId(dnas);
})();
