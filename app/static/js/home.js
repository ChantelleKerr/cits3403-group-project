

function changeTip() {
  let prefix = "<span style=\"color: #F9D132\">Tip: </span>";
  let tips = [
    prefix + "Look for <img src=\"" + "static/images/" + nutrientOfTheDay.toLowerCase() + ".png" + "\"> at the bottom of the screen to see your score",
    prefix + "There are 10 new rounds released every day",
    prefix + "If you register you can see statistics about your performance and improvement"
  ];
  let tip = document.getElementById("tip");

  // make sure tip is different each time
  let currentTipIndex = tips.indexOf(tip.innerHTML);
  if (currentTipIndex > -1) {
    tips.splice(currentTipIndex, 1); // remove that item from the array
  }
  // tip fade out
  tip.style.opacity = 0;
  // change tip after fade out
  setTimeout(function() {
    tip.innerHTML = tips[Math.floor(Math.random() * tips.length)];
  }, 500);
  // tip fade in
  setTimeout(function () {
    tip.style.opacity = 1;
  }, 500);
}

requestNutrientOfTheDay();
nutrientOfTheDayRequested = function() {
  // generate nutrient of the day text
  let nutrientOfTheDayTextElements = document.getElementsByClassName("nutrient-name-text");
  for (let i = 0; i < nutrientOfTheDayTextElements.length; i++) {
    nutrientOfTheDayTextElements.item(i).textContent = nutrientOfTheDay;
  }
  changeTip();
  setInterval(changeTip, 10000);
};
