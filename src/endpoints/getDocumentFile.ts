import { Document } from "../entity/document";
import * as fs from 'fs';
import { generateFilePath } from "../libs/generateFilePath";

export default async function getDocumentFile(req: any, res: any) {
    const docID: number = req.params.docID;
    if(docID == null) {
        res.status(400).send();
        return;
    }

    const doc: Document = await Document.findOne({ where: { uid: docID }});
    const filepath = generateFilePath(doc);
    const docFile = fs.readFileSync(filepath);
    res.status(200).send(docFile);
}