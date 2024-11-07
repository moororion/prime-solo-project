import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './pantry.css';

function Pantry() {
  const [pantryItems, setPantryItems] = useState([]);

  useEffect(() => {
    fetchPantryData();
  }, []);

  const fetchPantryData = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/pantry', { withCredentials: true });
      setPantryItems(response.data);
    } catch (error) {
      console.error('Error fetching pantry items:', error);
    }
  };

  const updatePantryItemQuantity = async (id, newQuantity) => {
    try {
      await axios.put(`http://localhost:5001/api/pantry/${id}`, { quantity: newQuantity }, { withCredentials: true });
      setPantryItems(pantryItems.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
    } catch (error) {
      console.error('Error updating pantry quantity:', error);
    }
  };

  const deletePantryItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/pantry/${id}`, { withCredentials: true });
      setPantryItems(pantryItems.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting pantry item:', error);
    }
  };

  return (
    <div>
      <h1>Pantry Items</h1>
      {pantryItems.length > 0 ? (
        <div className="pantry-table-container">
          <table className="pantry-table">
            <thead className="pantry-thead">
              <tr>
                <th className="pantry-th">Item Name</th>
                <th className="pantry-th">Quantity</th>
                <th className="pantry-th">Date Bought</th>
                <th className="pantry-th">Expiration Date</th>
                <th className="pantry-th">Actions</th>
              </tr>
            </thead>
            <tbody className="pantry-tbody">
              {pantryItems.map((item) => (
                <tr key={item.id} className="pantry-row">
                  <td className="pantry-td">{item.item_name}</td>
                  <td className="pantry-td">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updatePantryItemQuantity(item.id, parseInt(e.target.value, 10))}
                    />
                  </td>
                  <td className="pantry-td">{new Date(item.date_bought).toLocaleDateString()}</td>
                  <td className="pantry-td">{new Date(item.expiration_date).toLocaleDateString()}</td>
                  <td className="pantry-td">
                    <button onClick={() => deletePantryItem(item.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No pantry items found.</p>
      )}
    </div>
  );
}

export default Pantry;
