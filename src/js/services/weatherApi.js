const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;

export async function fetchWeather(locationQuery) {
  try {
    const res = await fetch(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${locationQuery}&days=3`);

    if (!res.ok) {
      throw new Error('Unable to retrieve weather data.');
    }

    return await res.json();
  } catch (error) {
    console.error('Error calling API: ', error);
    return null;
  }
}
