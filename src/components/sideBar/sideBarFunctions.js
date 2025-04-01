// Check if icons is already defined
if (typeof window.icons === "undefined") {
  window.icons = [];
}

// Fetch icons when the component loads
async function loadIcons() {
  try {
    const response = await fetch("/api/icons");
    const serverIcons = await response.json();

    // Process server icons to ensure proper size and class
    const processedServerIcons = serverIcons.map((icon) => ({
      name: icon.name,
      svg: icon.svg.replace(
        /<svg([^>]*)>/,
        '<svg$1 class="h-4 w-4" width="24" height="24">'
      ),
    }));

    window.icons = processedServerIcons;
    return window.icons;
  } catch (error) {
    console.error("Failed to load icons:", error);
    return [];
  }
}

async function searchIcons(searchTerm) {
  const iconsGrid = document.getElementById("iconsGrid");
  const gridContent = iconsGrid.querySelector("div");

  if (!window.icons.length) {
    window.icons = await loadIcons();
  }

  // Show/hide the grid based on search term
  iconsGrid.classList.toggle("hidden", !searchTerm);

  if (!searchTerm) return;

  // Filter and display icons
  const filteredIcons = window.icons.filter((icon) =>
    icon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  gridContent.innerHTML = filteredIcons
    .map(
      (icon) => `
    <button 
        class="p-2 hover:bg-[#1a1b1c] rounded-md flex items-center justify-center text-gray-400 hover:text-white"
        onclick="selectIcon('${icon.name}', ${JSON.stringify(
        icon.svg
      ).replace(/"/g, "&quot;")})"
    >
        ${icon.svg}
    </button>
`
    )
    .join("");
}

function selectIcon(name, svg) {
  const searchInput = document.getElementById("iconSearch");
  const selectedIcon = document.getElementById("selectedIcon");

  // Set the input value to the icon name
  searchInput.value = name;
  searchInput.dataset.selectedIcon = name;

  // Update the icon display
  selectedIcon.innerHTML = svg;

  // Hide the grid
  document.getElementById("iconsGrid").classList.add("hidden");
  document.getElementById("iconsGrid").children[0].innerHTML = "";
}

// Initialize
loadIcons();

function toggleCollapsible(element) {
  // Remove highlight from all nav items
  document
    .querySelectorAll(".nav")
    .forEach((nav) => nav.classList.remove("text-red-500"));

  // Toggle the content visibility
  const content = element.nextElementSibling;
  if (content) {
    content.classList.toggle("hidden");
  }

  // Rotate the arrow if it exists
  const arrow = element.querySelector(".collapsible-arrow");
  if (arrow) {
    arrow.style.transform = content.classList.contains("hidden")
      ? "rotate(0deg)"
      : "rotate(90deg)";
  }

  // Add highlight to current element
  element.classList.add("text-red-500");
}

function saveSidebar() {
  const content = document.getElementById("sidebarpage").outerHTML;
  fetch("/api/save-sidebar", {
    method: "POST",
    headers: {
      "Content-Type": "text/html",
    },
    body: content,
  })
    .then((response) => {
      if (response.ok) {
        console.log("Sidebar saved successfully");
       
      } else {
        console.error("Failed to save sidebar");
      }
    })
    .catch((error) => {
      console.error("Error saving sidebar:", error);
    });
}
