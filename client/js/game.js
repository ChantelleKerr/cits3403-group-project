const rounds = 10;

function generateRoundIcons() {
  let div = document.getElementById('round-icons');
  for (let i = 0; i < rounds; i++) {
    let img = document.createElement('img');
    img.src = '../images/lighting-lose.png';
    div.appendChild(img);

  }
}