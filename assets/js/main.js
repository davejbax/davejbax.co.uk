(function () {

  // Enable color transitions now that we've established
  document.documentElement.classList.add('color-transitions');

  // This script is loaded at the end of the page, so element references should work.
  document.getElementById('toggle-eye-strain')
    .addEventListener('click', () => {
      setAlternativeColor();
    });

})();