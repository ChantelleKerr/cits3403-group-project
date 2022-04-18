const rounds = 10;
let currentRound = 1;
const nutrients = ["Calcium", "Fat", "Fibre", "Iron", "Protein", "Sodium", "Sugar"];
const units = ["kJ", "g", "g", "mg", "g", "mg", "g"]
// TODO: Use the units from the nutrition database rather than hardcoded (the only part of each key that is in brackets)

let dt = new Date();
let todaysNutrient = nutrients[dt.getDay()];

let start = -1; //If start is not -1, then an animation is ongoing, so clicking on the foods is disabled
let previousTimeStamp;
const slideTime = 500; //number of milliseconds for animation to take
const slidePower = 0.4; //The sliding follows the function t^slidePower. Set this to 1 for linear sliding

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
  for (var i = 0; i < 2; i++) {
      document.getElementById("food-selection-area").children[i].style.backgroundImage = "url(" + Object.values(data)[currentRound-1+i].url + ")";
      document.getElementsByClassName("food-name-text")[i].innerHTML = Object.keys(data)[currentRound-1+i]
  }
  document.getElementById("nutrient-data-text").innerHTML = todaysNutrient + ": " + Object.values(data)[currentRound-1][todaysNutrient] + " " + units[dt.getDay()];
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
  if (start === -1){
    let foodChoices = document.getElementsByClassName("game-img");
    let circleComparison = document.getElementsByClassName("circle")[0];

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
}

/**
 * Makes the food selection and does any actions required including checking if the selection was 
 * correct, updating the interface, and moving to the next round.
 * @param event - The event triggering the function
 */
function makeSelection(event) {
  if (start === -1){
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

    let roundDiv = document.getElementById('round-icons');
    if (foodSelected == getMostNutritious() || !getMostNutritious()) {
      roundDiv.childNodes[currentRound - 1].src = "static/images/" + nutrients[dt.getDay()].toLowerCase() + ".png";
    }else{
      roundDiv.childNodes[currentRound - 1].style.opacity = 0.5;
    }
    if (currentRound < rounds){
      currentRound++;
      animateFoods();
    }else{
      //TODO: The game has ended, so do something here
      start = 0;
    }
  }
}

function animateFoods(){
  let foodDivs = document.getElementsByClassName("game-img");
  let newFood = document.createElement("div");
  let newCircle = document.createElement("div");
  newFood.id = "nf";
  //copy the second food item
  newFood.innerHTML = foodDivs[1].innerHTML;
  //but change the text and the image to be of the next food
  newFood.firstElementChild.firstElementChild.innerHTML = Object.keys(data)[currentRound];
  newFood.style.backgroundImage = "url(" + Object.values(data)[currentRound].url + ")";
  newFood.className = "game-img";

  newCircle.className = "circle";
  newCircle.innerHTML = "OR";
  document.body.appendChild(newFood);
  document.getElementById("food-selection-area").appendChild(newCircle);
  newFood.style.position = "absolute";
  document.body.style.overflow = "hidden"; //Do this to avoid scrollbars appearing. Maybe put this in CSS instead
  window.requestAnimationFrame(slide);
}

function slide(timestamp) {
  let foodDivs = document.getElementsByClassName("game-img");
  let slideSize = parseFloat(foodDivs[0].offsetWidth);
  if (start === -1) {
    start = timestamp;
  }
  let elapsed = timestamp - start;

  if (previousTimeStamp !== timestamp) {
    // Math.min() is used here to make sure the div stops at exactly the amount we want
    let shift = Math.min(slideSize * Math.pow(elapsed,slidePower)/Math.pow(slideTime,slidePower), slideSize);
    for (var i = 0; i < 2; i++){
      foodDivs[i].style.transform = 'translateX(' + -shift + 'px)';
      document.getElementsByClassName("circle")[i].style.left = 50*(slideSize*(i+1)-shift)/(slideSize) + "%";
    }
    //Need to keep calculating these in case the window size is changed
    document.getElementById("nf").style.left =  2*slideSize-shift + "px";
    document.getElementById("nf").style.top = foodDivs[0].getBoundingClientRect().top + "px";
    document.getElementById("nf").style.width = slideSize + "px";
    document.getElementById("nf").style.height = foodDivs[0].offsetHeight + "px";
  }

  if (elapsed < slideTime) {
    previousTimeStamp = timestamp
    window.requestAnimationFrame(slide);
  }else{
    resetAfterAnimation();
  }
}

function resetAfterAnimation(){
  document.body.removeChild(document.getElementById("nf"));
  generateFoodChoices();
  let foodDivs = document.getElementsByClassName("game-img");
  for (var i = 0; i < 2; i++){
    foodDivs[i].style.transform = 'translateX(0px)';
  }
  document.getElementById("food-selection-area").removeChild(document.getElementsByClassName("circle")[0]);
  start = -1;
}


/**
 * Determines which choice is more nutritious. 
 * @returns Element containing more nutritious food or false if they are equally nutritious
 */
function getMostNutritious() {
  let foodChoices = document.getElementsByClassName("game-img");
  let vals = Object.values(data)
  if (vals[currentRound-1][todaysNutrient] > vals[currentRound][todaysNutrient]) {
    return foodChoices[0];
  }
  else if (vals[currentRound-1][todaysNutrient] < vals[currentRound][todaysNutrient]) {
    return foodChoices[1];
  }
  return false;
}