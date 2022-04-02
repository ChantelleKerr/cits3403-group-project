const rounds = 10;
const nutrients = ["Energy","Fat","Fibre","Iron","Protein","Sodium","Sugar"];
// This function is used to generate a new batch of icons each day, and also to change the nutrient text

function generateRoundIcons() {
  //TODO: Consider renaming this function as it does more than generate round icons
  let div = document.getElementById('round-icons');
  let dt = new Date();
  for (let i = 0; i < rounds; i++) {
    let img = document.createElement('img');
    img.src = "../images/" + nutrients[dt.getDay()].toLowerCase() + "-lose.png";
    img.setAttribute('alt', 'roundIcon')
    div.appendChild(img);
  }
  document.getElementById("nutrient-name-text").innerHTML = nutrients[dt.getDay()];
}