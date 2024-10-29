const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const nutritionController = require('../controllers/nutritionController');

router.post('/add', (req, res) => {
    const { calories, fat, protein, carbs } = req.body;

    const queryText = `
      INSERT INTO "nutrition" ("calories", "fat", "protein", "carbs")
      VALUES ($1, $2, $3, $4) RETURNING id;
    `;

    pool.query(queryText, [calories, fat, protein, carbs])
      .then(result => res.status(201).send({ success: true, id: result.rows[0].id }))
      .catch(error => {
        console.error('Error adding nutrition data:', error);
        res.status(500).send({ success: false, message: 'Failed to add nutrition data' });
      });
});

module.exports = router;
