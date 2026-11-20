const errorModalEl = document.querySelector('#error-modal');
const errorModalMessageEl = document.querySelector('#error-modal-message');
const errorModalCloseEl = document.querySelector('#error-modal-close');
const inputEl = document.querySelector('#search-input');

export let isModalOpen = false;

function showModal(message) {
  errorModalMessageEl.textContent = message;
  errorModalEl.setAttribute('data-open', '');
  isModalOpen = true;
  document.activeElement?.blur();
}

function closeModal() {
  if (!isModalOpen) {
    return;
  }

  errorModalMessageEl.textContent = '';
  errorModalEl.removeAttribute('data-open');
  isModalOpen = false;
  inputEl.focus();
}

errorModalEl.addEventListener('click', (e) => {
  if (e.target === errorModalCloseEl || e.target === e.currentTarget) {
    closeModal();
  }
});

window.addEventListener('keydown', (e) => {
  if (!isModalOpen) {
    return;
  }

  if (e.key === 'Escape' || e.key === 'Enter') {
    e.preventDefault();
    closeModal();
  }
});

export function handleModalEvent(message) {
  showModal(message);
}
