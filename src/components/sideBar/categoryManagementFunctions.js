// categoryManagement.js

// Function to create a new category
function createCategory() {
  const categoryName = document.querySelector('#customCategoryModal input[type="text"]').value;
  const isFinalNode = document.querySelector('#finalNodeCheckbox').checked;
  const selectedIcon = document.querySelector('#selectedIcon').textContent.trim();

  const categoryItem = document.createElement('div');
  categoryItem.className = 'collapsible-item';
  categoryItem.innerHTML = `
    <div class="tree-item" data-category-id="${Date.now()}" data-final-node="${isFinalNode}">
      <span class="collapsible-arrow">❯</span>
      <span class="tree-icon">${selectedIcon}</span>
      <span class="tree-label">${categoryName}</span>
      <button class="edit-category" onclick="editCategory(this)">Edit</button>
      <button class="delete-category" onclick="deleteCategory(this)">Delete</button>
    </div>
    <div class="tree-children" style="display: none;"></div>
  `;

  document.querySelector('#collapsibleContainer').appendChild(categoryItem);
  document.querySelector('#customCategoryModal').classList.add('hidden');
  resetModal();
}

// Function to reset the modal after creating or updating a category
function resetModal() {
  document.querySelector('#customCategoryModal input[type="text"]').value = '';
  document.querySelector('#finalNodeCheckbox').checked = false;
  document.querySelector('#selectedIcon').textContent = '';
  document.querySelector('#customCategoryModal').dataset.editingCategoryId = '';
  document.querySelector('#customCategoryModal').dataset.parentContainer = '';
}

// Function to edit a category
function editCategory(button) {
  const categoryItem = button.closest('.collapsible-item');
  const categoryId = categoryItem.querySelector('.tree-item').getAttribute('data-category-id');
  const categoryName = categoryItem.querySelector('.tree-label').textContent;
  const isFinalNode = categoryItem.querySelector('.tree-item').getAttribute('data-final-node') === 'true';
  const selectedIcon = categoryItem.querySelector('.tree-icon').textContent;

  document.querySelector('#customCategoryModal input[type="text"]').value = categoryName;
  document.querySelector('#finalNodeCheckbox').checked = isFinalNode;
  document.querySelector('#selectedIcon').textContent = selectedIcon;
  document.querySelector('#customCategoryModal').dataset.editingCategoryId = categoryId;
  document.querySelector('#customCategoryModal').dataset.parentContainer = categoryItem.querySelector('.tree-children').id;
  document.querySelector('#customCategoryModal').classList.remove('hidden');
}

// Function to update a category
function updateCategory() {
  const categoryId = document.querySelector('#customCategoryModal').dataset.editingCategoryId;
  const categoryName = document.querySelector('#customCategoryModal input[type="text"]').value;
  const isFinalNode = document.querySelector('#finalNodeCheckbox').checked;
  const selectedIcon = document.querySelector('#selectedIcon').textContent.trim();
  const parentContainerId = document.querySelector('#customCategoryModal').dataset.parentContainer;

  const categoryItem = document.querySelector(`[data-category-id="${categoryId}"]`);
  categoryItem.querySelector('.tree-label').textContent = categoryName;
  categoryItem.querySelector('.tree-icon').textContent = selectedIcon;
  categoryItem.setAttribute('data-final-node', isFinalNode);

  document.querySelector('#customCategoryModal').classList.add('hidden');
  resetModal();
}

// Function to create a new subcategory under an existing category
function createChildCategory(parentButton) {
  const parentCategoryItem = parentButton.closest('.collapsible-item');
  const parentCategoryId = parentCategoryItem.querySelector('.tree-item').getAttribute('data-category-id');
  const isFinalNode = parentCategoryItem.querySelector('.tree-item').getAttribute('data-final-node') === 'true';

  if (isFinalNode) {
    alert('This category is a final node and cannot have children.');
    return;
  }

  const childCategoryName = prompt('Enter the name of the new subcategory:');
  if (childCategoryName) {
    const childCategoryItem = document.createElement('div');
    childCategoryItem.className = 'collapsible-item';
    childCategoryItem.innerHTML = `
      <div class="tree-item" data-category-id="${Date.now()}" data-final-node="false">
        <span class="collapsible-arrow">❯</span>
        <span class="tree-icon"></span>
        <span class="tree-label">${childCategoryName}</span>
        <button class="edit-category" onclick="editCategory(this)">Edit</button>
        <button class="delete-category" onclick="deleteCategory(this)">Delete</button>
      </div>
      <div class="tree-children" style="display: none;"></div>
    `;

    const parentChildrenContainer = parentCategoryItem.querySelector('.tree-children');
    if (!parentChildrenContainer.id) {
      parentChildrenContainer.id = `children-${Date.now()}`;
    }
    parentChildrenContainer.appendChild(childCategoryItem);
    parentCategoryItem.querySelector('.tree-item').setAttribute('aria-expanded', 'true');
    parentChildrenContainer.style.display = 'block';
  }
}

// Function to add a button to clear the selected icon in the modal
function addClearIconButton() {
  const clearIconButton = document.createElement('button');
  clearIconButton.className = 'p-1 hover:bg-red-950 rounded-md text-red-500 ml-2 transition-opacity';
  clearIconButton.title = 'Clear Icon';
  clearIconButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 6 6 18"></path>
      <path d="m6 6 12 12"></path>
    </svg>
  `;
  clearIconButton.onclick = function() {
    document.querySelector('#selectedIcon').textContent = '';
  };

  document.querySelector('#iconSearch').parentElement.appendChild(clearIconButton);
}
