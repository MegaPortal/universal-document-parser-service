import { TextLoader } from "langchain/document_loaders/fs/text";
import type { FileMeta } from "./meta";

export default async function load(meta: FileMeta) {
    const loader = new TextLoader(meta.filepath);
    const docs = await loader.load();
    for (const doc of docs) {
        doc.metadata.source = meta.originalFilename;
    }
    return docs;
}