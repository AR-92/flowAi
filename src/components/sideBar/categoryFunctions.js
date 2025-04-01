function createCategory() {
  const modal = document.querySelector("#customCategoryModal");
  const nameInput = modal.querySelector('input[type="text"][placeholder="Enter category name"]');
  const isFinalNode = modal.querySelector('#finalNodeCheckbox').checked;
  
  // Get icon from selectedIcon element, if empty use empty string
  const selectedIconElement = document.querySelector("#selectedIcon");
  const selectedIcon = selectedIconElement && selectedIconElement.innerHTML ? selectedIconElement.innerHTML : '';
  
  const newName = nameInput.value || "New Category";
  const categoryId = `category-${Math.random().toString(36).substr(2, 9)}`;
  
  const container = document.querySelector("#collapsibleContainer");
  const template = `
    <item class='collapsible-item' data-collapsible data-category id="${categoryId}" ${isFinalNode ? 'data-final-node' : ''} 
         draggable="true" ondragstart="initDrag(event)" ondragover="handleDragOver(event)" ondrop="handleDrop(event)">
      <div class='flex items-center justify-between text-sm text-gray-400 py-1 cursor-pointer hover:bg-[#1a1b1c] rounded-md px-2 relative tree-item' ${!isFinalNode ? 'onclick="toggleCollapsible(this)"' : ''}>
        <div class='flex items-center gap-2'>
          ${selectedIcon ? selectedIcon : ''}
          <span>${newName}</span>
        </div>
        <div class='flex items-center gap-2'>
          ${!isFinalNode ? `
            <button 
              class='p-1 hover:bg-[#2a2b2c] rounded-md opacity-0 hover:opacity-100 transition-opacity'
              onclick="event.stopPropagation(); createChildCategory(this)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 5v14M5 12h14"></path>
              </svg>
            </button>
          ` : ''}
          <button 
            class='p-1 hover:bg-[#2a2b2c] rounded-md opacity-0 hover:opacity-100 transition-opacity'
            onclick="event.stopPropagation(); editCategory(this)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
              <path d="m15 5 4 4"/>
            </svg>
          </button>
          <button 
            class='p-1 hover:bg-red-950 rounded-md opacity-0 hover:opacity-100 transition-opacity text-red-500'
            _="on click remove closest <item/>"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              <line x1="10" x2="10" y1="11" y2="17"></line>
              <line x1="14" x2="14" y1="11" y2="17"></line>
            </svg>
          </button>
          ${!isFinalNode ? `
            <svg class="collapsible-arrow transform transition-transform duration-200 h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          ` : ''}
        </div>
      </div>
      ${!isFinalNode ? `
        <div class='pl-2 space-y-1 hidden tree-children' data-category-container>
          <!-- Child categories will be added here -->
        </div>
      ` : ''}
    </item>
  `;

  container.insertAdjacentHTML("beforeend", template);
  
  // Reset modal
  modal.classList.add("hidden");
  nameInput.value = "";
  modal.querySelector('#finalNodeCheckbox').checked = false;
  document.querySelector("#selectedIcon").innerHTML = ''; // Set to empty string instead of default icon
  document.querySelector("#iconSearch").value = "";
  document.querySelector("#iconSearch").dataset.selectedIcon = "";
  
  reloadHyperscript();
}

function reloadHyperscript() {
    const hyperscriptScript = document.querySelector('script[src$="hyperscript.js"]');
    if (hyperscriptScript) {
        const src = hyperscriptScript.getAttribute('src');
        hyperscriptScript.remove();
        const newScript = document.createElement('script');
        newScript.src = src;
        document.head.appendChild(newScript);
    }
}

function editCategory(button) {
  document.querySelector("#selectedIcon").innerHTML = ''; // Set to empty string instead of default icon
  const categoryDiv = button.closest("[data-category]");
  const nameElement = categoryDiv.querySelector("div > div:first-child > span");
  const currentName = nameElement.textContent.trim();
  const iconElement = categoryDiv.querySelector("div > div:first-child > svg"); // Find icon if it exists
  const isFinalNode = categoryDiv.hasAttribute('data-final-node'); // Add this line to get the final node status

  // Show modal with current values
  const modal = document.querySelector("#customCategoryModal");
  const nameInput = modal.querySelector('input[type="text"][placeholder="Enter category name"]');
  const selectedIcon = document.querySelector("#selectedIcon");
  const iconSearch = document.querySelector("#iconSearch");
  
  // Set the name in the correct input field
  nameInput.value = currentName;
  iconSearch.value = ""; // Clear the icon search field
  
  // Only set icon HTML if an icon exists
  if (iconElement) {
    selectedIcon.innerHTML = iconElement.outerHTML;
  }
  modal.querySelector('#finalNodeCheckbox').checked = isFinalNode;  // Now isFinalNode is defined
  modal.dataset.editingCategoryId = categoryDiv.id;

  // Add a clear icon button with improved styling
  const clearIconButton = document.createElement('button');
  clearIconButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 6 6 18"></path>
      <path d="m6 6 12 12"></path>
    </svg>
  `;
  clearIconButton.className = "p-1 hover:bg-red-950 rounded-md text-red-500 ml-2 transition-opacity";
  clearIconButton.title = "Clear Icon";
  clearIconButton.onclick = () => {
    document.querySelector("#selectedIcon").innerHTML = '';
    document.querySelector("#iconSearch").value = "";
    document.querySelector("#iconSearch").dataset.selectedIcon = "";
  };
  
  // Remove any existing clear button
  const existingClearButton = iconSearch.parentNode.querySelector('button');
  if (existingClearButton) {
    existingClearButton.remove();
  }
  
  // Insert the clear button after the icon search input
  iconSearch.parentNode.insertBefore(clearIconButton, iconSearch.nextSibling);

  // Update button
  const createButton = modal.querySelector("button.bg-blue-500");  // or whatever selector matches your button
  createButton.textContent = "Update Category";
  createButton.onclick = () => updateCategory(categoryDiv.id);

  // Show modal
  modal.classList.remove("hidden");
}

