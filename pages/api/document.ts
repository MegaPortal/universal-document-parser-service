import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import loadPdf from '@/lib/loader/pdf';
import loadDocx from '@/lib/loader/docx';
import loadPptx from '@/lib/loader/pptx';
import loadText from '@/lib/loader/txt';
import { Document } from '@langchain/core/documents';

export const config = {
    api: {
        bodyParser: false,
    },
};

const uploadDir = '/tmp/universal-document-parser-service/uploads';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    try {
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const form = new IncomingForm({ uploadDir, keepExtensions: true });

        const [fields, files] = await form.parse(req);

        const documents: {
            [key: string]: Document<Record<string, any>>[];
        } = {};

        for (const persistentFiles of Object.values(files)) {
            if (!Array.isArray(persistentFiles)) {
                continue;
            }
            for (const file of Object.values(persistentFiles)) {
                const fileName = file.originalFilename || file.newFilename;
                const filePath = file.filepath;
                const mimeType = file.mimetype;
                const extension = path.extname(fileName).toLowerCase();

                console.log('fileName:', fileName, 'filePath:', filePath, 'mimeType:', mimeType);

                if (!fileName || !filePath || !mimeType) {
                    continue;
                }

                const meta = {
                    originalFilename: fileName,
                    newFilename: file.newFilename,
                    filepath: filePath,
                    mimetype: mimeType,
                };

                // if it is a pdf file
                if (extension === '.pdf') {
                    const documentsParsed = await loadPdf(meta);
                    documents[fileName] = documentsParsed;
                    continue;
                }

                // if it is a docx file
                if (extension === '.docx') {
                    const documentsParsed = await loadDocx(meta);
                    documents[fileName] = documentsParsed;
                    continue;
                }

                // if it is a ppt or pptx file
                if (extension === '.pptx') {
                    const documentsParsed = await loadPptx(meta);
                    documents[fileName] = documentsParsed;
                    continue;
                }

                if (extension === '.txt') {
                    const documentsParsed = await loadText(meta);
                    documents[fileName] = documentsParsed;
                    continue;
                }

                documents[fileName] = [];
            }
        }

        // remove all the files in uploads directory
        await fs.promises.rmdir(uploadDir, { recursive: true });

        return res.status(200).json(documents);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export default handler;