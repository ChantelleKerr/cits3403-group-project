let copyBtn = document.getElementById('copy-btn');
let copyText = document.getElementById('copy-text');
let copyEmoji = document.getElementById('copy-emoji');

/**  
 * This function gets called from game.js 
 * It generates the text that will be used to copy to clipboard
*/
function createCopyTextArea() {
  copyText.innerHTML = `My Nutri Hi-Lo Daily Score: ${score}/${rounds}`;
  copyEmoji.innerHTML = "";
  for (let i = 0; i < rounds; i++) {
    if (roundsWon[i]) {
      copyEmoji.innerHTML += "🟩"
    } else {
      copyEmoji.innerHTML += "🟥"
    }
  }
}

copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(copyText.innerHTML + "\n" + copyEmoji.innerHTML);
  copyBtn.innerHTML = "Copied";
  setTimeout(function () {
    copyBtn.innerHTML = "Copy To Clipboard";
  }, 1000);
}); 
