getDailyFoodChoices();
function getDailyFoodChoices() {
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

function createFoodList(foodChoices) {
  let foodList = document.getElementById("food-list");
  foodChoices.forEach(function (food, index) {
    var foodItem = document.createElement('div');
    var img = document.createElement('img');
    img.src = food.url
    Object.assign(img.style, {
      width: "100%",
      height: "150px",
      objectFit: "cover",

    });
    var itemDetails = document.createElement('div');
    itemDetails.innerHTML = food.name;

    foodItem.appendChild(img)
    foodItem.appendChild(itemDetails)
    foodList.appendChild(foodItem)

  })
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