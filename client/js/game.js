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
  for (var i = 0; i < foodRow.length; i++) {
    foodRow[i].addEventListener("click", checkHigher, false);
  }
}

// This function fills in the round icons if the higher value was clicked 
// The variable "clickedDiv" refers to the parent div containing the image and the
// We need the parent div because we eventually want to change the image as well as the text
function checkHigher(event) {
  let clickedDiv = event.target;
  if (event.target.tagName != "DIV"){ //Check if we're clicking text, rather than a div 
    clickedDiv = clickedDiv.parentNode.parentNode;
  }
  console.log(Boolean(clickedDiv));
  if (clickedDiv == getMostNutritious() || (!getMostNutritious() && clickedDiv.className != "circle")) {
    let roundDiv = document.getElementById('round-icons');
    roundDiv.childNodes[currentRound - 1].src = "../images/" + nutrients[dt.getDay()].toLowerCase() + ".png";;
    currentRound++;
  }
}

//This function returns the div containing the most nutritious food
//If the foods are equally nutritious, then the function just returns false
function getMostNutritious(){
  let divs = document.getElementsByClassName("game-img");
  if (getNutrientDataOfImage(divs[0]) > getNutrientDataOfImage(divs[1])){ 
    return divs[0]; 
  }else if (getNutrientDataOfImage(divs[0]) < getNutrientDataOfImage(divs[1])){ 
    return divs[1];
  }
  return false;
}

//This function extracts the nutrient number from its container div
//It may need to be updated once we stop displaying the nutrient data (depending on how we implement that)
function getNutrientDataOfImage(div){
  return parseInt(div.firstElementChild.lastElementChild.innerHTML.split(" ")[1]);
}