const nutrients = ["Calcium", "Fat", "Fibre", "Iron", "Protein", "Sodium", "Sugar"];

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
      }
      for (var i = 0; i < res.length; i++){
        let score = (res[i].score.match(/1/g) || []).length;
        let rounds = res[i].score.replace(/1/g,"🟩").replace(/0/g,"🟥");
        let date = res[i].date.split(" ")[0];
        let nutrient = nutrients[parseInt(res[i].date.split(" ")[1])];
        addTableRow([i+1,date,nutrient,score,rounds,res[i].seed]);
      }
    }
  }

  function addTableRow(list_of_values){
    var newRow = document.createElement("tr");
    resultsTable.appendChild(newRow);
    for (var j = 0; j < 6; j++){
      let newCell = document.createElement("td");
      newRow.appendChild(newCell);
      newCell.innerHTML = list_of_values[j];
    }
  }
}

