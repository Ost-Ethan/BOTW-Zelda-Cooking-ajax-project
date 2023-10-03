const ListOfIngredientsApiCall = new XMLHttpRequest();
ListOfIngredientsApiCall.responseType = 'JSON';

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
