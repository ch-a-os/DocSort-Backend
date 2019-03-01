import * as fs from "fs";
import { Request, Response } from "express";
import { Document } from "../entity/document";
import { User } from "../entity/user";
import { Tag } from "../entity/tag";
import { getNewPrimaryNumber } from "../libs/getNewPrimaryNumber";
import { getUserIDFromJWT } from "../libs/getUserIDFromJWT";
import { generateFilePath } from "../libs/generateFilePath";
import extractFileExtension from "../libs/extractFileExtension";

interface IRequestTag {
    name: string;
    logo?: string;
    colorForeground?: string;
    colorBackground?: string;
}

interface IRequestBody {
    title: string;
    note: string;
    tags: string;
}

export default async function uploadSingleDocument(req: Request, res: Response) {
    try {
        console.log("uploadDocument wurde aufgerufen");
        if (!fs.existsSync("./uploads")) {
            fs.mkdirSync("./uploads");
        }

        const userId = getUserIDFromJWT(req.headers.token.toString());
        const user = await User.findOne({ where: { id: userId }});
        const nextPrimaryNumber = await getNewPrimaryNumber();

        const requestBody: IRequestBody = req.body;
        const file: Express.Multer.File = req.file;

        const document: Document = new Document();
        document.primaryNumber = nextPrimaryNumber;
        document.secondaryNumber = 0;

        document.title = requestBody.title;
        document.note = requestBody.note;
        document.user = user;
        document.mimeType = file.mimetype;
        document.ocrEnabled = false;
        document.ocrFinished = false;
        document.ocrText = null;
        document.fileExtension = extractFileExtension(req.file.originalname);

        // Setting up TAGs
        const givenTags: Array<IRequestTag|number> = JSON.parse(requestBody.tags);
        if(givenTags != null) {
            document.tags = new Array();
            for (const tag of givenTags) {
                if(typeof tag == "number") {
                    let existingTag = await Tag.findOne({ where: { id: tag }});
                    if(existingTag != null) {
                        document.tags.push(existingTag);
                    }
                } else {
                    let newTag = new Tag();
                    console.log("debug-tag=" + JSON.stringify(tag));
                    newTag.name = tag.name;
                    if(tag.logo != null) {
                        newTag.logo = tag.logo;
                    }
                    if(tag.colorBackground != null) {
                        newTag.colorBackground = tag.colorBackground;
                    }
                    if(tag.colorForeground != null) {
                        newTag.colorForeground = tag.colorForeground;
                    }
                    newTag.user = user;
                    await newTag.save();
                    document.tags.push(newTag);
                }
            }
        }
        
        await document.save();

        const filePath = generateFilePath(document);
        fs.writeFileSync(filePath, req.file.buffer);
        
        console.log(`file written: ${filePath}`);
        await wait(4000);
        res.status(200).send({
            newID: document.uid
        });
    } catch(err) {
        res.status(500).send({message: "Please see console output for error message."});
        console.error(err);
    }
}

async function wait(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}