"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApp = buildApp;
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const swagger_1 = __importDefault(require("@fastify/swagger"));
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
const pool_1 = require("./db/pool");
const listRepository_1 = require("./repositories/listRepository");
const listService_1 = require("./services/listService");
const lists_1 = require("./routes/lists");
const config_1 = require("./config");
async function buildApp(customPool) {
    const app = (0, fastify_1.default)({ logger: false });
    await app.register(cors_1.default, {
        origin: config_1.config.corsOrigin,
    });
    await app.register(swagger_1.default, {
        openapi: {
            info: {
                title: 'DailyDo API',
                description: 'Daily task tracking API',
                version: '1.0.0',
            },
            tags: [{ name: 'lists', description: 'Task lists operations' }],
        },
    });
    await app.register(swagger_ui_1.default, {
        routePrefix: '/docs',
        uiConfig: { docExpansion: 'list' },
    });
    const dbPool = customPool ?? pool_1.pool;
    const repo = new listRepository_1.ListRepository(dbPool);
    const service = new listService_1.ListService(repo);
    await app.register(lists_1.listsRoutes, { service });
    return app;
}
