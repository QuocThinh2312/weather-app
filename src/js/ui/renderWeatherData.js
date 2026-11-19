import { getIconPath } from '../utils/getIconPath';

const locationNameEl = document.querySelector('#location-name');
const currentTempEl = document.querySelector('#current-temp');
const minTempEl = document.querySelector('#min-temp');
const maxTempEl = document.querySelector('#max-temp');
const weatherDescEl = document.querySelector('#weather-description');
const humidityEl = document.querySelector('#humidity');
const windSpeedEl = document.querySelector('#wind-speed');
const feelsLikeEl = document.querySelector('#feels-like');
const pressureEl = document.querySelector('#pressure');
const visibilityEl = document.querySelector('#visibility');
const uvIndexEl = document.querySelector('#uv-index');
const chanceOfRainEl = document.querySelector('#chance-of-rain');

const forecastTodayTempEl = document.querySelector('#forecast-today-temp');
const forecastTodayDescEl = document.querySelector('#forecast-today-desc');
const forecastTomorrowTempEl = document.querySelector('#forecast-tomorrow-temp');
const forecastTomorrowDescEl = document.querySelector('#forecast-tomorrow-desc');
const forecastDayAfterDayEl = document.querySelector('#forecast-day-after-day');
const forecastDayAfterTempEl = document.querySelector('#forecast-day-after-temp');
const forecastDayAfterDescEl = document.querySelector('#forecast-day-after-desc');

const weatherIconCurrentEl = document.querySelector('#weather-icon');
const weatherIconTodayEl = document.querySelector('#weather-icon-today');
const weatherIconTomorrowEl = document.querySelector('#weather-icon-tomorrow');
const weatherIconDayAfterEl = document.querySelector('#weather-icon-day-after');

const footerTextEl = document.querySelector('#footer-text');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function formatConditionText(conditionText, isDay) {
  return conditionText === 'Sunny' && !isDay ? 'Clear' : conditionText;
}

function renderBackgroundColor(isDay) {
  if (isDay) {
    document.body.classList.add('bg-day');
    document.body.classList.remove('bg-night');

    footerTextEl.classList.add('text-text-primary');
    footerTextEl.classList.remove('text-white');
  } else {
    document.body.classList.remove('bg-day');
    document.body.classList.add('bg-night');

    footerTextEl.classList.add('text-white');
    footerTextEl.classList.remove('text-text-primary');
  }
}

export function renderWeatherData(weatherData) {
  if (!weatherData) {
    return;
  }

  const {
    location,
    current: currentWeather,
    forecast: {
      forecastday: [{ day: todayWeather }, { day: tomorrowWeather }, dayAfterInfo],
    },
  } = weatherData;
  const { date: dayAfterDate, day: dayAfterWeather } = dayAfterInfo;

  renderBackgroundColor(currentWeather.is_day);

  locationNameEl.textContent = location.name;
  weatherIconCurrentEl.src = getIconPath(currentWeather.condition.code, currentWeather.is_day);
  currentTempEl.textContent = `${currentWeather.temp_c}°C`;
  minTempEl.textContent = `${todayWeather.mintemp_c}°C`;
  maxTempEl.textContent = `${todayWeather.maxtemp_c}°C`;
  weatherDescEl.textContent = currentWeather.condition.text;
  humidityEl.textContent = `${currentWeather.humidity}%`;
  windSpeedEl.textContent = `${currentWeather.wind_kph} km/h`;
  feelsLikeEl.textContent = `${currentWeather.feelslike_c}°C`;
  pressureEl.textContent = `${currentWeather.pressure_mb} hPa`;
  visibilityEl.textContent = `${currentWeather.vis_km} km`;
  uvIndexEl.textContent = `${currentWeather.uv}`;
  chanceOfRainEl.textContent = `${currentWeather.chance_of_rain}%`;

  forecastTodayTempEl.textContent = `${todayWeather.avgtemp_c}°C`;
  forecastTodayDescEl.textContent = formatConditionText(todayWeather.condition.text, currentWeather.is_day);

  forecastTomorrowTempEl.textContent = `${tomorrowWeather.avgtemp_c}°C`;
  forecastTomorrowDescEl.textContent = formatConditionText(tomorrowWeather.condition.text, currentWeather.is_day);

  forecastDayAfterDayEl.textContent = `${days[new Date(dayAfterDate).getDay()]}`;
  forecastDayAfterTempEl.textContent = `${dayAfterWeather.avgtemp_c}°C`;
  forecastDayAfterDescEl.textContent = formatConditionText(dayAfterWeather.condition.text, currentWeather.is_day);

  weatherIconTodayEl.src = getIconPath(todayWeather.condition.code, currentWeather.is_day);
  weatherIconTomorrowEl.src = getIconPath(tomorrowWeather.condition.code, currentWeather.is_day);
  weatherIconDayAfterEl.src = getIconPath(dayAfterWeather.condition.code, currentWeather.is_day);
}
