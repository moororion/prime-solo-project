import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Expired.css';

function Expired() {
  const [expiredItems, setExpiredItems] = useState([]);

  useEffect(() => {
    fetchExpiredItems();
  }, []);

  const fetchExpiredItems = async () => {
    try {
      const pantryResponse = await axios.get('http://localhost:5001/api/pantry', { withCredentials: true });
      const fridgeResponse = await axios.get('http://localhost:5001/api/fridge', { withCredentials: true });

      const pantryItems = pantryResponse.data;
      const fridgeItems = fridgeResponse.data;

      const currentDate = new Date();
      const upcomingExpiryDate = new Date();
      upcomingExpiryDate.setDate(currentDate.getDate() + 7);

      const expiredItems = [
        ...pantryItems.filter(item => new Date(item.expiration_date) < currentDate).map(item => ({ ...item, location: 'pantry' })),
        ...fridgeItems.filter(item => new Date(item.expiration_date) < currentDate).map(item => ({ ...item, location: 'fridge' })),
        ...pantryItems.filter(item => new Date(item.expiration_date) <= upcomingExpiryDate && new Date(item.expiration_date) > currentDate).map(item => ({ ...item, location: 'pantry' })),
        ...fridgeItems.filter(item => new Date(item.expiration_date) <= upcomingExpiryDate && new Date(item.expiration_date) > currentDate).map(item => ({ ...item, location: 'fridge' })),
      ];


      setExpiredItems(expiredItems);
    } catch (error) {
      console.error('Error fetching expired items:', error);
    }
  };

  const deleteItem = async (id, location) => {
    try {
      // Send DELETE request to the backend
      await axios.delete(`http://localhost:5001/api/${location}/${id}`, { withCredentials: true });

      // Update the state to remove the deleted item from the UI
      setExpiredItems(expiredItems.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div>
      <h1>Expired / About to Expire</h1>
      {expiredItems.length > 0 ? (
        <div className="expired-table-container">
          <table className="expired-table">
            <thead>
              <tr>
                <th className="expired-th">Item Name</th>
                <th className="expired-th">Quantity</th>
                <th className="expired-th">Expiration Date</th>
                <th className="expired-th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expiredItems.map((item, index) => (
                <tr
                  key={index}
                  className={new Date(item.expiration_date) < new Date() ? 'expired-expired' : 'expired-upcoming-expiry'}
                >
                  <td className="expired-td">{item.item_name}</td>
                  <td className="expired-td">{item.quantity}</td>
                  <td className="expired-td">{new Date(item.expiration_date).toLocaleDateString()}</td>
                  <td className="expired-td">
                  <button onClick={() => deleteItem(item.id, item.location)}>Delete</button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No expired or soon-to-expire items found.</p>
      )}
    </div>
  );
}

export default Expired;
