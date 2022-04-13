const rounds = 10;
let currentRound = 1;
const nutrients = ["Energy", "Fat", "Fibre", "Iron", "Protein", "Sodium", "Sugar"];
const units = ["calories", "g", "g", "mg", "g", "mg", "g"]

let dt = new Date();

/**
 * Called when the page loads, sets up the game 
 */
function onLoad() {
  generateNutrientOfTheDay();
  generateFoodChoices();
  addEventListeners();
}

/**
 * Generates a new set of food choices
 */
function generateFoodChoices() {
  // TODO: Pick two random foods (cannot be done until we get actual data)
  for (var i = 0; i < 2; i++) {
    document.getElementsByClassName("nutrient-data-text")[i].innerHTML = nutrients[dt.getDay()] + ": " + Math.floor(1000 * Math.random()) + " " + units[dt.getDay()];
    //TODO: update this to use actual data, rather than some random number
  }
}

/**
 * Generates a new batch of icons and changes the nutrient text each day.
 */
function generateNutrientOfTheDay() {
  let div = document.getElementById('round-icons');
  for (let i = 0; i < rounds; i++) {
    let img = document.createElement('img');
    img.src = "static/images/" + nutrients[dt.getDay()].toLowerCase() + "-lose.png";
    img.setAttribute('alt', 'roundIcon')
    div.appendChild(img);
  }
  document.getElementById("nutrient-name-text").textContent = nutrients[dt.getDay()];
}

/**
 * Adds all necessary event listeners after the two game-img food choices and relating data have been generated.
 */
function addEventListeners() {
  let foodChoices = document.getElementsByClassName("game-img");

  if (foodChoices.length != 2) {
    throw ("Found more than 2 food choices!");
  }

  // Add event listeners
  document.getElementById("food-selection-area").addEventListener("mouseleave", updateCircle, false);
  for (var i = 0; i < foodChoices.length; i++) {
    foodChoices[i].addEventListener("click", makeSelection, false);
    foodChoices[i].addEventListener("mouseenter", updateCircle, false);
  }
}

/**
 * Updates the symbol between food choices based on where cursor is located
 * @param event - The event triggering the function
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

/**
 * Makes the food selection and does any actions required including checking if the selection was 
 * correct, updating the interface, and moving to the next round.
 * @param event - The event triggering the function
 */
function makeSelection(event) {
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


  // TODO: Go to end screen if selection was wrong / move to next round by changing the images and updating the data / calling a function nextRound() or something
  if (foodSelected == getMostNutritious() || !getMostNutritious()) {
    let roundDiv = document.getElementById('round-icons');
    roundDiv.childNodes[currentRound - 1].src = "static/images/" + nutrients[dt.getDay()].toLowerCase() + ".png";;
    currentRound++;
    generateFoodChoices();
  }

}

/**
 * Determines which choice is more nutritious. 
 * @returns Element containing more nutritious food or false if they are equally nutritious
 */
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

/**
 * Extracts the nutrient number from its container div.
 * @param div - One of the two game-img div elements.
 * @returns The numerical amount of nutrition.
 */
function getNutrientDataOfImage(div) {
  // TODO: may need to be updated once we stop displaying the nutrient data (depending on how we implement that)
  return parseInt(div.firstElementChild.lastElementChild.innerHTML.split(" ")[1]);
}
