const rounds = 10;
const requestInterval = 250; // interval to use for checking if requests have completed
let nutrientOfTheDay;
let nutrientOfTheDayUnits;

// Get the NOTD
const xhttp = new XMLHttpRequest();
xhttp.open("GET", "api/foods/notd", true);
xhttp.send()
xhttp.onload = () => {
  if (xhttp.status == 200) {
    response = JSON.parse(xhttp.response);
    nutrientOfTheDay = response["notd"];
    nutrientOfTheDayUnits = response["unit"];
  }
}


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

updateCSSVariables();
// Actions to be taken whenever screen resizes
window.addEventListener('resize', function (event) {
  updateCSSVariables();
}, false);