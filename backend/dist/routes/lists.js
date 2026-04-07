"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listsRoutes = listsRoutes;
const listService_1 = require("../services/listService");
function handleError(err, reply) {
    if (err instanceof listService_1.NotFoundError) {
        reply.status(404).send({ error: err.message });
        return;
    }
    reply.status(500).send({ error: 'Internal server error' });
}
async function listsRoutes(app, options) {
    const { service } = options;
    // GET /api/lists
    app.get('/api/lists', async (_req, reply) => {
        const lists = await service.getAllLists();
        reply.status(200).send(lists);
    });
    // POST /api/lists
    app.post('/api/lists', {
        schema: {
            body: {
                type: 'object',
                required: ['name', 'tasks'],
                properties: {
                    name: { type: 'string', minLength: 1 },
                    tasks: {
                        type: 'array',
                        items: {
                            type: 'object',
                            required: ['name'],
                            properties: { name: { type: 'string', minLength: 1 } },
                        },
                    },
                },
            },
        },
    }, async (req, reply) => {
        try {
            const list = await service.createList(req.body);
            reply.status(201).send(list);
        }
        catch (err) {
            handleError(err, reply);
        }
    });
    // GET /api/lists/:id
    app.get('/api/lists/:id', async (req, reply) => {
        try {
            const list = await service.getListById(req.params.id);
            reply.status(200).send(list);
        }
        catch (err) {
            handleError(err, reply);
        }
    });
    // PUT /api/lists/:id
    app.put('/api/lists/:id', {
        schema: {
            body: {
                type: 'object',
                required: ['name'],
                properties: { name: { type: 'string', minLength: 1 } },
            },
        },
    }, async (req, reply) => {
        try {
            const list = await service.updateList(req.params.id, req.body.name);
            reply.status(200).send(list);
        }
        catch (err) {
            handleError(err, reply);
        }
    });
    // DELETE /api/lists/:id
    app.delete('/api/lists/:id', async (req, reply) => {
        try {
            await service.deleteList(req.params.id);
            reply.status(204).send();
        }
        catch (err) {
            handleError(err, reply);
        }
    });
    // PATCH /api/lists/:id/tasks/:taskId
    app.patch('/api/lists/:id/tasks/:taskId', {
        schema: {
            body: {
                type: 'object',
                properties: {
                    done: { type: 'boolean' },
                    name: { type: 'string', minLength: 1 },
                },
            },
        },
    }, async (req, reply) => {
        try {
            const task = await service.updateTask(req.params.id, req.params.taskId, req.body);
            reply.status(200).send(task);
        }
        catch (err) {
            handleError(err, reply);
        }
    });
}
