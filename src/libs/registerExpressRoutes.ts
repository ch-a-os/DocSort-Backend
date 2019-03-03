import login from "../endpoints/login";
import uploadSingleDocument from "../endpoints/uploadSingleDocument";
import getDocumentMeta from "../endpoints/getDocumentMeta";
import getDocumentFile from "../endpoints/getDocumentFile";
import { Tag } from "../entity/tag";
import { Document } from '../entity/document';
import { validateJWT } from "./validateJwt";
import getAllTags from "../endpoints/getAllTags";
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

export function registerExpressRoutes(app) {
    app.get('/login', login);
    app.post('/uploadSingleDocument', validateJWT, upload.single('singleDocument'), uploadSingleDocument);
    app.get('/getDocumentMeta/:docID', validateJWT, getDocumentMeta);
    app.get('/getDocumentFile/:docID', validateJWT, getDocumentFile);
    app.get('/getAllDocuments', validateJWT, async (req, res) => res.status(200).send(await Document.find()));
    app.get('/getAllTags', validateJWT, getAllTags);
}