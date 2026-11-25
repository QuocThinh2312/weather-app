import './style.css';
import { fetchWeather } from './api/weatherApi';
import { getLocationName } from './api/locationNameApi';
import { renderWeatherData } from './ui/renderWeatherData';
import { toggleSkeleton } from './ui/toggleSkeleton';
import { handleModalEvent, isModalOpen } from './ui/handleModalEvent';
import { getCurrentCoords } from './utils/getCurrentCoords';
import { cachedWeatherData, storeWeatherData, checkStoredData } from './utils/storage';
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
}

async function loadWeather(query, signal) {
  try {
    const hasStoredData = checkStoredData(query);
    let weatherData;

    if (!hasStoredData) {
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

  const query = inputEl.value.trim();
  if (!query) {
    handleModalEvent('Location name cannot be empty!');
    return;
  }

  const controller = startRequest();
  const cleanQuery = normalizeLocationQuery(query);

  try {
    const weatherData = await loadWeather(cleanQuery, controller.signal);

    // Phân biệt với null là do chủ động abort request
    if (weatherData === false) {
      handleModalEvent('Location name does not exist!');
    } else if (weatherData) {
      handleFetchSuccess(cleanQuery, weatherData);
    }
  } catch (error) {
    handleModalEvent(error.message, true);
  } finally {
    cleanupRequest(controller);
  }

  inputEl.value = '';
});

locationBtnEl.addEventListener('click', async () => {
  const controller = startRequest();

  try {
    const { latitude, longitude } = await getCurrentCoords();

    // Nếu request này đã bị aborted do đã gọi request mới thì thoát luôn
    if (controller.signal.aborted) {
      return;
    }

    const lat = latitude.toFixed(3);
    const lon = longitude.toFixed(3);
    const query = `${lat},${lon}`;

    const [weatherData, exactLocationName] = await Promise.all([
      loadWeather(query, controller.signal),
      getLocationName(lat, lon, controller.signal),
    ]);

    if (weatherData) {
      if (exactLocationName) {
        weatherData.location.name = exactLocationName;
      }
      handleFetchSuccess(query, weatherData);
    } else if (weatherData !== null) {
      handleModalEvent('Weather data is not available for your current location. Please try another location!');
    }
  } catch (error) {
    if (controller.signal.aborted) {
      return;
    }

    handleModalEvent(error.message, true);
  } finally {
    cleanupRequest(controller);
  }
});

async function initApp() {
  const savedCity = localStorage.getItem('lastSearchedCity') ?? 'auto:ip';
  const controller = startRequest();

  try {
    let weatherData = await loadWeather(savedCity, controller.signal);

    if (weatherData === false) {
      const fallbackCity = 'ho chi minh';
      weatherData = await loadWeather(fallbackCity, controller.signal);
    }

    if (weatherData) {
      handleFetchSuccess(savedCity, weatherData);
    }
  } catch (error) {
    handleModalEvent(error.message, true);
  } finally {
    cleanupRequest(controller);
  }
}

initApp();
