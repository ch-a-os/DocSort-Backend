import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as http from 'http';

export default function createExpressServer() {
    const app = express();
    const server = http.createServer(app);
    app.use(bodyParser.json());
    app.use(cors());
    return { app, server };
}