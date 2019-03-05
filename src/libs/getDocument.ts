import { readFile } from "fs";
import { generateFilePath } from "./generateFilePath";
import { Document } from "../entity/document";

export async function getDocumentBuffer(doc: Document): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
        readFile(generateFilePath(doc), (err, data) => {
            if(err) reject(err);
            resolve(data);
        })    
    })
}