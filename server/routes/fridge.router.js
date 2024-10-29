const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

router.post('/add', (req, res) => {
  const { user_id, item_name, quantity, date_bought, expiration_date, calories, fat, protein, carbs } = req.body;

  const queryText = `
    INSERT INTO "fridge" ("user_id", "item_name", "quantity", "date_bought", "expiration_date", "calories", "fat", "protein", "carbs")
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id;
  `;

  pool.query(queryText, [user_id, item_name, quantity, date_bought, expiration_date, calories, fat, protein, carbs])
    .then(result => res.status(201).send({ success: true, message: 'Item successfully added to fridge', id: result.rows[0].id }))
    .catch(error => {
        console.error('Error adding item to fridge:', error.message, error.stack);
        res.status(500).send({ success: false, message: 'Failed to add item to fridge' });
    });
});

module.exports = router;
