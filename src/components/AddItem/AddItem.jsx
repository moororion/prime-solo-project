import React, { useState } from 'react';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import axios from 'axios';
import { useSelector } from 'react-redux'; // Import useSelector for Redux state
import './AddItem.css';

function AddItem() {
  const [scanning, setScanning] = useState(false);
  const [barcode, setBarcode] = useState('');
  const [productInfo, setProductInfo] = useState(null);
  const [manualInput, setManualInput] = useState(false);
  const [productName, setProductName] = useState('');
  const [dateBought, setDateBought] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [quantity, setQuantity] = useState('');
  const [calories, setCalories] = useState('');
  const [fat, setFat] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Retrieve user ID from Redux store
  const userId = useSelector((state) => state.user?.id) || localStorage.getItem('user_id');

  const fetchProductInfo = async (barcode) => {
    setLoading(true); // Start loading
    try {
      const response = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      setLoading(false); // Stop loading
      if (response.data && response.data.product) {
        const product = response.data.product;

        // Automatically fill in the fields with product information
        setProductName(product.product_name || '');
        setCalories(product.nutriments['energy-kcal'] || '');
        setFat(product.nutriments.fat || '');
        setProtein(product.nutriments.proteins || '');
        setCarbs(product.nutriments.carbohydrates || '');

        setProductInfo(product); // Set full product info if needed
      } else {
        alert('Product not found!');
      }
    } catch (error) {
      setLoading(false); // Stop loading
      console.error('Error fetching product info:', error);
    }
  };

  const handleBarcodeScan = (err, result) => {
    if (result) {
      setBarcode(result.text);
      setScanning(false);
      fetchProductInfo(result.text); // Fetch and populate product info
    }
  };

  const addToStorage = async (storageType) => {
    try {
      await axios.post(`/api/${storageType}/add`, {
        user_id: userId,
        item_name: productName,
        quantity,
        date_bought: dateBought,
        expiration_date: expirationDate,
        calories: parseInt(calories),
        fat: parseFloat(fat),
        protein: parseFloat(protein),
        carbs: parseFloat(carbs),
      });

      setSuccessMessage(`Successfully added to ${storageType === 'pantry' ? 'pantry' : 'refrigerator'}!`);
      resetForm();
    } catch (error) {
      console.error(`Error adding item to ${storageType}:`, error.response ? error.response.data : error.message);
      setErrorMessage(`Error adding item: ${error.response?.data.message || error.message}`);
    }
  };

  const resetForm = () => {
    setProductInfo(null);
    setProductName('');
    setDateBought('');
    setExpirationDate('');
    setQuantity('');
    setCalories('');
    setFat('');
    setProtein('');
    setCarbs('');
    setSuccessMessage('');
    setErrorMessage('');
  };

  return (
    <div className="additem-container">
      {successMessage && <div className="additem-success-message">{successMessage}</div>}
      {errorMessage && <div className="additem-error-message">{errorMessage}</div>}

      {!scanning && !manualInput && (
        <>
          <div className="additem-box" onClick={() => setScanning(true)}>
            <h3>Scan Barcode</h3>
          </div>
          <div className="additem-box" onClick={() => setManualInput(true)}>
            <h3>Manually Input</h3>
          </div>
        </>
      )}

      {scanning && (
        <div className="additem-scanner-container">
          {loading ? (
            <div className="additem-loading">Loading...</div>
          ) : (
            <BarcodeScannerComponent width={300} height={300} onUpdate={handleBarcodeScan} />
          )}
          <button className="additem-cancel-btn" onClick={() => setScanning(false)}>Cancel</button>
        </div>
      )}

      {(manualInput || productInfo) && (
        <div className="additem-manual-input-container">
          <input
            type="text"
            placeholder="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            min="1"
          />
          <label htmlFor="dateBought">Date Bought</label>
          <input
            id="dateBought"
            type="date"
            value={dateBought}
            onChange={(e) => setDateBought(e.target.value)}
            required
          />
          <label htmlFor="expirationDate">Expiration Date</label>
          <input
            id="expirationDate"
            type="date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            required
          />

          {/* Labels for Nutritional Fields */}
          <label htmlFor="calories">Calories</label>
          <input
            id="calories"
            type="number"
            placeholder="Calories"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
          />
          <label htmlFor="fat">Fat (g)</label>
          <input
            id="fat"
            type="number"
            step="0.01"
            placeholder="Fat (g)"
            value={fat}
            onChange={(e) => setFat(e.target.value)}
          />
          <label htmlFor="protein">Protein (g)</label>
          <input
            id="protein"
            type="number"
            step="0.01"
            placeholder="Protein (g)"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
          />
          <label htmlFor="carbs">Carbs (g)</label>
          <input
            id="carbs"
            type="number"
            step="0.01"
            placeholder="Carbs (g)"
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
          />

          <button onClick={() => addToStorage('pantry')}>Add to Pantry</button>
          <button onClick={() => addToStorage('fridge')}>Add to Refrigerator</button>
          <button className="additem-cancel-btn" onClick={() => setManualInput(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default AddItem;
