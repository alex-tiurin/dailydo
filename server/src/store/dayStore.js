const { randomUUID } = require('crypto');

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} label
 * @property {boolean} done
 */

/**
 * @typedef {Object} Day
 * @property {string} id
 * @property {string} name
 * @property {Task[]} tasks
 * @property {string} createdAt
 */

/** @type {Map<string, Day>} */
const daysById = new Map();

/** @type {Day[]} */
const order = [];

function list() {
  return [...order];
}

/**
 * @param {{ name: string, tasks?: Array<{ label: string, done?: boolean }> }} input
 * @returns {Day}
 */
function create(input) {
  if (!input || typeof input.name !== 'string' || input.name.trim() === '') {
    const err = new Error('name is required and must be non-empty');
    err.statusCode = 400;
    throw err;
  }
  const tasks = (input.tasks || []).map((t) => ({
    id: randomUUID(),
    label: typeof t.label === 'string' ? t.label : String(t.label || ''),
    done: Boolean(t.done),
  }));
  const day = {
    id: randomUUID(),
    name: input.name.trim(),
    tasks,
    createdAt: new Date().toISOString(),
  };
  daysById.set(day.id, day);
  order.unshift(day);
  return day;
}

/**
 * @param {string} id
 * @returns {Day | undefined}
 */
function getById(id) {
  return daysById.get(id);
}

/**
 * @param {string} id
 * @param {{ name?: string, tasks?: Task[] }} input
 * @returns {Day}
 */
function update(id, input) {
  const day = daysById.get(id);
  if (!day) {
    const err = new Error('Day not found');
    err.statusCode = 404;
    throw err;
  }
  if (input.name !== undefined) {
    if (typeof input.name !== 'string' || input.name.trim() === '') {
      const err = new Error('name must be non-empty string');
      err.statusCode = 400;
      throw err;
    }
    day.name = input.name.trim();
  }
  if (input.tasks !== undefined) {
    if (!Array.isArray(input.tasks)) {
      const err = new Error('tasks must be an array');
      err.statusCode = 400;
      throw err;
    }
    day.tasks = input.tasks.map((t) => ({
      id: t.id,
      label: t.label,
      done: Boolean(t.done),
    }));
  }
  return day;
}

function reset() {
  daysById.clear();
  order.length = 0;
}

module.exports = { list, create, getById, update, reset };
