"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const config_1 = require("./config");
async function start() {
    const app = await (0, app_1.buildApp)();
    try {
        await app.listen({ port: config_1.config.port, host: '0.0.0.0' });
        console.log(`DailyDo backend listening on port ${config_1.config.port}`);
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
}
start();
