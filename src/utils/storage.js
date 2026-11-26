export const STORAGE_KEYS = {
  LAST_SEARCHED_CITY: 'lastSearchedCity',
  CACHED_WEATHER_DATA: 'cachedWeatherData',
};

const storedData = JSON.parse(localStorage.getItem(STORAGE_KEYS.CACHED_WEATHER_DATA)) ?? [];
export const cachedWeatherData = new Map(storedData);

export function storeWeatherData(query, weatherData) {
  localStorage.setItem(STORAGE_KEYS.LAST_SEARCHED_CITY, query);

  if (!hasCachedData(query)) {
    const newWeatherData = {
      data: weatherData,
      expiresAt: Date.now() + 60 * 5 * 1000,
    };
    cachedWeatherData.set(query, newWeatherData);
    localStorage.setItem(STORAGE_KEYS.CACHED_WEATHER_DATA, JSON.stringify([...cachedWeatherData]));
  }
}

export function hasCachedData(query) {
  if (cachedWeatherData.has(query)) {
    const weatherData = cachedWeatherData.get(query);
    const now = Date.now();

    //Delete expired data
    if (weatherData.expiresAt <= now) {
      cachedWeatherData.delete(query);
      return false;
    }

    return true;
  }

  return false;
}
