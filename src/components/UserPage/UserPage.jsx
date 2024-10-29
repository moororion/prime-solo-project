import React from 'react';
import LogOutButton from '../LogOutButton/LogOutButton';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import './UserPage.css'; // Adding a separate CSS file for styling

function UserPage() {
  const user = useSelector((store) => store.user);
  const history = useHistory(); // To navigate between pages

  // Handlers for navigation
  const goToPantry = () => history.push('/pantry');
  const goToFridge = () => history.push('/fridge');
  const goToExpired = () => history.push('/expired');
  const goToAddItem = () => history.push('/add-item');

  return (
    <div className="container">
      <h2>Welcome, {user.username}!</h2>
      <p>Your ID is: {user.id}</p>

      <div className="box-container">
        {/* Expired/About to expire box */}
        <div className="box expired" onClick={goToExpired}>
          <h3>Expired/About to Expire</h3>
        </div>

        <div className="row">
          {/* Pantry box */}
          <div className="box pantry" onClick={goToPantry}>
            <h3>Pantry</h3>
          </div>

          {/* Refrigerator box */}
          <div className="box refrigerator" onClick={goToFridge}>
            <h3>Refrigerator</h3>
          </div>
        </div>

        {/* Add Item box */}
        <div className="box add-item" onClick={goToAddItem}>
          <h3>Add Item</h3>
        </div>
      </div>

      <LogOutButton className="btn" />
    </div>
  );
}

export default UserPage;
