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
        <input type="text" name="shopping-list-edit" class="js-shopping-list-edit">
      </div>
    </li>`;
}


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

function toggleCheckedForListItem(itemIndex) {
  console.log('Toggling checked property for item at index ' + itemIndex);
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}

function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
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

function handleDeleteItemClicked() {
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    STORE.items.splice(itemIndex, 1);
    renderShoppingList();
  });
  console.log('`handleDeleteItemClicked` ran');
}

function handleEditItemClicked() {
  $('.js-shopping-list').on('click', '.js-item-edit', function(event) {
    const newName = $(this).siblings('input').val();
    const oldName = $(this).closest('li').find('.shopping-item').html();
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    console.log(itemIndex)
    function editItem(item) {
      if (item.name === oldName) {
        item.name = newName;
      }
    }
    for (let i = 0; i < STORE.items.length; i++) {
      console.log(STORE.items[itemIndex].name)
      if (STORE.items[i].name === STORE.items[itemIndex].name) {
        STORE.items[i].name = newName;
      }
    }
    // STORE.items.map(editItem);
    $('.js-shopping-list-edit').val('');
    renderShoppingList();
  });
}
  
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleCheckBoxClicked();
  handleEditItemClicked();
  filterList();

}

$(handleShoppingList);