const rounds = 10;
const nutrients = ["Calcium", "Fat", "Fibre", "Iron", "Protein", "Sodium", "Sugar"];
const units = ["mg", "g", "g", "mg", "g", "mg", "g"]

let dt = new Date();
let nutrientOfTheDay = nutrients[dt.getDay()];
let foodChoices = 0;
let roundsWon = [];


/**
 * Checks if the window is considered small by bootstrap
 * @returns true if the window is small, otherwise false
 */
let isWindowSmall = () => window.innerWidth <= 768;

let currentRound = 1;
let score = 0;
let scoreString = "";
let start = -1; //If start is not -1, then an animation is ongoing, so clicking on the foods is disabled
let previousTimeStamp;

/**
 * Called when the page loads, sets up the game 
 */
requestFoodChoices();
generateNutrientOfTheDay();
addEventListeners();
updateCSSVariables();

/**
* Generates a new batch of icons and changes the nutrient text each day.
*/
function generateNutrientOfTheDay() {
  let roundDiv = document.getElementById('round-icons');
  for (let i = 0; i < rounds; i++) {
    let img = document.createElement('img');
    img.src = "static/images/" + nutrientOfTheDay.toLowerCase() + "-lose.png";
    img.setAttribute('alt', 'roundIcon')
    roundDiv.appendChild(img);
  }
  document.getElementById("nutrient-name-text").textContent = nutrientOfTheDay;
}

function requestFoodChoices() {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "api/foods", true);
  xhttp.send()
  xhttp.onload = () => {
    if (xhttp.status == 200) {
      foodChoices = JSON.parse(xhttp.response);
      generateFoodChoices();
    }
  }
}

/**
 * Generates a new set of food choices
 */
function generateFoodChoices() {
  // TODO: Replace with calling api for food choices or referring to a variable containing the result of the api call

  for (let i = 0; i < document.getElementsByClassName("game-img").length; i++) { // loop through the 2 food choices
    if (currentRound + i - 1 <= rounds) {
      document.getElementById("food-row").children[i].style.backgroundImage = "url(" + foodChoices[currentRound - 1 + i]["url"] + ")";
      document.getElementsByClassName("food-name-text")[i].innerHTML = foodChoices[currentRound - 1 + i]["name"];
    }
  }
  document.getElementById("nutrient-data-text").innerHTML = nutrientOfTheDay + ": " + foodChoices[currentRound - 1][nutrientOfTheDay] + " " + units[dt.getDay()];
}

/**
 * Adds all necessary event listeners after the two game-img food choices and relating data have been generated.
 */
function addEventListeners() {
  let foodDivs = document.getElementsByClassName("game-img");

  if (foodDivs.length != 2) {
    throw ("Found more than 2 food choices!");
  }

  // Add event listeners
  document.getElementById("food-row").addEventListener("mouseleave", updateCircleComparison, false);
  for (let i = 0; i < foodDivs.length; i++) {
    foodDivs[i].addEventListener("click", makeSelection, false);
    foodDivs[i].addEventListener("mouseenter", updateCircleComparison, false);
  }
  // Actions to be taken whenever screen resizes
  window.addEventListener('resize', function (event) {
    updateCircleComparison(event);
    updateCSSVariables();
  }, false);
}

/**
* Adds variables used in CSS, these are recalculated whenever the screen resizes.
*/
function updateCSSVariables() {
  document.querySelector(':root').style.setProperty('--navbar-height', document.getElementById("navbar").clientHeight + 'px');
  document.querySelector(':root').style.setProperty('--nonavbar-height', window.innerHeight - document.getElementById("navbar").clientHeight + 'px');
}

/**
 * Updates the symbol between food choices based on where cursor is located as well as rotating it when 
 * the layout changes because of a small screen size. 
 * @param event - The event triggering the function
 */
function updateCircleComparison(event) {
  /**
   * Rotates the circle-comparison text
   * @param rot - rotation amount, either 0 or 90
   */
  function setCircleComparisonRotation(rot) {
    let circleComparison = document.getElementById("circle-comparison");
    if (rot == 0) {
      circleComparison.style.transform = "translate(-50%,-50%) rotate(0deg)";
    } else if (rot == 90) {
      circleComparison.style.transform = "translate(-50%,-50%) rotate(90deg)";
    }
  }

  let circleComparison = document.getElementById("circle-comparison");
  if (start === -1 && event != null) {
    let foodDivs = document.getElementsByClassName("game-img");

    if (event.type == "mouseleave") {
      circleComparison.textContent = "OR";
    }
    else if (event.type == "mouseenter" && event.target == foodDivs[0]) {
      circleComparison.textContent = ">";
    }
    else if (event.type == "mouseenter" && event.target == foodDivs[1]) {
      circleComparison.textContent = "<";
    }
  }
  if (isWindowSmall() && (circleComparison.textContent == ">" || circleComparison.textContent == "<")) {
    setCircleComparisonRotation(90);
  } else {
    setCircleComparisonRotation(0);
  }
}

