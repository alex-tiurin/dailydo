const express = require('express');
const store = require('../store/dayStore.js');

const router = express.Router();

router.get('/', (req, res) => {
  const days = store.list();
  res.json(days);
});

router.post('/', (req, res) => {
  try {
    const day = store.create(req.body);
    res.status(201).json(day);
  } catch (err) {
    const status = err.statusCode || 400;
    res.status(status).json({ error: err.message || 'Bad request' });
  }
});

router.get('/:dayId', (req, res) => {
  const day = store.getById(req.params.dayId);
  if (!day) return res.status(404).json({ error: 'Day not found' });
  res.json(day);
});

router.patch('/:dayId', (req, res) => {
  try {
    const day = store.update(req.params.dayId, req.body);
    res.json(day);
  } catch (err) {
    const status = err.statusCode || 400;
    res.status(status).json({ error: err.message || 'Bad request' });
  }
});

module.exports = router;
