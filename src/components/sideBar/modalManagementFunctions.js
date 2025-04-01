// modalManagement.js

// Function to open the modal
function openModal() {
  document.querySelector('#customCategoryModal').classList.remove('hidden');
}

// Function to close the modal
function closeModal() {
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

// Initialize modal management functionality on page load
document.addEventListener('DOMContentLoaded', addClearIconButton);
