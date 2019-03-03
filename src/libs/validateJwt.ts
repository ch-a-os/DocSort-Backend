import * as jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { config } from '../config';

/**
 * Express Middleware to validate user jwt-keys
 */
export function validateJWT(req: Request, res: Response, next: Function): boolean | void {
    let token = "";

    if(req.headers.token == null && req.query.token == null) {
        res.status(401).send({error: "Sorry, but you forgot to give me your token."});
        return false;
    }
    token = req.headers.token != null? req.headers.token : req.query.token;
    
    try {
        jwt.verify(token, config.secretJWT);
        next(); // Token is vaild.
    } catch(err) {
        if(err) console.error(err);
        res.status(401).send({error: "Sorry, but that token you gave me is not vaild."})
    }
}