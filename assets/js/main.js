(function () {

  // This script is loaded at the end of the page, so element references should work.
  document.getElementById('toggle-eye-strain')
    .addEventListener('click', () => {
      document.documentElement.classList.toggle('color-alt');
    });

})();