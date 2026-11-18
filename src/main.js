import './css/style.css';
import { fetchWeather } from './js/services/weatherApi';
import { renderWeatherUI } from './js/ui/renderUI';

const formEl = document.querySelector('#search-form');
const inputEl = document.querySelector('#search-input');

formEl.addEventListener('submit', async (e) => {
  e.preventDefault();

  const query = inputEl.value.trim();
  if (!query) {
    return;
  }

  const weatherData = await fetchWeather(query);
  if (!weatherData) {
    //Open modal
    return;
  }

  renderWeatherUI(weatherData);
  inputEl.value = '';
});
