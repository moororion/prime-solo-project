const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

// GET route to retrieve fridge items
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM fridge WHERE user_id = $1 ORDER BY expiration_date ASC', [req.user.id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error retrieving fridge items:', error);
    res.status(500).send('Server error retrieving fridge items');
  }
});

// POST route to add a new item to the fridge
router.post('/add', async (req, res) => {
  const { item_name, quantity, date_bought, expiration_date, calories, fat, protein, carbs } = req.body;
  const userId = req.user.id;

  try {
    const queryText = `
      INSERT INTO fridge (user_id, item_name, quantity, date_bought, expiration_date, calories, fat, protein, carbs)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;
    `;
    const result = await pool.query(queryText, [userId, item_name, quantity, date_bought, expiration_date, calories, fat, protein, carbs]);
    res.status(201).json(result.rows[0]); // Respond with the new item
  } catch (error) {
    console.error('Error adding fridge item:', error);
    res.status(500).send('Server error adding fridge item');
  }
});

// DELETE route to remove fridge item by ID
router.delete('/:id', async (req, res) => {
  const itemId = req.params.id;

  try {
    const queryText = 'DELETE FROM fridge WHERE id = $1 AND user_id = $2';
    const result = await pool.query(queryText, [itemId, req.user.id]);

    if (result.rowCount > 0) {
      res.sendStatus(204); // Item deleted successfully
    } else {
      res.sendStatus(404); // Item not found
    }
  } catch (error) {
    console.error('Error deleting fridge item:', error);
    res.status(500).send('Server error deleting fridge item');
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    const queryText = 'UPDATE fridge SET quantity = $1 WHERE id = $2';
    await pool.query(queryText, [quantity, id]);
    res.sendStatus(204);
  } catch (error) {
    console.error('Error updating fridge quantity:', error);
    res.status(500).send('Server error');
  }
});


module.exports = router;