/**
 * Makes the food selection and does any actions required including checking if the selection was 
 * correct, updating the interface, and moving to the next round.
 * @param event - The event triggering the function
 */
function makeSelection(event) {
  if (start === -1) {
    let foodDivs = document.getElementsByClassName("game-img");
    // Determine which food was selected
    let foodSelected = event.target in foodDivs ? event.target : false;
    if (foodDivs[0].contains(event.target) && !foodDivs[1].contains(event.target)) {
      foodSelected = foodDivs[0];
    }
    else if (foodDivs[1].contains(event.target) && !foodDivs[0].contains(event.target)) {
      foodSelected = foodDivs[1];
    }

    if (!foodSelected) {
      throw ("Food selected covered both or neither of the image divs!");
    }

    let roundDiv = document.getElementById('round-icons');
    let circleComparison = document.getElementById("circle-comparison");
    if (foodSelected == getMostNutritious() || !getMostNutritious()) {
      roundDiv.children[currentRound - 1].src = "static/images/" + nutrientOfTheDay.toLowerCase() + ".png";
      score++;
      scoreString += "1";
      circleComparison.innerHTML = "✔";
      circleComparison.style.backgroundColor = "green";
      roundsWon.push(true);
      updateCircleComparison();
    } else {
      scoreString += "0";
      roundDiv.children[currentRound - 1].style.opacity = 0.5;
      circleComparison.innerHTML = "✖";
      circleComparison.style.backgroundColor = "red";
      roundsWon.push(false);
      updateCircleComparison();
    }

    if (currentRound <= rounds) {
      currentRound++;
      animateFoods();
    }
  }
}

/**
* Determines which choice is more nutritious. 
* @returns Element containing more nutritious food or false if they are equally nutritious
*/
function getMostNutritious() {
  let foodDivs = document.getElementsByClassName("game-img");
  if (foodChoices[currentRound - 1][nutrientOfTheDay] > foodChoices[currentRound][nutrientOfTheDay]) {
    return foodDivs[0];
  }
  else if (foodChoices[currentRound - 1][nutrientOfTheDay] < foodChoices[currentRound][nutrientOfTheDay]) {
    return foodDivs[1];
  }
  return false;
}

/**
* Makes a new div containing the next food for the purposes of animation
* Begins the sliding animation
*/
function animateFoods() {
  let foodDivs = document.getElementsByClassName("game-img");
  let newFood = document.createElement("div");
  newFood.id = "nf";
  newFood.className = "game-img";
  // copy the second food item
  newFood.innerHTML = foodDivs[1].innerHTML;
  if (currentRound <= rounds) {
    // but change the text and the image to be of the next food
    newFood.firstElementChild.firstElementChild.innerHTML = foodChoices[currentRound]["name"];
    newFood.style.backgroundImage = "url(" + foodChoices[currentRound]["url"] + ")";
    // Show the nutrient of the second food
    /*let nutr = document.createElement("h4"); // TODO: Uncomment these lines and fix the bug where food image has multiple values shown
    foodDivs[1].firstElementChild.appendChild(nutr);
    nutr.innerHTML = nutrientOfTheDay + ": " + Object.values(data)[currentRound+1][nutrientOfTheDay] + " " + units[dt.getDay()]*/
  } else { //Show the score
    makeGameOverScreen(newFood);
  }
  newFood.style.display = "none";
  document.getElementById("food-row").appendChild(newFood);
  newFood.style.position = "absolute";
  window.requestAnimationFrame(showAnswer);
}

/**
* Turns a div into a game over screen
* @param d - the div which we want to turn into a game over screen 
*/
function makeGameOverScreen(d) {
  let div = d.firstElementChild;
  div.innerHTML = "";
  d.style = "background-color: #222222";
  let t1 = document.createElement("h2");
  let t2 = document.createElement("h2");
  t1.innerHTML = "Game over!";
  t2.innerHTML = "Your score: " + score + "/" + rounds;

  let shareBtn = document.createElement("button");
  Object.assign(shareBtn, {
    className: "btn btn-outline-secondary",
    onclick: openShareModal
  })
  shareBtn.innerHTML = "Share Score";
  div.appendChild(t1);
  div.appendChild(t2);
  div.appendChild(shareBtn);
}

