
const zoomableDiv = document.querySelector('.zoomable');
const contentDiv = document.querySelector('.content');
const bgDotsDiv = document.querySelector('.bg-dots');

// Keep variables scoped to this file
var scale = 1;
var translateX = 0;
var translateY = 0;
let isPanning = false;
let startX, startY;

// Add custom event handlers for zoom controls
document.addEventListener('custom:zoomIn', () => {
    scale = Math.min(scale + 0.1, 2);
    updateTransform();
});

document.addEventListener('custom:zoomOut', () => {
    scale = Math.max(scale - 0.1, 0.5);
    updateTransform();
});

// Add reset zoom handler
document.addEventListener('custom:zoomReset', () => {
    scale = 1;
    translateX = 0;
    translateY = 0;
    updateTransform();
});

/**
 * Updates both the content transform and the background dots size
 */
function updateTransform() {
  contentDiv.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
  
  // Update background dots size based on zoom level
  // Base size is 20px, scale it inversely with zoom to maintain relative size
  const baseDotSize = 20;
  const minDotSize = 20;  // Minimum dot size in pixels
  const maxDotSize = 40; // Maximum dot size in pixels
  
  // Calculate new dot size and clamp it between min and max
  const newDotSize = Math.min(Math.max(baseDotSize / scale, minDotSize), maxDotSize);
  bgDotsDiv.style.backgroundSize = `${newDotSize}px ${newDotSize}px`;
  
  //logVirtualResolution();
}

/**
 * The virtual resolution represents the effective (unscaled) content area.
 * Since the outer container is fixed full-screen, dividing its dimensions by the
 * current scale gives the virtual coordinate space for the content.
 */
// function logVirtualResolution() {
//   // const containerWidth = zoomableDiv.clientWidth;
//   // const containerHeight = zoomableDiv.clientHeight;
//   // const virtualWidth = containerWidth / scale;
//   // const virtualHeight = containerHeight / scale;
//   // console.log(`Virtual Resolution: ${Math.round(virtualWidth)} x ${Math.round(virtualHeight)} px`);
// }

// Zoom with Mouse Wheel on the full-screen container
zoomableDiv.addEventListener('wheel', (event) => {
  event.preventDefault(); // Prevent default scrolling
  const zoomSpeed = 0.1;
  const rect = zoomableDiv.getBoundingClientRect();

  // Calculate the mouse position in content coordinates before zoom
  const mouseXBefore = (event.clientX - rect.left - translateX) / scale;
  const mouseYBefore = (event.clientY - rect.top - translateY) / scale;

  // Update scale based on wheel delta (minimum scale 0.5)
  if (event.deltaY < 0) {
    scale += zoomSpeed;
  } else {
    scale = Math.max(0.2, scale - zoomSpeed);
  }

  // Calculate mouse position in content coordinates after zoom
  const mouseXAfter = (event.clientX - rect.left - translateX) / scale;
  const mouseYAfter = (event.clientY - rect.top - translateY) / scale;

  // Adjust translation so that zoom centers around the mouse position
  translateX += (mouseXAfter - mouseXBefore) * scale;
  translateY += (mouseYAfter - mouseYBefore) * scale;

  updateTransform();
});

// Panning (dragging) on the full-screen container
zoomableDiv.addEventListener('mousedown', (event) => {
  // If a draggable element is clicked, skip panning
  if (event.target.closest('.draggable')) return;
  isPanning = true;
  startX = event.clientX - translateX;
  startY = event.clientY - translateY;
  zoomableDiv.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (event) => {
  if (!isPanning) return;
  translateX = event.clientX - startX;
  translateY = event.clientY - startY;
  updateTransform();
});

document.addEventListener('mouseup', () => {
  isPanning = false;
  zoomableDiv.style.cursor = 'grab';
});

