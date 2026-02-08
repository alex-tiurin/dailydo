const request = require('supertest');
const app = require('../../src/app.js');
const store = require('../../src/store/dayStore.js');

beforeEach(() => {
  store.reset();
});

describe('GET /days', () => {
  it('returns empty array when no days', async () => {
    const res = await request(app).get('/days');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('returns days newest first', async () => {
    store.create({ name: 'First' });
    store.create({ name: 'Second' });
    const res = await request(app).get('/days');
    expect(res.status).toBe(200);
    expect(res.body.map((d) => d.name)).toEqual(['Second', 'First']);
  });
});

describe('POST /days', () => {
  it('creates day and returns 201', async () => {
    const res = await request(app).post('/days').send({ name: 'Today' });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.name).toBe('Today');
    expect(res.body.tasks).toEqual([]);
    expect(res.body.createdAt).toBeDefined();
  });

  it('creates day with tasks', async () => {
    const res = await request(app)
      .post('/days')
      .send({ name: 'X', tasks: [{ label: 'L1' }] });
    expect(res.status).toBe(201);
    expect(res.body.tasks).toHaveLength(1);
    expect(res.body.tasks[0].label).toBe('L1');
    expect(res.body.tasks[0].done).toBe(false);
  });

  it('returns 400 when name missing', async () => {
    const res = await request(app).post('/days').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});

describe('GET /days/:dayId', () => {
  it('returns 200 and day when exists', async () => {
    const created = store.create({ name: 'Test' });
    const res = await request(app).get(`/days/${created.id}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(created.id);
    expect(res.body.name).toBe('Test');
  });

  it('returns 404 when not found', async () => {
    const res = await request(app).get('/days/non-existent');
    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });
});

describe('PATCH /days/:dayId', () => {
  it('updates day and returns 200', async () => {
    const created = store.create({ name: 'D', tasks: [{ label: 'T1' }] });
    const task = created.tasks[0];
    const res = await request(app)
      .patch(`/days/${created.id}`)
      .send({ tasks: [{ id: task.id, label: task.label, done: true }] });
    expect(res.status).toBe(200);
    expect(res.body.tasks[0].done).toBe(true);
  });

  it('returns 404 when day not found', async () => {
    const res = await request(app).patch('/days/non-existent').send({ tasks: [] });
    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });
});
