import './style.css';
import { fetchWeather } from './api/weatherApi';
import { getLocationName } from './api/locationNameApi';
import { renderWeatherData } from './ui/renderWeatherData';
import { toggleSkeleton } from './ui/toggleSkeleton';
import { handleModalEvent, isModalOpen } from './ui/handleModalEvent';
import { getCurrentCoords } from './utils/getCurrentCoords';
import { cachedWeatherData, storeWeatherData, hasCachedData } from './utils/storage';
import { normalizeLocationQuery } from './utils/normalizeLocationQuery';
import { startClock } from './ui/startClock';

const formEl = document.querySelector('#search-form');
const inputEl = document.querySelector('#search-input');
const locationBtnEl = document.querySelector('#location-btn');

let currentController = null;

function startRequest() {
  // Hủy request cũ khi gọi request mới
  if (currentController) {
    currentController.abort();
  }

  const controller = new AbortController();
  currentController = controller;
  toggleSkeleton(true);
  return controller;
}

function cleanupRequest(controller) {
  if (currentController === controller) {
    toggleSkeleton(false);
    currentController = null;
  }
}

function handleFetchSuccess(query, weatherData) {
  renderWeatherData(weatherData);
  startClock(weatherData.location.tz_id);
  storeWeatherData(query, weatherData);
  inputEl.focus();
}

async function loadWeather(query, signal) {
  try {
    const isCached = hasCachedData(query);
    let weatherData;

    if (!isCached) {
      weatherData = await fetchWeather(query, signal);
    } else {
      weatherData = cachedWeatherData.get(query).data;
    }

    return weatherData ? weatherData : false;
  } catch (error) {
    if (error.name === 'AbortError') {
      return null;
    }
    throw error;
  }
}

formEl.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (isModalOpen) {
    return;
  }

  const query = normalizeLocationQuery(inputEl.value);
  if (!query) {
    handleModalEvent('Location name cannot be empty!');
    return;
  }

  const controller = startRequest();

  try {
    const weatherData = await loadWeather(query, controller.signal);

    if (weatherData === false) {
      handleModalEvent('Location name does not exist!');
      return;
    }

    if (weatherData) {
      handleFetchSuccess(query, weatherData);
      inputEl.value = '';
    }
  } catch (error) {
    handleModalEvent(error.message, Boolean(error.isServerOffline));
  } finally {
    cleanupRequest(controller);
  }
});

locationBtnEl.addEventListener('click', async () => {
  if (isModalOpen) {
    return;
  }

  const controller = startRequest();

  try {
    const { latitude, longitude } = await getCurrentCoords();

    if (controller.signal.aborted) {
      return;
    }

    const lat = latitude.toFixed(3);
    const lon = longitude.toFixed(3);
    const query = `${lat},${lon}`;

    const isCached = hasCachedData(query);
    const [weatherData, exactLocationName] = await Promise.all([
      loadWeather(query, controller.signal),
      isCached ? null : getLocationName(lat, lon, controller.signal),
    ]);

    if (weatherData === null) {
      return;
    }

    if (weatherData === false) {
      handleModalEvent('Weather data is not available for your current location. Please try another location!');
      return;
    }

    if (exactLocationName) {
      weatherData.location.name = exactLocationName;
    }

    handleFetchSuccess(query, weatherData);
  } catch (error) {
    if (controller.signal.aborted) {
      return;
    }

    handleModalEvent(error.message, Boolean(error.isServerOffline));
  } finally {
    cleanupRequest(controller);
  }
});

async function initApp() {
  let savedCity = localStorage.getItem('lastSearchedCity') ?? 'auto:ip';
  const controller = startRequest();

  try {
    let weatherData = await loadWeather(savedCity, controller.signal);

    if (weatherData === false) {
      savedCity = 'ho chi minh';
      weatherData = await loadWeather(savedCity, controller.signal);
    }

    if (weatherData) {
      handleFetchSuccess(savedCity, weatherData);
    }
  } catch (error) {
    handleModalEvent(error.message, Boolean(error.isServerOffline));
  } finally {
    cleanupRequest(controller);
  }
}

initApp();
