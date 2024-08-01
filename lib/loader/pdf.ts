import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import type { FileMeta } from "./meta";

export default async function load(meta: FileMeta) {
    const loader = new PDFLoader(meta.filepath, {
        splitPages: true,
    });
    const docs = await loader.load();
    for (const doc of docs) {
        doc.metadata.source = meta.originalFilename;
    }
    return docs;
}