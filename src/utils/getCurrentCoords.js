const OPTIONS = {
  enableHighAccuracy: false,
  timeout: 20000,
  maximumAge: 300000,
};

export function getCurrentCoords() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Your browser does not support geolocation!'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        resolve({ latitude, longitude });
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error('You denied location access!'));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error('Unable to determine your current location!'));
            break;
          case error.TIMEOUT:
            reject(new Error('Geolocation request timed out!'));
            break;
          default:
            reject(new Error('Unknown geolocation error!'));
            break;
        }
      },
      OPTIONS,
    );
  });
}
