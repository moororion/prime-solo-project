// src/services/foodService.js
import axios from 'axios';

const BASE_URL = 'https://world.openfoodfacts.org/api/v0/product/';

const fetchFoodDetails = async (barcode) => {
  try {
    const response = await axios.get(`${BASE_URL}${barcode}.json`);
    return response.data;  // Return the fetched data
  } catch (error) {
    console.error('Error fetching food details:', error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};

export default { fetchFoodDetails };
