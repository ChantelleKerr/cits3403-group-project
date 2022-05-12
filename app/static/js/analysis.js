const rounds = 10;
const nutrients = ["Calcium", "Fat", "Fibre", "Iron", "Protein", "Sodium", "Sugar"];
const units = ["mg", "g", "g", "mg", "g", "mg", "g"]

window.onload = function () {
  const resultsTable = document.getElementById("results-table");
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "api/results/user", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send();
  xhttp.onload = () => { 
    if (xhttp.status == 200) {
      var res = JSON.parse(xhttp.response);
      if (res.length == 0){//The user hasn't got any results yet
        document.body.removeChild(resultsTable);
        let new_text = document.createElement("h3");
        document.body.appendChild(new_text);
        new_text.innerHTML = "You do not have any results yet";
        new_text.className = "center";
      }else{
        addTableRow(["Game number","Date","Nutrient","Score","Rounds","Seed"],"th");
        for (var i = 0; i < res.length; i++){
          let score = (res[i].score.match(/1/g) || []).length;
          let rounds = res[i].score.replace(/1/g,"🟩").replace(/0/g,"🟥");
          let date = res[i].date.split(" ")[0];
          let nutrientNum = parseInt(res[i].date.split(" ")[1])
          let nutrient = nutrients[nutrientNum];
          let nutrientHTML = nutrient + ' <img style="width:40px;" alt = "' + nutrient + '"src = "static/images/' + nutrient.toLowerCase() + '.png">';
          let seed = '<button class="results-button" onclick="showPuzzle(' + res[i].seed + ',' + nutrientNum + ')">View Puzzle</button>';
          addTableRow([i+1,date,nutrientHTML,score,rounds,seed],"td");
        }
      }
    }
  }
  /**
   * @param list_of_values : list of values of row
   * @param type : either td or th
   */
  function addTableRow(list_of_values,type){
    var newRow = document.createElement("tr");
    resultsTable.appendChild(newRow);
    for (var j = 0; j < 6; j++){
      let newCell = document.createElement(type);
      newRow.appendChild(newCell);
      if (j == 4 && type=="th"){//Set minimum width of 5th column to avoid it making the table rows tall
        newCell.style.minWidth = "260px"
      }else if (j == 2 && type=="th"){
        newCell.style.minWidth = "150px"
      }else if (j == 5 && type=="th"){
        newCell.style.minWidth = "160px"
      }
      newCell.innerHTML = list_of_values[j];
    }
  }
}

function showPuzzle(i,nutrientNum){
  let puzzleModal = document.getElementById("puzzle-modal");
  let puzzleModalBody = document.getElementById("puzzle-modal-body");
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "api/foods/get/" + i, true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send();
  xhttp.onload = () => { 
    if (xhttp.status == 200) {
      let foods = JSON.parse(xhttp.response);
      puzzleModalBody.innerHTML = "<p class = 'text-secondary'>Nutrient: " + nutrients[nutrientNum] + "</p>";
      var list = document.createElement("ul");
      puzzleModalBody.appendChild(list);
      for (var i = 0; i < rounds+1; i++){
        var listItem = document.createElement("li");
        listItem.innerHTML = foods[i].name + ": " + foods[i][nutrients[nutrientNum]] + " " + units[nutrientNum];
        list.appendChild(listItem);
      }
      bootstrap.Modal.getOrCreateInstance(puzzleModal).show();
    }else{
      puzzleModalBody.innerHTML = "<p>An unexpected error occured</p>"
    }
  }
}