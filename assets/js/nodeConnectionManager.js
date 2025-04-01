// Global variables to track the currently selected connection point and all active connections
let selectedConnPoint = null;
let connections = [];

/**
 * Updates all connection paths in the graph
 * Called when nodes are moved or the canvas is transformed
 */
function updateAllConnections() {
  connections.forEach(conn => updateConnection(conn));
}

/**
 * Updates a single connection's path between two points
 * Handles coordinate transformations and creates a curved path
 * @param {Object} conn - Connection object containing from/to points and SVG path
 */
function updateConnection(conn) {
  const pointA = conn.from;
  const pointB = conn.to;
  // Get the actual screen coordinates of connection points
  const rectA = pointA.getBoundingClientRect();
  const rectB = pointB.getBoundingClientRect();

  // Calculate center points in viewport coordinates
  const viewportX1 = rectA.left + rectA.width / 2;
  const viewportY1 = rectA.top + rectA.height / 2;
  const viewportX2 = rectB.left + rectB.width / 2;
  const viewportY2 = rectB.top + rectB.height / 2;

  // Transform viewport coordinates to the scaled/panned coordinate system
  // This ensures connections stay aligned when zooming/panning
  const x1 = (viewportX1 - translateX) / scale;
  const y1 = (viewportY1 - translateY) / scale;
  const x2 = (viewportX2 - translateX) / scale;
  const y2 = (viewportY2 - translateY) / scale;

  // Create smooth Bézier curve control points
  // Control points are offset horizontally based on distance between points
  const dx = Math.abs(x2 - x1);
  const controlOffset = dx * 0.3; // 30% of horizontal distance
  const c1x = x1 + (x2 > x1 ? controlOffset : -controlOffset);
  const c1y = y1;
  const c2x = x2 + (x1 > x2 ? controlOffset : -controlOffset);
  const c2y = y2;

  // Update SVG path using cubic Bézier curve
  conn.path.setAttribute('d', `M ${x1} ${y1} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x2} ${y2}`);
}

/**
 * Creates a new connection between two points
 * @param {HTMLElement} outputPoint - Source connection point
 * @param {HTMLElement} inputPoint - Target connection point
 */
function createConnection(outputPoint, inputPoint) {
  // Prevent duplicate connections between same points
  for (const conn of connections) {
    if (conn.from === outputPoint && conn.to === inputPoint) {
      return;
    }
  }

  // Create SVG path element for the connection
  const svgns = "http://www.w3.org/2000/svg";
  const path = document.createElementNS(svgns, 'path');
  path.setAttribute('stroke', '#494949');
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke-width', '2');
  path.style.pointerEvents = "auto";

  // Add hyperscript for click-to-delete functionality
  path.setAttribute('_', `on click remove me`);
  
  // Add path to SVG overlay and track in connections array
  document.querySelector('.svg-overlay').appendChild(path);
  connections.push({ from: outputPoint, to: inputPoint, path: path });
  updateConnection(connections[connections.length - 1]);
}

/**
 * Global click handler for connection points
 * Manages the connection creation workflow:
 * 1. Click output point to start
 * 2. Click input point to complete connection
 */
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('conn-point')) {
    e.stopPropagation();
    const point = e.target;
    const type = point.getAttribute('data-type');

    if (!selectedConnPoint) {
      // Start new connection from output point
      if (type === 'output') {
        selectedConnPoint = point;
        point.classList.add('selected');
      }
    } else {
      // Complete connection to input point
      if (type === 'input' && selectedConnPoint !== point) {
        // Prevent self-connections within same node
        if (selectedConnPoint.parentElement === point.parentElement) {
          selectedConnPoint.classList.remove('selected');
          selectedConnPoint = null;
          return;
        }
        createConnection(selectedConnPoint, point);
      }
      selectedConnPoint.classList.remove('selected');
      selectedConnPoint = null;
    }
  }
});

/**
 * Adds a new connection point to a node
 * @param {HTMLElement} node - The node to add the point to
 * @param {string} type - Either 'input' or 'output'
 */
