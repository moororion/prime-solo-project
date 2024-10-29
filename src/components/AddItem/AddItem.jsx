import React, { useState } from 'react';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import axios from 'axios';
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
  const [loading, setLoading] = useState(false); // New loading state

  const fetchProductInfo = async (barcode) => {
    setLoading(true); // Start loading
    try {
      const response = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      setLoading(false); // Stop loading
      if (response.data && response.data.product) {
        const product = response.data.product;
        setProductInfo(product);
        setCalories(product.nutriments['energy-kcal'] || 0);
        setFat(product.nutriments.fat || 0);
        setProtein(product.nutriments.proteins || 0);
        setCarbs(product.nutriments.carbohydrates || 0);
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
      fetchProductInfo(result.text);
    }
  };

  const addToStorage = async (storageType) => {
    try {
      await axios.post(`/api/${storageType}/add`, {
        user_id: user.id, 
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
    <div className="add-item-container">
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {!scanning && !manualInput && (
        <>
          <div className="box" onClick={() => setScanning(true)}>
            <h3>Scan Barcode</h3>
          </div>
          <div className="box" onClick={() => setManualInput(true)}>
            <h3>Manually Input</h3>
          </div>
        </>
      )}

      {scanning && (
        <div className="scanner-container">
          {loading ? ( // Show loading indicator while fetching
            <div className="loading">Loading...</div>
          ) : (
            <BarcodeScannerComponent width={300} height={300} onUpdate={handleBarcodeScan} />
          )}
          <button className="cancel-btn" onClick={() => setScanning(false)}>Cancel</button>
        </div>
      )}

      {manualInput && (
        <div className="manual-input-container">
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
          <input
            type="date"
            placeholder="Date Bought"
            value={dateBought}
            onChange={(e) => setDateBought(e.target.value)}
            required
          />
          <input
            type="date"
            placeholder="Expiration Date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Calories"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Fat (g)"
            value={fat}
            onChange={(e) => setFat(e.target.value)}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Protein (g)"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Carbs (g)"
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
          />
          <button onClick={() => addToStorage('pantry')}>Add to Pantry</button>
          <button onClick={() => addToStorage('fridge')}>Add to Refrigerator</button>
          <button className="cancel-btn" onClick={() => setManualInput(false)}>Cancel</button>
        </div>
      )}

      {productInfo && (
        <div className="product-info">
          <h4>Product Name: {productInfo.product_name}</h4>
          <p>Calories: {calories} cal</p>
          <p>Fats: {fat} g</p>
          <p>Carbs: {carbs} g</p>
          <p>Protein: {protein} g</p>

          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
          <input
            type="date"
            placeholder="Date Bought"
            value={dateBought}
            onChange={(e) => setDateBought(e.target.value)}
            required
          />
          <input
            type="date"
            placeholder="Expiration Date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            required
          />
          <button onClick={() => addToStorage('pantry')}>Add to Pantry</button>
          <button onClick={() => addToStorage('fridge')}>Add to Refrigerator</button>
        </div>
      )}
    </div>
  );
}

export default AddItem;
