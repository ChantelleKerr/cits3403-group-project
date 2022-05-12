
// generate nutrient of the day text
let nutrientOfTheDayTextElements = document.getElementsByClassName("nutrient-name-text");
for (let i = 0; i < nutrientOfTheDayTextElements.length; i++) {
  nutrientOfTheDayTextElements.item(i).textContent = nutrientOfTheDay;
}
