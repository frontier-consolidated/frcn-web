import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import express, { type Express, type NextFunction, type Request, type Response } from "express";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function createCmsApp() {
    const app = express();
    
    app.get("/health", (_req, res) => {
        res.setHeader("Cache-Control", "private, no-cache, no-store, max-ages=0");
        res.sendStatus(200);
    });

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    const files = fs.readdirSync(path.join(__dirname, "routes"), {
        encoding: "utf-8",
        withFileTypes: true,
    });

    for (const file of files) {
        if (!file.isFile()) continue;

        const module = (await import(path.join(file.path, file.name))) as {
        default: (app: Express) => void;
        };
        module.default(app);
    }

    app.use((err: Error | Error[], req: Request, res: Response, _next: NextFunction) => {
        const errors = Array.isArray(err) ? err : [err];
        for (const error of errors) {
        console.error(error);
        }
    
        res.sendStatus(500);
    });

    return { app };
}
