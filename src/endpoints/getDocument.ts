import { Request, Response } from "express";
import { Document } from "../entity/document";
import { getDocumentBuffer } from "../libs/getDocument";
import { getConnection } from "typeorm";
import { User } from "../entity/user";
import { getUserIDFromJWT } from "../libs/getUserIDFromJWT";

/**
 * If param 'docID' is not set, all documents get returned to `res`.
 * If query 'file' is set to true, the binary file gets attached for each document.
 * If query 'limit' is set to any value >0, only that many document gets returned. (only usable If 'docID' is null)
 * Query 'order' can be set to 0 (latest) or 1 (oldest).
 * 
 * Example: /getDocument/3?file=true                        - Returns document with ID 3 and with binary data
 *          /getDocuemnt/?file=true&limit=5&order=0         - Returns latest five documents
 */
export async function getDocument(req: Request, res: Response) {
    try {
        const docID: number = req.params.docID;
        const file: boolean = req.query.file;
        const limit: number = req.query.limit;
        const order: number = req.query.order;  // 0 means latest, 1 means oldest
        const all: boolean = (docID == null);   // true If ID is not given
        const user: User = await User.findOne({where: {id: getUserIDFromJWT(<any> req.headers.token || req.query.token)}});
    
        // First, return one document If provided
        if(!all) {
            const singleDocument = await Document.findOne({where: { uid: docID}});
            if(file) {
                const file: Buffer = await getDocumentBuffer(singleDocument);
                console.log("Hab buffer")
                res.status(200).send({
                    meta: singleDocument,
                    file: file
                })
                return true;
            } else {
                res.status(200).send({meta: singleDocument})
                return true;
            }
        } else {
            // Return all files
            const orderingType = order == 0 ? 'DESC' : 'ASC';
            const documents = await getConnection()
                .getRepository(Document)
                .createQueryBuilder("document")
                .where(`document.userId = ${user.id}`)
                .orderBy(`document.createdAt`, orderingType)
                .take(limit)
                .getMany();
            if(file) {
                const files = [];
                for(let i = 0; i < documents.length; i++) {
                    const currentDocument: Document = documents[i];
                    const file: Buffer = await getDocumentBuffer(currentDocument);
                    files.push({
                        forDoc: currentDocument.uid,
                        file: file
                    });
                }
                res.status(200).send({
                    metas: documents,
                    files: files
                });
            } else {
                res.status(200).send({
                    metas: documents
                });
            }
        }    
    } catch(err) {
        console.error(err);
        res.status(500).send({error: "Please see console output for error message."})
    }
}