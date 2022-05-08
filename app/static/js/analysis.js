const nutrients = ["Calcium", "Fat", "Fibre", "Iron", "Protein", "Sodium", "Sugar"];

window.onload = function () {
  console.log("woww");
  const resultsTable = document.getElementById("results-table");
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "api/results/user", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send();
  xhttp.onload = () => { 
    if (xhttp.status == 200) {
      var res = JSON.parse(xhttp.response);
      for (var i = 0; i < res.length; i++){
        addTableRow([i+1,res[i].date.split(" ")[0],nutrients[parseInt(res[i].date.split(" ")[1])],res[i].score,res[i].seed]);
      }
    }
  }

  function addTableRow(list_of_values){
    var newRow = document.createElement("tr");
    resultsTable.appendChild(newRow);
    for (var j = 0; j < 5; j++){
      let newCell = document.createElement("td");
      newRow.appendChild(newCell);
      newCell.innerHTML = list_of_values[j];
    }
  }
}
