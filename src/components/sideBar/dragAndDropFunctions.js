// dragAndDrop.js

// Function to initialize drag-and-drop functionality
function initDragAndDrop() {
  const items = document.querySelectorAll('.collapsible-item');

  items.forEach(item => {
    item.setAttribute('draggable', 'true');

    item.addEventListener('dragstart', dragStart);
    item.addEventListener('dragover', dragOver);
    item.addEventListener('drop', drop);
    item.addEventListener('dragend', dragEnd);
  });
}

// Function to handle drag start
function dragStart(e) {
  e.dataTransfer.setData('text/plain', e.target.id);
  e.dataTransfer.effectAllowed = 'move';
  this.classList.add('dragging');
}

// Function to handle drag over
function dragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  this.classList.add('over');
}

// Function to handle drop
function drop(e) {
  e.preventDefault();
  const id = e.dataTransfer.getData('text/plain');
  const draggable = document.getElementById(id);
  const dropzone = this;

  if (draggable !== dropzone) {
    dropzone.appendChild(draggable);
  }

  this.classList.remove('over');
}

// Function to handle drag end
function dragEnd() {
  this.classList.remove('dragging');
}

// Initialize drag-and-drop functionality on page load
document.addEventListener('DOMContentLoaded', initDragAndDrop);
