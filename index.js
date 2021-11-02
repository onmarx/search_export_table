const API_LINK = "https://randomuser.me/api/?results=50";
const btnExport = document.getElementById("bntExport");
const search = document.getElementById("search");
const note = document.getElementById("note");
const filterBtn = document.getElementById("btn-order");
const state = {
  querySet:[],
  order: [],
  status: false,
}
// save data table from excel file when the user click on the button export
const saveDatatoExcel = () => {
  let data = document.getElementById("table");
  let file = XLSX.utils.table_to_book(data, { sheet: "sheet1" });
  XLSX.write(file, { bookType: "xlsx", bookSST: true, type: "base64" })
  XLSX.writeFile(file, "user_api.xlsx");
}

// stop loader for the page is ok
const stoploader = (load, container) => {
  container.style.visibility = "hidden";
  container.style.opacity = "0";
  load.style.display = "none";
  load.style.animation = "none";
}

// build and draw table on the page when the window onload its ok
const buildTable = () => {
  const tbodyReponse = document.getElementById("response");
  let templateHtml = "";
  let array = state.status ? state.order : state.querySet;
  array.forEach((user, index) => {
    let colorGender = user.gender !== "female" ? "#c12906" : "#1192ee";
    templateHtml += `
      <tr>
          <td>${index+1}</td> 
          <td style="color:${colorGender};">${user.gender}</td>
          <td>${user.name.first} ${user.name.last}</td>
          <td>${user.email}</td>
          <td>${user.dob.age}</td>
        </tr>
    `;
  });
  tbodyReponse.innerHTML = templateHtml;
}

/* ######EVENTS########*/

// when the page is loaded, the function is called
window.onload = function () {
  let contenedor = document.querySelector(".loader_container");
  let loader = document.querySelector(".loader");
  fetch(API_LINK)
    .then((response) => response.json())
    .then((data) => {
      state.querySet = data.results;
      note.innerHTML = `<p>${data.results.length} registros en Total</p>`;
      buildTable();
      stoploader(loader, contenedor);
    }
  );

}

// search de names of the table when the user write in the input
search.addEventListener("keyup", (e) => {
  const tbodyReponse = document.getElementById("response");
  let value = e.target.value.toLowerCase(),
  tr = tbodyReponse.querySelectorAll("tr");
  // iterate over the table
  tr.forEach((tr) => {
    let td = tr.querySelectorAll("td");
    let name = td[2].innerText.toLowerCase();
    if (name.indexOf(value) !== -1) {
      tr.style.display = "";      
    } else {
      tr.style.display = "none";
    }
  });
});

filterBtn.addEventListener("click", () => {
  state.status = !state.status;
  const newArrayFilter = [...state.querySet];
  const newDataTable = newArrayFilter.sort((a, b) => (a.name.first > b.name.first) ? 1 : -1);
  if(state.status){
    state.order = newDataTable;
    buildTable();
  } else {
    buildTable();
  }
})


// event to save data table to excel file
btnExport.addEventListener("click", () => {
  saveDatatoExcel();
});


