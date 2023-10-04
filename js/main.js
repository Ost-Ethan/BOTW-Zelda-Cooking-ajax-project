const ListOfIngredientsApiCall = new XMLHttpRequest();
ListOfIngredientsApiCall.open('GET', 'https://botw-compendium.herokuapp.com/api/v3/compendium/category/materials');
ListOfIngredientsApiCall.responseType = 'json';
ListOfIngredientsApiCall.addEventListener('load', renderIngredientList);
ListOfIngredientsApiCall.send();

function renderIngredientList(event) {
  const calledIngredientsList = ListOfIngredientsApiCall.response.data;
  for (let i = 0; i < calledIngredientsList.length; i++) {

    const currentID = calledIngredientsList[i].id;
    const currentName = calledIngredientsList[i].name;
    const currentImage = calledIngredientsList[i].image;
    // const currentHeartsRecovered = calledIngredientsList[i].hearts_recovered;
    // const currentCookingEffect = calledIngredientsList[i].cooking_effect;

    const $divColumnOneThird = document.createElement('div');
    const $divIngredientEntry = document.createElement('div');
    const $divIdNumber = document.createElement('div');
    const $divIngredientName = document.createElement('div');
    const $imgIngredientPicture = document.createElement('img');

    $divColumnOneThird.className = 'column-one-third';
    $divIngredientEntry.className = 'ingredient-entry';
    $divIdNumber.className = 'entry-format';
    $divIdNumber.textContent = currentID;
    $divIngredientName.className = 'entry-format';
    $divIngredientName.textContent = currentName;
    $imgIngredientPicture.setAttribute('src', currentImage);

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
  if ($clickedIngredient.getAttribute('class') === 'ingredient-entry') {
    $clickedIngredient.setAttribute('class', 'ingredient-entry highlight');
  } else if ($clickedIngredient.getAttribute('class') === 'ingredient-entry highlight') {
    $clickedIngredient.setAttribute('class', 'ingredient-entry');
  } else {

    const $closestEntryToClick = $clickedIngredient.closest('.ingredient-entry');
    if ($closestEntryToClick.getAttribute('class') === 'ingredient-entry') {
      $closestEntryToClick.setAttribute('class', 'ingredient-entry highlight');
    } else if ($closestEntryToClick.getAttribute('class') === 'ingredient-entry highlight') {
      $closestEntryToClick.setAttribute('class', 'ingredient-entry');
    }
  }
}
