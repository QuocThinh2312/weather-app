import { CONFIG } from '../config/config';
import { API_ENDPOINTS } from '../constants/endpoints';

const API_KEY = CONFIG.API_KEY;
const BASE_URL = API_ENDPOINTS.WEATHER;

export async function fetchWeather(query, signal) {
  try {
    const url = `${BASE_URL}/forecast.json?key=${API_KEY}&q=${query}&days=3`;
    const res = await fetch(url, { signal });

    if (!res.ok) {
      const errorData = await res.json();

      // No matching location found
      if (errorData?.error?.code === 1006) {
        return null;
      }

      throw new Error(errorData?.error?.message);
    }

    return await res.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error;
    }

    console.error('Error calling API: ', error.message);
    throw new Error('Server is offline. Please try again later!');
  }
}
