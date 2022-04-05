const rounds = 10;
let currentRound = 1;
const nutrients = ["Energy", "Fat", "Fibre", "Iron", "Protein", "Sodium", "Sugar"];
const units = ["calories", "g", "g", "mg", "g", "mg", "g"]

let dt = new Date();

function onLoad() {
  generateNutrientData();
  addEventListeners();
}

// This function is used to generate a new batch of icons each day, and also to change the nutrient text
function generateNutrientData() {
  let div = document.getElementById('round-icons');
  for (let i = 0; i < rounds; i++) {
    let img = document.createElement('img');
    img.src = "../images/" + nutrients[dt.getDay()].toLowerCase() + "-lose.png";
    img.setAttribute('alt', 'roundIcon')
    div.appendChild(img);
  }
  for (var i = 0; i < 2; i++) {
    document.getElementsByClassName("nutrient-data-text")[i].innerHTML = nutrients[dt.getDay()] + ": " + Math.floor(1000 * Math.random()) + " " + units[dt.getDay()];
    //TODO: update this to use actual data, rather than some random number
  }
  document.getElementById("nutrient-name-text").textContent = nutrients[dt.getDay()];
}

// Add event listeners after the data has been generated
function addEventListeners() {
  let foodChoices = document.getElementsByClassName("game-img");

  if (foodChoices.length != 2) { 
    throw ("Found more than 2 food choices!");
  }

  // Add event listeners
  document.getElementById("food-selection-area").addEventListener("mouseleave", updateCircle, false);
  for (var i = 0; i < foodChoices.length; i++) {
    foodChoices[i].addEventListener("click", checkHigher, false);
    foodChoices[i].addEventListener("mouseenter", updateCircle, false);
  }
}

/**
 * Updates the symbol between food choices based on where cursor is located
 * @param {event} The event triggering the function
 */
function updateCircle(event) {
  let foodChoices = document.getElementsByClassName("game-img");
  let circleComparison = document.getElementById("circle-comparison");

  if (event.type == "mouseleave") {
    circleComparison.textContent = "OR";
  }
  else if (event.type == "mouseenter" && event.target == foodChoices[0]) {
    circleComparison.textContent = ">";
  }
  else if (event.type == "mouseenter" && event.target == foodChoices[1]) {
    circleComparison.textContent = "<";
  }
  else {
    throw ("updateCircle was called with an incorrect event!");
  }
}

// This function fills in the round icons if the higher value was clicked 
// The variable "clickedDiv" refers to the parent div containing the image and the
// We need the parent div because we eventually want to change the image as well as the text
function checkHigher(event) {
  let foodChoices = document.getElementsByClassName("game-img");

  // Determine which food was selected
  let foodSelected = event.target in foodChoices ? event.target : false;
  if (foodChoices[0].contains(event.target) && !foodChoices[1].contains(event.target)) {
    foodSelected = foodChoices[0];
  }
  else if (foodChoices[1].contains(event.target) && !foodChoices[0].contains(event.target)) {
    foodSelected = foodChoices[1];
  }

  if (!foodSelected) {
    throw ("Food selected covered both or neither of the image divs!");
  }

  if (foodSelected == getMostNutritious() || !getMostNutritious()) {
    let roundDiv = document.getElementById('round-icons');
    roundDiv.childNodes[currentRound - 1].src = "../images/" + nutrients[dt.getDay()].toLowerCase() + ".png";;
    currentRound++;
  }
}

//This function returns the div containing the most nutritious food
//If the foods are equally nutritious, then the function just returns false
function getMostNutritious() {
  let foodChoices = document.getElementsByClassName("game-img");
  if (getNutrientDataOfImage(foodChoices[0]) > getNutrientDataOfImage(foodChoices[1])) {
    return foodChoices[0];
  } 
  else if (getNutrientDataOfImage(foodChoices[0]) < getNutrientDataOfImage(foodChoices[1])) {
    return foodChoices[1];
  }
  return false;
}

//This function extracts the nutrient number from its container div
//It may need to be updated once we stop displaying the nutrient data (depending on how we implement that)
function getNutrientDataOfImage(div) {
  return parseInt(div.firstElementChild.lastElementChild.innerHTML.split(" ")[1]);
}
