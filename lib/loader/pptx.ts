import { PPTXLoader } from "@langchain/community/document_loaders/fs/pptx";
import type { FileMeta } from "./meta";

export default async function load(meta: FileMeta) {
    const loader = new PPTXLoader(meta.filepath);
    const docs = await loader.load();
    for (const doc of docs) {
        doc.metadata.source = meta.originalFilename
    }
    return docs;
}