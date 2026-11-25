import { API_ENDPOINTS } from '../constants/endpoints';

export async function getLocationName(latitude, longitude, signal) {
  try {
    const url = `${API_ENDPOINTS.REVERSE_GEOCODE}?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
    const res = await fetch(url, { signal });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.locality ?? data.city ?? data.principalSubdivision ?? null;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error;
    }
    return null;
  }
}
