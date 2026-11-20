const localTimeEl = document.querySelector('#local-time');
const localDateEl = document.querySelector('#local-date');

let timerId = null;

export function startClock(timezone) {
  if (!timezone) {
    return;
  }

  clearInterval(timerId);

  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  });

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  function renderTime() {
    const now = Date.now();
    localTimeEl.textContent = timeFormatter.format(now);
    localDateEl.textContent = dateFormatter.format(now);
  }

  renderTime();
  timerId = setInterval(() => {
    renderTime();
  }, 1000);
}
