import './css/style.css';
import { fetchWeather } from './js/services/weatherApi';
import { renderWeatherUI } from './js/ui/renderWeatherUI';
import { toggleSkeleton } from './js/ui/toggleSkeleton';

const formEl = document.querySelector('#search-form');
const inputEl = document.querySelector('#search-input');

async function loadWeather(query) {
  toggleSkeleton(true);

  try {
    const weatherData = await fetchWeather(query);
    if (!weatherData) {
      //Open modal
      return;
    }

    renderWeatherUI(weatherData);
  } catch (error) {
    console.error('Error fetching weather: ', error);
  } finally {
    toggleSkeleton(false);
  }
}

formEl.addEventListener('submit', async (e) => {
  e.preventDefault();

  const query = inputEl.value.trim();
  if (!query) {
    return;
  }

  loadWeather(query);
  inputEl.value = '';
});

loadWeather('auto:ip');
