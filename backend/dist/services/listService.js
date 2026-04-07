"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListService = exports.NotFoundError = void 0;
class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
    }
}
exports.NotFoundError = NotFoundError;
class ListService {
    constructor(repo) {
        this.repo = repo;
    }
    async getAllLists() {
        return this.repo.findAll();
    }
    async getListById(id) {
        const list = await this.repo.findById(id);
        if (!list)
            throw new NotFoundError(`List ${id} not found`);
        return list;
    }
    async createList(data) {
        return this.repo.create(data);
    }
    async updateList(id, name) {
        const list = await this.repo.update(id, name);
        if (!list)
            throw new NotFoundError(`List ${id} not found`);
        return list;
    }
    async deleteList(id) {
        const deleted = await this.repo.remove(id);
        if (!deleted)
            throw new NotFoundError(`List ${id} not found`);
    }
    async updateTask(listId, taskId, data) {
        const task = await this.repo.updateTask(listId, taskId, data);
        if (!task)
            throw new NotFoundError(`Task ${taskId} not found in list ${listId}`);
        return task;
    }
}
exports.ListService = ListService;
