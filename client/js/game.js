const rounds = 10;

// This function is used to generate a new batch of icons each day
// TODO: Pass in the correct icon for the nutrient of the day
function generateRoundIcons() {
  let div = document.getElementById('round-icons');
  for (let i = 0; i < rounds; i++) {
    let img = document.createElement('img');
    img.src = '../images/energy-lose.png';
    img.setAttribute('alt', 'roundIcon')
    div.appendChild(img);
  }
}