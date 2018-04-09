'use strict';

const STORE = {
  items: [
    {name: 'apples', checked: false, hide: false},
    {name: 'oranges', checked: false, hide: false},
    {name: 'milk', checked: true, hide: false},
    {name: 'bread', checked: false, hide: false}
  ],
  sortBy: 'alpha'
};

// shopping list item template
function generateItemElement(item, itemIndex) {
  return `
    <li class="js-item-index-element ${item.hide ? 'hidden' : ''}" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
        <button class="shopping-item-edit js-item-edit">edit</button>
      </div>
    </li>`;
}

// create shopping list item
function generateShoppingItemsString(shoppingList) {
  console.log('Generating shopping list element');
  const items = shoppingList.map((item, index) => generateItemElement(item, index));
  return items.join('');
}

function renderShoppingList() {
  console.log('`renderShoppingList` ran');
  const shoppingListItemsString = generateShoppingItemsString(STORE.items);
  $('.js-shopping-list').html(shoppingListItemsString);
}

// adds items to shopping list
function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({name: itemName, checked: false, hide: false});
}
function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit( function(event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

//filters shopping list with add item input
function filterList() {
  $('.js-shopping-list-entry').keyup(function() {
    let currentValue = $(this).val();
    $('#shopping-list').find('.shopping-item').each(function() {
      if ($(this).text().indexOf(currentValue) < 0) {
        $(this).parent().addClass('hidden');
      } else {
        $(this).parent().removeClass('hidden');
      }
    });
  });
}

// functions for the checkbox
function toggleHideChecked(item) {
  if (item.checked) {
    item.hide = true;
  }
}
function hideCheckedElement() {
  STORE.items.map(toggleHideChecked);
}
function toggleShowChecked(item) {
  if (item.checked) {
    item.hide = false;
  }
}
function showCheckedElement() {
  STORE.items.map(toggleShowChecked);
}
function handleCheckBoxClicked() {
  const checkBox = document.getElementById('toggle-checked');
  $('#js-shopping-list-form :checkbox').click ( () => {
    if (checkBox.checked === true) {
      hideCheckedElement();
    } else {
      showCheckedElement();
    }
    renderShoppingList();
  });
}

function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

// cross out shopping list items
function toggleCheckedForListItem(itemIndex) {
  console.log('Toggling checked property for item at index ' + itemIndex);
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}
function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    const checkBox = document.getElementById('toggle-checked');
    if (checkBox.checked === true) {
      hideCheckedElement();
    }
    renderShoppingList();
  });
}

// delete items
function handleDeleteItemClicked() {
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    STORE.items.splice(itemIndex, 1);
    renderShoppingList();
  });
  console.log('`handleDeleteItemClicked` ran');
}

// Edit shopping list item name
function handleEditItemClicked() {
  $('.js-shopping-list').on('click', '.js-item-edit', function(event) {
    const $e = $(this).parent().siblings('span');
    console.log($e)
    if ($e.html().length > 50) {
      // this fixes a side effect that kept creating new inputs side by side whenever edit was clicked
    }else if ($e.hasClass('shopping-item') && !($e.hasClass('submit-form')) ) {
      const val = $($e).html();
      $e.html('<form id="submit-name-form"><input class="smaller-text" type="text" value="'+val+'" /> <button type="submit" name="submit-name" class="smaller-text">✔ </button></form>');
    }
  });
}
function handleNewNameSubmit () {
  $('.js-item-index-element').on('submit', function(event) {
    event.preventDefault();
    const newVal = $(this).children('span').children().children('input').val();
    $(this).children('span').html(newVal);
  });
}

// Old edit item feature
// function handleEditItemClicked() {
//   $('.js-shopping-list').on('click', '.js-item-edit', function(event) {
//     const newName = $(this).siblings('input').val();
//     // const currentName = $(this).closest('li').find('.shopping-item').html();
//     const itemIndex = getItemIndexFromElement(event.currentTarget);
//     if (newName.length > 0) {
//       for (let i = 0; i < STORE.items.length; i++) {
//         if (STORE.items[i].name === STORE.items[itemIndex].name) {
//           STORE.items[i].name = newName;
//         }
//       }
//     }
//     $('.js-shopping-list-edit').val('');
//     renderShoppingList();
//   });
// }

function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleCheckBoxClicked();
  handleEditItemClicked();
  filterList();
  handleNewNameSubmit();

}

$(handleShoppingList);