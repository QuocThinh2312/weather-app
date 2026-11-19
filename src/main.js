import './css/style.css';
import { fetchWeather } from './js/services/weatherApi';
import { renderWeatherData } from './js/ui/renderWeatherData';
import { toggleSkeleton } from './js/ui/toggleSkeleton';
import { handleModalEvent } from './js/ui/handleModalEvent';
import { isModalOpen } from './js/ui/handleModalEvent';
import { getCurrentCoords } from './js/utils/getCurrentCoords';

const formEl = document.querySelector('#search-form');
const inputEl = document.querySelector('#search-input');
const locationBtnEl = document.querySelector('#location-btn');

const STORAGE_KEY = 'lastSearchedCity';
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

async function loadWeather(query, signal) {
  try {
    const weatherData = await fetchWeather(query, signal);
    if (!weatherData) {
      return false;
    }
    renderWeatherData(weatherData);
    return true;
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

  try {
    const isSuccess = await loadWeather(query, controller.signal);

    // Phân biệt với null là do chủ động abort request
    if (isSuccess === false) {
      handleModalEvent('Location name does not exist!');
    } else if (isSuccess) {
      localStorage.setItem(STORAGE_KEY, query);
    }
  } catch {
    console.error('Error rendering weather data');
  } finally {
    cleanupRequest(controller);
  }

  inputEl.value = '';
});

locationBtnEl.addEventListener('click', async () => {
  const controller = startRequest();

  try {
    toggleSkeleton(true);
    const { latitude, longitude } = await getCurrentCoords();

    // Nếu request này đã bị aborted do đã gọi request mới thì thoát luôn
    if (controller.signal.aborted) {
      return;
    }

    const isSuccess = await loadWeather(`${latitude}, ${longitude}`, controller.signal);

    if (isSuccess === false) {
      handleModalEvent('Weather data is not available for your current location. Please try another location!');
    } else if (isSuccess) {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (error) {
    if (controller.signal.aborted) {
      return;
    }

    console.error('Error getting current coords: ', error);
    handleModalEvent(error.message);
  } finally {
    cleanupRequest(controller);
  }
});

async function initApp() {
  const savedCity = localStorage.getItem(STORAGE_KEY) ?? 'auto:ip';
  const controller = startRequest();

  try {
    const isSuccess = await loadWeather(savedCity, controller.signal);

    if (isSuccess === false) {
      const fallbackCity = 'Ho Chi Minh city';
      await loadWeather(fallbackCity, controller.signal);
    }
  } catch {
    console.error('Error rendering weather data');
  } finally {
    cleanupRequest(controller);
  }
}

initApp();
