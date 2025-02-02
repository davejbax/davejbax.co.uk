/** CSS class name for turning alternative color on */
const COLOR_ALT_CLASS = 'color-alt';

/** Local storage key for the alternative color setting */
const LOCAL_STORAGE_COLOR_ALT = 'use-alternative-color';

const setAlternativeColor = (enabled) => {
  const classList = document.documentElement.classList;

  classList.toggle(COLOR_ALT_CLASS, enabled);
  localStorage.setItem(LOCAL_STORAGE_COLOR_ALT, classList.contains(COLOR_ALT_CLASS) ? 'yes' : 'no');
}

if (localStorage.getItem(LOCAL_STORAGE_COLOR_ALT) !== null && localStorage.getItem(LOCAL_STORAGE_COLOR_ALT) === 'yes') {
  setAlternativeColor(true);
}
