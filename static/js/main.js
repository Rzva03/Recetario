const form = document.getElementById("recipeBookForm"); //guarda los componentes del form
form.addEventListener("submit", function (event) {
  //al form le asigna un evento cuando sea submit
  event.preventDefault(); //con el evento se cancela el recargo de la pag
  let recipeBookFormData = new FormData(form); //crea el form data mediante el formulario
  let JsonObject = convertRowToLocalStorage(recipeBookFormData);
  saveLocalStorage(JsonObject);
  insertToRecipeBookTable(JsonObject);
  form.reset(); //formatea el formulario
});

function insertToRecipeBookTable(JsonObject) {
  let recipeBookTableRef = document.getElementById("recipeBookTable"); //crea una ref a la tabla
  let newRecipeBookRowRef = recipeBookTableRef.insertRow(-1); //asigna una nueva row a nuestra tabla en la ultima
  newRecipeBookRowRef.setAttribute("objDesserts", JsonObject["dessertID"]); //se agrega un atributo personalizado con el id
  let newTypeCellRef = newRecipeBookRowRef.insertCell(0); //inserta el td celda
  newTypeCellRef.textContent = JsonObject["nameDessert"]; //es un array de objectos, entonces queremos que muestre esta pos
  newTypeCellRef = newRecipeBookRowRef.insertCell(1); //inserta
  newTypeCellRef.textContent = JsonObject["materials"];
  let newDeleteCell = newRecipeBookRowRef.insertCell(2); //selecciona la celda 2 (3)
  let deleteButton = document.createElement("button"); //crear un boton y lo guarda en la variable deleteButton
  deleteButton.textContent = "Eliminar"; //le asigna un texto al boton con textContent
  newDeleteCell.appendChild(deleteButton); //imprime el boton en el la celda
  deleteButton.addEventListener("click", (event) => {
    //agregar un escucha de evento cuando se de un clic en deleteButton
    let dessertRow = event.target.parentNode.parentNode; //borrar la fila de acuerdo al boton eliminar
    let dessertId = dessertRow.getAttribute("data-dessert-id");
    dessertRow.remove();
    deleteDessertObject(dessertId);
  });
}

function deleteDessertObject(dessertId) {
  let dessertObjArr = JSON.parse(localStorage.getItem("objDesserts")); //convierte a un array de obj en base a los elementos del ls
  let dessertIndexInArray = dessertObjArr.findIndex(
    //se crea un let para encontrar el indice de acuerdo al id que se pasa como param
    (element) => element.dessertID === dessertId //si es igual guarda la pos
  );
  dessertObjArr.splice(dessertIndexInArray, 1); //elimina el elemento en la pos que lo encontro
  let dessertArrayJSON = JSON.stringify(dessertObjArr); //convierte a json el array
  localStorage.setItem("objDesserts", dessertArrayJSON); //el nuevo array lo envia al localstorage
}

function getNewDessertId() {
  let lastDessertId = localStorage.getItem("lastDessertId") || "-1"; //guarda el ultimo id y es null guarda un -1
  let newDessertId = JSON.parse(lastDessertId) + 1; //lo convierte a json
  localStorage.setItem("lastDessertId", JSON.stringify(newDessertId)); //lo agrega a otro localsorage
  return newDessertId; //retorna el nuevo id
}

function convertRowToLocalStorage(recipeBookFormData) {
  let nameDessert = recipeBookFormData.get("nameDessert"); //inserta texto
  let materials = recipeBookFormData.get("materials"); //
  let dessertID = getNewDessertId();
  return {
    //retorna un obj json
    nameDessert: nameDessert,
    materials: materials,
    dessertID: dessertID,
  };
}

function saveLocalStorage(JsonObject) {
  let myDessertArray = JSON.parse(localStorage.getItem("objDesserts")) || []; //se crea un array de obj
  //json y si esta vacio retorna un array vacio
  myDessertArray.push(JsonObject); //agrega los elementos del array
  let dessertArrayJSON = JSON.stringify(myDessertArray); //convierte los obj a json
  localStorage.setItem("objDesserts", dessertArrayJSON); //inserta los item en el localstorage
}

document.addEventListener("DOMContentLoaded", function (event) {
  //se agrega un evento al momento de cargar el doc
  let myDessertArray = JSON.parse(localStorage.getItem("objDesserts")); //recupera los elementos del localstorage
  if (myDessertArray == null) {
    console.log("No hay elementos");
  } else {
    myDessertArray.forEach(function (arrayElement) {
      //recorre la variable con forEach y cada elemento del localstorage
      insertToRecipeBookTable(arrayElement); //inserta
    });
  }
});
