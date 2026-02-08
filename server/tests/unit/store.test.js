const { list, create, getById, update, reset } = require('../../src/store/dayStore.js');

beforeEach(() => {
  reset();
});

describe('dayStore', () => {
  describe('list', () => {
    it('returns empty array when no days', () => {
      expect(list()).toEqual([]);
    });

    it('returns days newest first', () => {
      const a = create({ name: 'First' });
      const b = create({ name: 'Second' });
      const result = list();
      expect(result.map((d) => d.name)).toEqual(['Second', 'First']);
    });
  });

  describe('create', () => {
    it('creates day with id, name, tasks, createdAt', () => {
      const day = create({ name: 'Today' });
      expect(day.id).toBeDefined();
      expect(day.name).toBe('Today');
      expect(day.tasks).toEqual([]);
      expect(day.createdAt).toBeDefined();
    });

    it('creates day with initial tasks', () => {
      const day = create({ name: 'X', tasks: [{ label: 'Task 1' }] });
      expect(day.tasks).toHaveLength(1);
      expect(day.tasks[0].label).toBe('Task 1');
      expect(day.tasks[0].done).toBe(false);
    });

    it('throws when name is missing', () => {
      expect(() => create({})).toThrow();
    });

    it('throws when name is empty', () => {
      expect(() => create({ name: '' })).toThrow();
    });
  });

  describe('getById', () => {
    it('returns day when exists', () => {
      const created = create({ name: 'Test' });
      expect(getById(created.id)).toEqual(created);
    });

    it('returns undefined when not found', () => {
      expect(getById('non-existent')).toBeUndefined();
    });
  });

  describe('update', () => {
    it('updates tasks (mark done)', () => {
      const day = create({ name: 'D', tasks: [{ label: 'T1' }] });
      const task = day.tasks[0];
      const updated = update(day.id, { tasks: [{ ...task, done: true }] });
      expect(updated.tasks[0].done).toBe(true);
    });

    it('throws 404 when day not found', () => {
      expect(() => update('non-existent', { tasks: [] })).toThrow('Day not found');
    });
  });
});
