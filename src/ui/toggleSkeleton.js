const weatherSkeletonEl = document.querySelector('#weather-skeleton');
const weatherContentEl = document.querySelector('#weather-content');

export function toggleSkeleton(isLoading) {
  weatherContentEl.classList.toggle('hidden!', isLoading);
  weatherSkeletonEl.classList.toggle('hidden!', !isLoading);
}
