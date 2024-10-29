import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Pantry() {
  const [pantryItems, setPantryItems] = useState([]);

  useEffect(() => {
    const fetchPantryData = async () => {
      try {
        const response = await axios.get('/api/pantry'); // Adjust the endpoint as necessary
        setPantryItems(response.data);
      } catch (error) {
        console.error('Error fetching pantry items:', error);
      }
    };

    fetchPantryData();
  }, []);

  return (
    <div>
      <h1>Pantry Items</h1>
      {pantryItems.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Date Bought</th>
              <th>Expiration Date</th>
              <th>Calories</th>
              <th>Fat (g)</th>
              <th>Protein (g)</th>
              <th>Carbs (g)</th>
            </tr>
          </thead>
          <tbody>
            {pantryItems.map((item) => (
              <tr key={item.id}>
                <td>{item.item_name}</td>
                <td>{item.quantity}</td>
                <td>{new Date(item.date_bought).toLocaleDateString()}</td>
                <td>{new Date(item.expiration_date).toLocaleDateString()}</td>
                <td>{item.calories}</td>
                <td>{item.fat}</td>
                <td>{item.protein}</td>
                <td>{item.carbs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No pantry items found.</p>
      )}
    </div>
  );
}

export default Pantry;
