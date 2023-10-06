let storedIngredientsArray = [];

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
    storedIngredientsArray = listOfIngredientsApiCall.response.data;
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
    $divIngredientEntry.setAttribute('id', currentID);
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
    selectedIngredientsArray.unshift(getIngredientObjectByName($selectedIngredientName.textContent));
  } else if (
    $closestEntryToClick.getAttribute('class') === 'ingredient-entry highlight'
  ) {
    for (let i = 0; i < selectedIngredientsArray.length; i++) {
      if (selectedIngredientsArray[i].name === $selectedIngredientName.textContent) {
        selectedIngredientsArray.splice(i, 1);
        $closestEntryToClick.setAttribute('class', 'ingredient-entry');
      }
    }
  }
}

// This function finds the specifc object associated with the name of the selected ingredient
function getIngredientObjectByName(ingredientTextContent) {
  let ingredientEntryObject = {};

  for (let i = 0; i < storedIngredientsArray.length; i++) {
    const currentIngredient = storedIngredientsArray[i].name;
    if (currentIngredient === ingredientTextContent) {
      ingredientEntryObject = storedIngredientsArray[i];
    }
  }

  return ingredientEntryObject;
}

// This function renders the entries in the selectedIngredientsArray on the cooking selection tab.
function renderCookingSelection(selectedIngredientsArray) {

  for (let i = 0; i < 5; i++) {
    const $ingredientNumber = document.querySelector(`.ing-${i + 1}`);
    if (selectedIngredientsArray[i] !== undefined) {
      $ingredientNumber.children[2].textContent = selectedIngredientsArray[i].name;
      if (selectedIngredientsArray[i].hearts_recovered === '') {
        $ingredientNumber.children[3].textContent = '0';
      } else {
        $ingredientNumber.children[3].textContent = `Hearts Recovered: ${selectedIngredientsArray[i].hearts_recovered}`;
      }
      if (selectedIngredientsArray[i].cooking_effect === '') {
        $ingredientNumber.children[4].textContent = 'No Cooking Effect';
      } else {
        $ingredientNumber.children[4].textContent = selectedIngredientsArray[i].cooking_effect;
      }
    } else {
      $ingredientNumber.children[2].textContent = 'No Selected Ingredient';
      $ingredientNumber.children[3].textContent = '';
      $ingredientNumber.children[4].textContent = '';
    }
  }
}

const $cookingView = document.querySelector('.cooking-selection');
$cookingView.addEventListener('click', deleteSelectedIngredient);

// This is a callback function for removing selected ingredients on the cooking selection view. It finds the nearest div, and then checks the textContent of its children at the 2nd index and checks it to see what entry in the selectedIngredientsArray has a name that matches. It then removes that from the array, and sets the text content of that div to the no ingredient selected state.
function deleteSelectedIngredient(event) {
  if (event.target.className === 'fa-regular fa-circle-xmark') {
    const $closestIngredientDiv = event.target.closest('.ingredient');
    for (let i = 0; i < selectedIngredientsArray.length; i++) {
      if ($closestIngredientDiv.children[2].textContent === selectedIngredientsArray[i].name) {
        selectedIngredientsArray.splice(i, 1);
        $closestIngredientDiv.children[2].textContent = 'No Selected Ingredient';
        $closestIngredientDiv.children[3].textContent = '';
        $closestIngredientDiv.children[4].textContent = '';
      }

    }
    renderCookingSelection(selectedIngredientsArray);
    calculateFinishedDish(selectedIngredientsArray);
  }
}

const $dataViewElements = document.querySelectorAll('div[data-view]');
const $headerRowForButtons = document.querySelector('.header-row');
$headerRowForButtons.addEventListener('click', function (event) {
  viewSwap(event.target.getAttribute('id'));
});

// Function that swaps the view to the corrosponding button being pressed. It also updates highlights for the ingredient list, and renders the ingredient list every time the view is swapped.
function viewSwap(viewString) {
  for (let i = 0; i < $dataViewElements.length; i++) {
    if (viewString === $dataViewElements[i].getAttribute('data-view')) {
      $dataViewElements[i].className = '';
    } else {
      $dataViewElements[i].className = 'hidden';
    }
  }
  assignIngredientType(selectedIngredientsArray);
  renderCookingSelection(selectedIngredientsArray);
  updateHighlightedIngredients(selectedIngredientsArray);
  calculateFinishedDish(selectedIngredientsArray);
}

// Function that only highlights selected ingredients in the ingredients array when the views are swapped.
function updateHighlightedIngredients(array) {
  const $allIngredientEntries = document.querySelectorAll('.ingredient-entry');
  // reset all ingredients to an unighlighted state
  for (let i = 0; i < $allIngredientEntries.length; i++) {
    $allIngredientEntries[i].className = 'ingredient-entry';
  }
  // highlight the ingredients in the selected array by getting the element id that matches the item ID
  if (selectedIngredientsArray.length !== 0) {
    for (let a = 0; a < selectedIngredientsArray.length; a++) {
      const currentingreidientID = selectedIngredientsArray[a].id;
      const $closestEntry = document.getElementById(currentingreidientID);
      $closestEntry.className = 'ingredient-entry highlight';
    }
  }
}

