"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = require("./app");
async function startServer() {
    const app = await (0, app_1.buildApp)();
    const host = process.env.HOST?.trim() || "127.0.0.1";
    const port = Number(process.env.PORT || 3001);
    try {
        await app.listen({
            host,
            port
        });
        app.log.info(`Server listening at http://${host}:${port}`);
    }
    catch (error) {
        app.log.error(error);
        process.exitCode = 1;
    }
}
void startServer();
