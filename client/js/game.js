const rounds = 10;
let currentRound = 1;
const nutrients = ["Energy", "Fat", "Fibre", "Iron", "Protein", "Sodium", "Sugar"];
const units = ["calories", "g", "g", "mg", "g", "mg", "g"]

let dt = new Date();

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
  handleEventListeners();
}

// Add event listeners after the data has been generated
function handleEventListeners() {
  let foodRow = document.getElementsByClassName("food-row");
  console.log(foodRow);
  for (var i = 0; i < foodRow.length; i++) {
    foodRow[i].addEventListener("click", checkHigher, false);
  }
}

// This function fills in the round icons if the higher value was clicked 
// Future Problem: When you click on the text, the event.target 
// returns the text tag instead of the parent div - might need a check to 
// make sure its not a text tag and can goes back up the path (view data in event.path)
// We need the parent div because we eventually want to change the image as well as the text
function checkHigher(event) {
  //TODO: Check if the higher value was clicked & detect which img was clicked
  if (event.target.className != "circle") {
    let roundDiv = document.getElementById('round-icons');
    roundDiv.childNodes[currentRound - 1].src = "../images/" + nutrients[dt.getDay()].toLowerCase() + ".png";;
    currentRound++;
  }
}
