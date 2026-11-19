import { normalizeLocationQuery } from '../utils/normalizeLocationQuery';

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;

export async function fetchWeather(query) {
  const cleanQuery = normalizeLocationQuery(query);

  try {
    const res = await fetch(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${cleanQuery}&days=3`);

    if (!res.ok) {
      throw new Error('Unable to retrieve weather data.');
    }

    return await res.json();
  } catch (error) {
    console.error('Error calling API: ', error);

    if (error.name === 'AbortError') {
      throw error;
    }

    return null;
  }
}