function updateCategory(categoryId) {
  const categoryDiv = document.getElementById(categoryId);
  const modal = document.querySelector("#customCategoryModal");
  const nameInput = modal.querySelector('input[type="text"][placeholder="Enter category name"]');
  const selectedIcon = document.querySelector("#selectedIcon").innerHTML || '';  // Make sure empty string if no icon
  const isFinalNode = modal.querySelector('#finalNodeCheckbox').checked;
  const newName = nameInput.value;
  
  // Update category attributes
  categoryDiv.toggleAttribute('data-final-node', isFinalNode);
  
  // Update the header content
  const headerDiv = categoryDiv.querySelector("div:first-child");
  headerDiv.innerHTML = `
    <div class='flex items-center gap-2'>
      ${selectedIcon ? selectedIcon : ''}
      <span>${newName}</span>
    </div>
    <div class='flex items-center gap-2'>
      ${!isFinalNode ? `
        <button 
          class='p-1 hover:bg-[#2a2b2c] rounded-md opacity-0 hover:opacity-100 transition-opacity'
          onclick="event.stopPropagation(); createChildCategory(this)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 5v14M5 12h14"></path>
          </svg>
        </button>
      ` : ''}
      <button 
        class='p-1 hover:bg-[#2a2b2c] rounded-md opacity-0 hover:opacity-100 transition-opacity'
        onclick="event.stopPropagation(); editCategory(this)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
          <path d="m15 5 4 4"/>
        </svg>
      </button>
      <button 
        class='p-1 hover:bg-red-950 rounded-md opacity-0 hover:opacity-100 transition-opacity text-red-500'
        _="on click remove closest <item/>"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 6h18"></path>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          <line x1="10" x2="10" y1="11" y2="17"></line>
          <line x1="14" x2="14" y1="11" y2="17"></line>
        </svg>
      </button>
      ${!isFinalNode ? `
        <svg class="collapsible-arrow transform transition-transform duration-200 h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m9 18 6-6-6-6"/>
        </svg>
      ` : ''}
    </div>
  `;

  // Reset modal
  modal.classList.add("hidden");
  nameInput.value = "";
  modal.querySelector('#finalNodeCheckbox').checked = false;
  document.querySelector("#selectedIcon").innerHTML = ''; // Set to empty string instead of default icon
  document.querySelector("#iconSearch").value = "";
  document.querySelector("#iconSearch").dataset.selectedIcon = "";
  modal.dataset.editingCategoryId = "";
  
  // Update onclick handler for final nodes
  if (isFinalNode) {
    headerDiv.removeAttribute('onclick');
  } else {
    headerDiv.setAttribute('onclick', 'toggleCollapsible(this)');
  }
}

