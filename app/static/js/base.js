const requestInterval = 250; // interval to use for checking if requests have completed
let nutrientOfTheDay;
let nutrientOfTheDayUnits;
let foodChoices;

const routeNavBarNames = { "/": "Home", "/game": "Game", "/analysis": "Analysis" };

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

function fixNavBar() {
  document.querySelectorAll(".nav-link").forEach((link) => {
    if (link.innerHTML == routeNavBarNames[window.location.pathname]) {
      link.className = "nav-link active";
      link.ariaCurrent = "page";
    } else {
      link.className = "nav-link";
      link.removeAttribute("aria-current");
    }
  });
}

updateCSSVariables();
fixNavBar();
// Actions to be taken whenever screen resizes
window.addEventListener('resize', function () {
  updateCSSVariables();
}, false);

// This function is overwritten by whatever should happen after the NOTD has been received
let nutrientOfTheDayRequested = function () { };
// This is called by any page which needs the NOTD
function requestNutrientOfTheDay() {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "api/foods/notd/0", true);
  xhttp.send();
  xhttp.onload = () => {
    if (xhttp.status == 200) {
      response = JSON.parse(xhttp.response);
      nutrientOfTheDay = response.notd;
      nutrientOfTheDayUnits = response.unit;
      nutrientOfTheDayRequested();
    }
  };
}

// This function is overwritten by whatever should happen after the foodChoices have been received
let foodChoicesRequested = function () { };
// This is called by any page which needs the foodChoices
function requestFoodChoices() {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "api/foods", true);
  xhttp.send();
  xhttp.onload = () => {
    if (xhttp.status == 200) {
      foodChoices = JSON.parse(xhttp.response);
      foodChoicesRequested();
    }
  };
}


