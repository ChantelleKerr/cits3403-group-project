getDailyFoodChoices();

// Call the API to get the current list of food choices
function getDailyFoodChoices() {
  document.getElementById("current-nutrient").textContent = nutrientOfTheDay
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "api/foods", true);
  xhttp.send()
  xhttp.onload = () => {
    if (xhttp.status == 200) {
      foodChoices = JSON.parse(xhttp.response);
      createFoodList(foodChoices);
    }
  }
}

// Allows the admin to change the daily food choices
function generateNewDailyFoods() {
  const xhttp = new XMLHttpRequest();
  // Sending "0" as the seed is only used for admins
  xhttp.open("GET", "api/foods/0", true);
  xhttp.send()
  xhttp.onload = () => {
    if (xhttp.status == 200) {
      location.reload();
    }
  }
}

// Creates the HTML for each daily food item 
function createFoodList(foodChoices) {
  let foodList = document.getElementById("food-list");
  // For each food in the food choices
  foodChoices.forEach(function (food) {

    // Food item container
    let foodItem = document.createElement('div');
    foodItem.className = 'food-item-container';

    // Create the image
    let img = document.createElement('img');
    img.src = food.url;
    img.className = 'food-item-img'

    // Create the title
    let foodTitle = document.createElement("div");
    foodTitle.innerHTML = food.name;
    foodTitle.className = 'food-item-title center';

    var itemDetails = document.createElement('div');
    itemDetails.className = 'food-item-details center'

    // Add all food nutriential details
    for (var details in food) {
      if (details != 'url' && details != 'name') {
        var keyValue = document.createElement("span");
        keyValue.innerHTML = details + ": " + food[details];
        itemDetails.appendChild(keyValue);
      }
    }
    foodItem.appendChild(img)
    foodItem.appendChild(foodTitle)
    foodItem.appendChild(itemDetails)
    foodList.appendChild(foodItem)
  })
}