function createChildCategory(button) {
    const parentCategory = button.closest('[data-category]');
    
    // Check if parent is a final node
    if (parentCategory.hasAttribute('data-final-node')) {
        return; // Don't allow child creation for final nodes
    }
    
    const categoryContainer = parentCategory.querySelector('[data-category-container]');
    const modal = document.querySelector("#customCategoryModal");
    const nameInput = modal.querySelector('input[type="text"][placeholder="Enter category name"]');
    const createButton = modal.querySelector("button.bg-blue-500");

    // Show modal
    modal.classList.remove("hidden");
    
    // Store reference to parent container
    modal.dataset.parentContainer = categoryContainer.id || 
        `category-container-${Math.random().toString(36).substr(2, 9)}`;
        
    // Update button
    createButton.textContent = "Create Subcategory";
    createButton.onclick = () => {
        const isFinalNode = modal.querySelector('#finalNodeCheckbox').checked;
        const selectedIcon = document.querySelector("#selectedIcon").innerHTML || ''; // Make icon optional
        const newName = nameInput.value || "New Category";
        const categoryId = `category-${Math.random().toString(36).substr(2, 9)}`;
        
        // Define child category template
        const childTemplate = `
          <item class='collapsible-item' data-collapsible data-category id="${categoryId}" ${isFinalNode ? 'data-final-node' : ''} 
               draggable="true" ondragstart="initDrag(event)" ondragover="handleDragOver(event)" ondrop="handleDrop(event)">
            <div class='flex items-center justify-between text-sm text-gray-400 py-1 cursor-pointer hover:bg-[#1a1b1c] rounded-md px-2 relative tree-item' ${!isFinalNode ? 'onclick="toggleCollapsible(this)"' : ''}>
              <div class='flex items-center gap-2'>
                ${selectedIcon ? selectedIcon : ''}
                <span>${newName}</span>
              </div>
              <div class='flex items-center gap-2'>
                ${!isFinalNode ? `
                  <button 
                    class='p-1 hover:bg-[#2a2b2c] rounded-md opacity-0 hover:opacity-100 transition-opacity'
                    onclick="event.stopPropagation(); createChildCategory(this)"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 5v14M5 12h14"></path>
                    </svg>
                  </button>
                ` : ''}
                <button 
                  class='p-1 hover:bg-[#2a2b2c] rounded-md opacity-0 hover:opacity-100 transition-opacity'
                  onclick="event.stopPropagation(); editCategory(this)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                    <path d="m15 5 4 4"/>
                  </svg>
                </button>
                <button 
                  class='p-1 hover:bg-red-950 rounded-md opacity-0 hover:opacity-100 transition-opacity text-red-500'
                  _="on click remove closest <item/>"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    <line x1="10" x2="10" y1="11" y2="17"></line>
                    <line x1="14" x2="14" y1="11" y2="17"></line>
                  </svg>
                </button>
                ${!isFinalNode ? `
                  <svg class="collapsible-arrow transform transition-transform duration-200 h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                ` : ''}
              </div>
            </div>
            ${!isFinalNode ? `
              <div class='pl-2 space-y-1 hidden tree-children' data-category-container>
                <!-- Child categories will be added here -->
              </div>
            ` : ''}
          </item>
        `;

        categoryContainer.insertAdjacentHTML("beforeend", childTemplate);
        
        // Reset modal
        modal.classList.add("hidden");
        nameInput.value = "";
        createButton.textContent = "Create Category";
        createButton.onclick = createCategory;
        modal.dataset.parentContainer = "";
        modal.querySelector('#finalNodeCheckbox').checked = false;
        document.querySelector("#selectedIcon").innerHTML = ''; // Set to empty string instead of default icon
        document.querySelector("#iconSearch").value = "";
        document.querySelector("#iconSearch").dataset.selectedIcon = "";
        
        reloadHyperscript();
    };
}

function addClearIconButton() {
  const iconSearch = document.querySelector("#iconSearch");
  
  // Remove existing clear button if any
  const existingClearButton = iconSearch.parentNode.querySelector('button');
  if (existingClearButton) {
    existingClearButton.remove();
  }
  
  const clearIconButton = document.createElement('button');
  clearIconButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 6 6 18"></path>
      <path d="m6 6 12 12"></path>
    </svg>
  `;
  clearIconButton.className = "p-1 hover:bg-red-950 rounded-md text-red-500 ml-2 transition-opacity";
  clearIconButton.title = "Clear Icon";
  clearIconButton.onclick = () => {
    document.querySelector("#selectedIcon").innerHTML = '';
    iconSearch.value = "";
    iconSearch.dataset.selectedIcon = "";
  };
  
  iconSearch.parentNode.insertBefore(clearIconButton, iconSearch.nextSibling);
}

// Export functions for use in HTML
window.createCategory = createCategory;
window.editCategory = editCategory;
window.updateCategory = updateCategory;
window.createChildCategory = createChildCategory;

// New Drag and Drop Implementation
let currentDragItem = null;

function initDrag(e) {
    currentDragItem = e.currentTarget;
  e.dataTransfer.setData('text/plain', currentDragItem.id);
  e.dataTransfer.effectAllowed = 'move';
  currentDragItem.classList.add('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
  e.dataTransfer.dropEffect = 'move';

  console.log('handleDragOver called on:', e.currentTarget);

  // Check if the drop target is a valid drop zone
  if (e.currentTarget.hasAttribute('data-category-container') || e.currentTarget.hasAttribute('data-category')) {
    e.currentTarget.classList.add('drop-hover');
    e.currentTarget.classList.remove('drop-hover-invalid');
  } else {
    e.currentTarget.classList.add('drop-hover-invalid');
    e.currentTarget.classList.remove('drop-hover');
  }

  // Create and position the drag preview
  if (!document.querySelector('.drag-preview')) {
    const preview = document.createElement('div');
    preview.className = 'drag-preview';
    preview.textContent = currentDragItem.querySelector('.tree-item span').textContent;
    document.body.appendChild(preview);
  }

  const preview = document.querySelector('.drag-preview');
  preview.style.left = `${e.clientX - 10}px`; // Adjust position slightly
  preview.style.top = `${e.clientY - 10}px`; // Adjust position slightly
}

function handleDragLeave(e) {
    console.log('handleDragLeave called on:', e.currentTarget);
  e.currentTarget.classList.remove('drop-hover');
  e.currentTarget.classList.remove('drop-hover-invalid');
}

function handleDrop(e) {
    e.preventDefault();
  
  // Get elements
  const dropTarget = e.currentTarget;
  const draggedItem = currentDragItem;
  
  // Clean up
  document.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
  currentDragItem = null;

  // Remove hover classes from all drop targets
  document.querySelectorAll('.drop-hover, .drop-hover-invalid').forEach(el => {
    el.classList.remove('drop-hover');
    el.classList.remove('drop-hover-invalid');
  });

  // Validate drop
  if (!draggedItem || !dropTarget || draggedItem === dropTarget || 
      draggedItem.contains(dropTarget)) {
    return;
  }

  // Handle drop into container
  if (dropTarget.hasAttribute('data-category-container')) {
    dropTarget.appendChild(draggedItem);
  } 
  // Handle drop between items
  else {
    const rect = dropTarget.getBoundingClientRect();
    const container = dropTarget.parentNode;
    const insertPosition = e.clientY < rect.top + rect.height/2 ? 
                          'before' : 'after';
    
    if (insertPosition === 'before') {
      container.insertBefore(draggedItem, dropTarget);
    } else {
      container.insertBefore(draggedItem, dropTarget.nextSibling);
    }
  }
  
  // Refresh hyperscript
  reloadHyperscript();
}

// Initialize drag and drop on all category items
function initDragAndDrop() {
document.querySelectorAll('[data-category]').forEach(item => {
    console.log('Adding event listeners to:', item);
    item.setAttribute('draggable', 'true');
    item.ondragstart = initDrag;
    item.ondragover = handleDragOver;
    item.ondragleave = handleDragLeave;
    item.ondrop = handleDrop;
});
}

window.addClearIconButton = addClearIconButton;
window.initDragAndDrop = initDragAndDrop;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initDragAndDrop();
});
