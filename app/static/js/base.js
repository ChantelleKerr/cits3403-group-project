const nutrients = ["Calcium", "Fat", "Fibre", "Iron", "Protein", "Sodium", "Sugar"];
let dt = new Date();
let nutrientOfTheDay = nutrients[dt.getDay()];

/**
 * Checks if the window is considered small by bootstrap
 * @returns true if the window is small, otherwise false
 */
let isWindowSmall = () => window.innerWidth <= 768;

/**
* Adds variables used in CSS, these are recalculated whenever the screen resizes.
*/
function updateCSSVariables() {
  document.querySelector(':root').style.setProperty('--navbar-height', document.getElementById("navbar").clientHeight + 'px');
  document.querySelector(':root').style.setProperty('--nonavbar-height', window.innerHeight - document.getElementById("navbar").clientHeight + 'px');
}

/**
 * Runs after the body of base.html loads
 */
function init() {
  updateCSSVariables();

  // Actions to be taken whenever screen resizes
  window.addEventListener('resize', function (event) {
    updateCSSVariables();
  }, false);
}