function openShareModal() {
  let shareModal = document.getElementById("shareModal");
  bootstrap.Modal.getOrCreateInstance(shareModal).show();
  // Calls function that is inside share.js
  createCopyTextArea();
}

// TODO: Add javadoc comments for showAnswer
function showAnswer(timestamp) {
  const pauseTime = 1000; //number of milliseconds to pause after showing the answer
  const fadeProportion = 2; // 1/fadeProportion is the proportion of pauseTime that the circle fades for

  if (start === -1) {
    start = timestamp;
  }
  let elapsed = timestamp - start;
  let circleComparison = document.getElementById("circle-comparison");
  let opacity = Math.min(1, fadeProportion - (fadeProportion * elapsed / pauseTime));
  circleComparison.style.opacity = opacity;
  if (elapsed < pauseTime) {
    previousTimeStamp = timestamp;
    window.requestAnimationFrame(showAnswer);
  } else {
    document.getElementById("nf").style.display = "block";
    document.getElementById("nf").style.zIndex = -1; //or else this element briefly flashes
    start = timestamp;
    window.requestAnimationFrame(slide);
  }
}

/**
* Slides the food divs (direction depends on the screen size)
* Places the newFood div next to/below the second food div
* Keeps calling requestAnimationFrame() to create an animation, until the movement is complete
* @param timestamp - the time at which this function's execution begins
*/
function slide(timestamp) {
  const slideTime = 600; //number of milliseconds for animation to take
  const slidePower = 0.4; //The sliding follows the function t^slidePower. Set this to 1 for linear sliding
  let elapsed = timestamp - start;
  let foodDivs = document.getElementsByClassName("game-img");
  let newFood = document.getElementById("nf");

  let slideSize = parseFloat(foodDivs[0].offsetWidth);
  let slideDirection = "X";
  if (isWindowSmall()) {
    slideSize = parseFloat(foodDivs[0].offsetHeight);
    slideDirection = "Y";
  }
  if (previousTimeStamp !== timestamp) {
    // Math.min() is used here to make sure the div stops at exactly the amount we want
    let shift = Math.min(slideSize * Math.pow(elapsed, slidePower) / Math.pow(slideTime, slidePower), slideSize);
    for (let i = 0; i < foodDivs.length; i++) {
      foodDivs[i].style.transform = "translate" + slideDirection + "(" + -shift + "px)";
    }
    //Need to keep calculating these in case the window size is changed

    if (slideDirection == "X") {
      newFood.style.left = 2 * slideSize + "px";
      newFood.style.top = "0px";
      newFood.style.width = slideSize + "px";
      newFood.style.height = foodDivs[0].offsetHeight + "px";
    } else {
      newFood.style.left = "0px";
      newFood.style.top = 2 * slideSize + "px";
      newFood.style.width = foodDivs[0].offsetWidth + "px";
      newFood.style.height = slideSize + "px";
    }
  }

  if (elapsed < slideTime) {
    previousTimeStamp = timestamp
    window.requestAnimationFrame(slide);
  } else {
    resetAfterAnimation();
  }
}

/**
* Removes the temporary element used to create the effect of the next food sliding in
* Updates the displayed foods by calling generateFoodChoices()
* Resets the transform of the divs
* Reset the circle back from showing a tick/cross
* Allow user interaction with the game once more by setting start to -1
*/
function resetAfterAnimation() {
  document.getElementById("food-row").removeChild(document.getElementById("nf"));
  let foodDivs = document.getElementsByClassName("game-img");
  let circleComparison = document.getElementById("circle-comparison")
  generateFoodChoices();
  for (let i = 0; i < foodDivs.length; i++) {
    foodDivs[i].style.transform = "";
  }
  if (currentRound <= rounds) {
    circleComparison.innerHTML = "OR";
    circleComparison.style.backgroundColor = "#191919";
    circleComparison.style.opacity = 1;
    start = -1;
  }
  else {
    makeGameOverScreen(foodDivs[1]);
    circleComparison.style.display = "none";
    start = 0;
    //TODO: this is the end of the game, so do some more stuff here
    storeScore();
  }
}

function storeScore(){
  let dateString = dt.getDate() + "/" + (dt.getMonth()+1) + "/" + dt.getFullYear() + " " + dt.getDay();

  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "api/results/write", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify({ date: dateString, score: scoreString }))

  xhttp.onload = () => {

  }
}