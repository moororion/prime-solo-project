import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Fridge.css';

function Fridge() {
  const [fridgeItems, setFridgeItems] = useState([]);

  useEffect(() => {
    fetchFridgeData();
  }, []);

  const fetchFridgeData = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/fridge', { withCredentials: true });
      setFridgeItems(response.data);
    } catch (error) {
      console.error('Error fetching fridge items:', error);
    }
  };

  const updateFridgeItemQuantity = async (id, newQuantity) => {
    try {
      await axios.put(`http://localhost:5001/api/fridge/${id}`, { quantity: newQuantity }, { withCredentials: true });
      setFridgeItems(fridgeItems.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
    } catch (error) {
      console.error('Error updating fridge quantity:', error);
    }
  };

  const deleteFridgeItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/fridge/${id}`, { withCredentials: true });
      setFridgeItems(fridgeItems.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting fridge item:', error);
    }
  };

  return (
    <div>
      <h1>Fridge Items</h1>
      {fridgeItems.length > 0 ? (
        <div className="fridge-table-container">
          <table className="fridge-table">
            <thead className="fridge-thead">
              <tr>
                <th className="fridge-th">Item Name</th>
                <th className="fridge-th">Quantity</th>
                <th className="fridge-th">Date Bought</th>
                <th className="fridge-th">Expiration Date</th>
                <th className="fridge-th">Actions</th>
              </tr>
            </thead>
            <tbody className="fridge-tbody">
              {fridgeItems.map((item) => (
                <tr key={item.id}>
                  <td className="fridge-td">{item.item_name}</td>
                  <td className="fridge-td">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateFridgeItemQuantity(item.id, parseInt(e.target.value, 10))}
                    />
                  </td>
                  <td className="fridge-td">{new Date(item.date_bought).toLocaleDateString()}</td>
                  <td className="fridge-td">{new Date(item.expiration_date).toLocaleDateString()}</td>
                  <td className="fridge-td">
                    <button onClick={() => deleteFridgeItem(item.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No fridge items found.</p>
      )}
    </div>
  );
}

export default Fridge;