function addConnectionPoint(node, type) {
  const newPoint = document.createElement('div');
  newPoint.classList.add('conn-point');
  newPoint.classList.add(type === 'input' ? 'input-conn-point' : 'output-conn-point');
  newPoint.setAttribute('data-type', type);
  
  // Stack multiple points vertically
  const existing = node.querySelectorAll(`.conn-point[data-type="${type}"]`).length;
  newPoint.style.top = `calc(50% + ${existing * 20}px)`;
  node.appendChild(newPoint);
}

/**
 * Sets up event listeners for connection point add buttons
 * @param {HTMLElement} node - The node to initialize controls for
 */
function initNodeControls(node) {
  const addInputBtn = node.querySelector('.add-input-conn');
  const addOutputBtn = node.querySelector('.add-output-conn');
  
  if (addInputBtn) {
    addInputBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      addConnectionPoint(node, 'input');
    });
  }
  if (addOutputBtn) {
    addOutputBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      addConnectionPoint(node, 'output');
    });
  }
}



function reloadJs(src) {
  // Find the first script whose "src" ends with the given string.
  var scriptEl = document.querySelector('script[src$="' + src + '"]');
  if (!scriptEl) return;

  // Get the full src from that element.
  var fullSrc = scriptEl.getAttribute('src');

  // Remove all script elements with a src that ends with the fullSrc.
  var scripts = document.querySelectorAll('script[src$="' + fullSrc + '"]');
  scripts.forEach(function (el) {
    el.parentNode.removeChild(el);
  });

  // Create a new script element, set its src, and append it to the head.
  var newScript = document.createElement('script');
  newScript.src = fullSrc;
  document.head.appendChild(newScript);
}

/**
 * Deletes all connections associated with a node
 * @param {HTMLElement} node - The node whose connections should be deleted
 */
function deleteNodeConnections(node) {
  // Find all connections that involve this node
  const connectionsToRemove = connections.filter(conn => {
    const fromBelongsToNode = conn.from.closest('.draggable') === node;
    const toBelongsToNode = conn.to.closest('.draggable') === node;
    return fromBelongsToNode || toBelongsToNode;
  });

  // Remove SVG paths from DOM
  connectionsToRemove.forEach(conn => {
    conn.path.remove();
  });

  // Update connections array to remove deleted connections
  connections = connections.filter(conn => {
    const fromBelongsToNode = conn.from.closest('.draggable') === node;
    const toBelongsToNode = conn.to.closest('.draggable') === node;
    return !(fromBelongsToNode || toBelongsToNode);
  });
}

/**
 * Recursively deletes all child nodes connected to outputs
 * @param {HTMLElement} parentNode - The starting node whose children should be deleted
 */
function deleteAllChildrenNodes(parentNode) {
    // Get all output points from parent
    const parentOutputs = parentNode.querySelectorAll('.conn-point[data-type="output"]');
    
    // Track nodes to delete (using Set to avoid duplicates)
    const nodesToDelete = new Set();

    // Recursive function to find all connected children
    function findChildNodes(outputPoints) {
        outputPoints.forEach(outputPoint => {
            // Check all connections for ones starting from this output
            connections.forEach(conn => {
                if (conn.from === outputPoint) {
                    // Found a child node
                    const childNode = conn.to.closest('.draggable');
                    if (childNode && !nodesToDelete.has(childNode)) {
                        // Add to deletion set and recurse into its children
                        nodesToDelete.add(childNode);
                        const childOutputs = childNode.querySelectorAll('.conn-point[data-type="output"]');
                        findChildNodes(childOutputs);
                    }
                }
            });
        });
    }

    // Start recursive search from parent outputs
    findChildNodes(parentOutputs);

    // Delete all found nodes and their connections
    nodesToDelete.forEach(node => {
        deleteNodeConnections(node);  // Clean up connections first
        node.remove();  // Remove node from DOM
    });
}

// Example usage in hyperscript:
// _="on click 
//    set node to closest .draggable
//    call deleteAllChildrenNodes(node)"