function assignIngredientType(selectedIngredientsArray) {
  for (let i = 0; i < selectedIngredientsArray.length; i++) {
    if (selectedIngredientsArray[i].id > 184) {
      selectedIngredientsArray[i].ingredientType = 'vegetable';
    } else if (selectedIngredientsArray[i].id > 173) {
      selectedIngredientsArray[i].ingredientType = 'mushroom';
    } else {
      selectedIngredientsArray[i].ingredientType = 'fruit';
    }
  }
}

const $cookedDishName = document.querySelector('#cooked-dish-name');
const $cookedDishHearts = document.querySelector('#cooked-hearts-healed');
const $cookedStatusEffect = document.querySelector('#cooked-status-effect');
const $finishedDishPicture = document.querySelector('#finished-dish');

function calculateFinishedDish(selectedIngredientsArray) {
  let totalHeartsHealed = 0;
  let storedStatusEffect = '';
  let statusCount = 0;
  let dishType = '';
  let mushroomBool = false;
  let fruitBool = false;
  let vegetableBool = false;
  let cookedDishImgSrc = '';
  // Heart Calculation
  for (let i = 0; i < selectedIngredientsArray.length; i++) {
    totalHeartsHealed += (selectedIngredientsArray[i].hearts_recovered * 2);
  }
  // Status Effect Calculation
  // first we store the first status effect we find.
  for (let i = 0; i < selectedIngredientsArray.length; i++) {
    if (selectedIngredientsArray[i].cooking_effect !== '') {
      storedStatusEffect = selectedIngredientsArray[i].cooking_effect;
      i = 6;
    }
    // then we check to see if that string matches the other ingredients in the array and count if it does, and assign confilcting status to storedStatusEffect if they dont
    for (let i = 0; i < selectedIngredientsArray.length; i++) {
      if (storedStatusEffect === selectedIngredientsArray[i].cooking_effect) {
        statusCount++;
      } else if (selectedIngredientsArray[i].cooking_effect !== '') {
        storedStatusEffect = 'Conflicting Status';
        i = 6;
      }
    }
  }
  // Calculate type of dish from type of ingredients used
  // first store how many of each ingredient is in the dish
  for (let i = 0; i < selectedIngredientsArray.length; i++) {
    switch (selectedIngredientsArray[i].ingredientType) {
      case 'mushroom':
        mushroomBool = true;
        break;
      case 'vegetable':
        vegetableBool = true;
        break;
      case 'fruit':
        fruitBool = true;
        break;
    }
  }
  // Using this type info we can decide what dish this is. I'm not sure how to do this other than a million if statements. sorry.
  if (fruitBool && mushroomBool && vegetableBool) {
    dishType = 'Steamed Mushrooms';
  } else if (mushroomBool && fruitBool) {
    dishType = 'Fruit and Mushroom Mix';
  } else if (mushroomBool && vegetableBool) {
    dishType = 'Steamed Mushrooms';
  } else if (fruitBool && vegetableBool) {
    dishType = 'Steamed Fruit';
  } else if (mushroomBool) {
    dishType = 'Mushroom Skewer';
  } else if (fruitBool) {
    dishType = 'Simmered Fruit';
  } else if (vegetableBool) {
    dishType = 'Fried Wild Greens';
  }

  // Find the image that corrosponds to the type of dish.
  switch (dishType) {
    case 'Steamed Mushrooms':
      cookedDishImgSrc = '/images/Steamed_Mushrooms.png';
      break;
    case 'Fruit and Mushroom Mix':
      cookedDishImgSrc = '/images/Fruit_and_Mushroom_Mix.png';
      break;
    case 'Steamed Fruit':
      cookedDishImgSrc = '/images/Steamed_Fruit.png';
      break;
    case 'Mushroom Skewer':
      cookedDishImgSrc = '/images/Mushroom_Skewer.png';
      break;
    case 'Simmered Fruit':
      cookedDishImgSrc = '/images/Simmered_Fruit.png';
      break;
    case 'Fried Wild Greens':
      cookedDishImgSrc = '/images/Fried_Wild_Greens.png';
      break;
    default:
      cookedDishImgSrc = '/images/No_Image_Symbol.png';
  }
  // Put all information into the elements on the page
  $cookedDishName.textContent = dishType;
  $cookedDishHearts.textContent = `Hearts Restored: ${totalHeartsHealed}`;
  $cookedStatusEffect.textContent = `Status Effect: ${storedStatusEffect}`;
  $finishedDishPicture.setAttribute('src', cookedDishImgSrc);
  return { totalHeartsHealed, storedStatusEffect, statusCount, dishType, cookedDishImgSrc };
}
