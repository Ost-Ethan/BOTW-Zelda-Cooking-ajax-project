document.addEventListener('DOMContentLoaded', ingredientRequest);

function ingredientRequest() {
  const listOfIngredientsApiCall = new XMLHttpRequest();
  listOfIngredientsApiCall.open(
    'GET',
    'https://botw-compendium.herokuapp.com/api/v3/compendium/category/materials'
  );
  listOfIngredientsApiCall.responseType = 'json';
  listOfIngredientsApiCall.send();
  listOfIngredientsApiCall.addEventListener('load', function () {
    renderIngredientList(listOfIngredientsApiCall);
  });
}

const selectedIngredientsArray = [];

function renderIngredientList(ingredientApiData) {
  const calledIngredientsList = ingredientApiData.response.data;
  for (let i = 0; i < calledIngredientsList.length; i++) {
    const currentID = calledIngredientsList[i].id;
    const currentName = calledIngredientsList[i].name;
    const currentImage = calledIngredientsList[i].image;

    const $divColumnOneThird = document.createElement('div');
    const $divIngredientEntry = document.createElement('div');
    const $divIdNumber = document.createElement('div');
    const $divIngredientName = document.createElement('div');
    const $imgIngredientPicture = document.createElement('img');

    $divColumnOneThird.className = 'column-one-third';
    $divIngredientEntry.className = 'ingredient-entry';
    $divIdNumber.className = 'entry-format';
    $divIdNumber.textContent = currentID;
    $divIngredientName.className = 'entry-format name';
    $divIngredientName.textContent = currentName;
    $imgIngredientPicture.setAttribute('src', currentImage);
    $imgIngredientPicture.setAttribute('alt', 'ingredient image');

    $divColumnOneThird.appendChild($divIngredientEntry);
    $divIngredientEntry.appendChild($divIdNumber);
    $divIngredientEntry.appendChild($divIngredientName);
    $divIngredientEntry.appendChild($imgIngredientPicture);
    // append created dom tree to the list of ingredients element
    $ingredientList.appendChild($divColumnOneThird);
  }
}

const $ingredientList = document.querySelector('.list-of-ingredients');
$ingredientList.addEventListener('click', handleSelectIngredient);

// callback function on click that determines what ingredient on the list was clicked, and will reuturn that into the array of selectedIngredients
function handleSelectIngredient(event) {
  const $clickedIngredient = event.target;
  const $closestEntryToClick = $clickedIngredient.closest('.ingredient-entry');

  // Setting the selected ingredient name based on the closest entry to click, where the name of the ingredient is always the child of the entry at the index of 1.
  const $selectedIngredientName = $closestEntryToClick.children[1];

  // Checking to see what ingredient entry was clicked, highlights it and then stores the ingredient name in the storedIngredientsArray.
  if (
    $closestEntryToClick.getAttribute('class') === 'ingredient-entry' &&
    selectedIngredientsArray.length < 5
  ) {
    $closestEntryToClick.setAttribute('class', 'ingredient-entry highlight');
    selectedIngredientsArray.unshift($selectedIngredientName.textContent);
  } else if (
    $closestEntryToClick.getAttribute('class') === 'ingredient-entry highlight'
  ) {
    for (let i = 0; i < selectedIngredientsArray.length; i++) {
      if (selectedIngredientsArray[i] === $selectedIngredientName.textContent) {
        selectedIngredientsArray.splice(i, 1);
        $closestEntryToClick.setAttribute('class', 'ingredient-entry');
      }
    }
  }
}
