# FlowAI: AI Workflow Editor

A web-based node editor designed for visually creating and managing AI workflows. Built with vanilla JavaScript, HTMX, and Hyperscript for a lightweight, fast, and interactive experience without complex build steps.

## Features

- 🎯 **Intuitive Interface:** Drag-and-drop nodes to build complex AI pipelines visually.
- ✨ **Dynamic Updates:** Leverages HTMX for seamless partial page updates.
- ⚡ **Interactive Elements:** Uses Hyperscript for client-side behaviors and event handling.
- 🎨 **Modern Styling:** Styled with Tailwind CSS, including a dark theme for comfortable use.
- ↔️ **Node Connections:** Easily connect nodes to define data flow using SVG lines.
- 🔍 **Canvas Navigation:** Smooth zoom and pan functionality for navigating large workflows.
- 🧩 **Extendable Nodes:** Simple structure for adding new custom node types.
- 📱 **Responsive Design:** Adapts to various screen sizes.
- `[Add any other specific features your project has, e.g., Save/Load, specific AI integrations, data validation, etc.]`

## Screenshots (Optional)

`[Consider adding a screenshot or GIF demonstrating your editor here]`
`![FlowAI Screenshot](link/to/your/screenshot.png)`

## Project Structure

*Note: Please update this section to accurately reflect your project's file and directory layout.*

```
flowai/
├── public/                     # Or root directory if no specific public folder
│   ├── index.html              # Main application entry point
│   ├── assets/
│   │   ├── css/
│   │   │   └── style.css       # Compiled Tailwind or custom CSS
│   │   └── images/             # Icons, logos, etc.
│   ├── js/
│   │   └── vendor/             # Third-party libraries
│   │       ├── htmx.min.js
│   │       └── hyperscript.min.js
│   └── templates/              # HTML fragments/templates loaded by HTMX
│       └── nodes/
│           ├── input_node.html # Example node template
│           └── [other_node_types].html
├── src/                        # Source files (JS modules, etc.)
│   ├── js/
│   │   ├── main.js             # Core application logic
│   │   ├── canvas.js           # Zoom, pan, drawing logic
│   │   ├── nodes.js            # Node management logic
│   │   ├── ui.js               # UI interactions (sidebar, modals, etc.)
│   │   └── utils.js            # Utility functions
│   └── [other_source_dirs]/    # e.g., styles source if using preprocessor
├── [tailwind.config.js]        # Optional: If using Tailwind CLI/JIT
├── [package.json]              # Optional: If using npm for dependencies/scripts
└── README.md
```

## Installation & Setup

This project is designed to run directly in the browser without a complex build process.

1.  **Clone the repository:**
    ```bash
    git clone [your-repository-url]
    cd flowai
    ```
2.  **Install Dependencies (if any):**
    *   If you are using `npm` (e.g., for Tailwind CLI), run:
        ```bash
        npm install
        ```
    *   Otherwise, ensure the necessary libraries (`htmx.js`, `hyperscript.js`) are included in your project, likely within a `vendor` or `lib` directory referenced by `index.html`.
3.  **Run Locally:**
    *   You need a simple local web server to handle potential HTMX requests correctly and avoid CORS issues. You can use Python's built-in server, `live-server` via npm, or any other static file server.
    *   Example using Python 3:
        ```bash
        python -m http.server 8000
        ```
    *   Then, open your browser and navigate to `http://localhost:8000` (or the appropriate port).

## Usage & Controls

### Main Interface
-   **Canvas:** The main area where you build your workflow.
-   **Toolbar:** Typically located at the top or side, contains buttons for adding elements. `[Describe location, e.g., Top-left]`
-   **Sidebar:** Contains node libraries, settings, or other panels. `[Describe how to toggle]`

### Canvas Navigation
-   **Pan:** Click and drag on the empty canvas background.
-   **Zoom:** Use the mouse wheel while hovering over the canvas. Alternatively, use dedicated zoom in/out buttons `[if they exist]`.
-   **Reset View:** Click the reset view button `[Describe location, e.g., Bottom-left corner]`.

### Workflow Building
-   **Add Node:** Click the 'Add Node' button `[Describe location/icon]` in the toolbar or sidebar, then select the desired node type. `[Or describe drag-drop from palette]`
-   **Connect Nodes:** Click and drag from an output port on one node to an input port on another.
-   **Configure Node:** Double-click or click a settings icon on a node to open its configuration panel. `[Adjust based on your interaction]`
-   **Delete Node/Connection:** Select the element and press the `Delete` key, or use a context menu/button. `[Adjust based on your interaction]`
-   **Add Note/Comment:** Use the 'Add Note' button `[Describe location/icon]` to add text annotations to the canvas.

### Other Controls
-   **View Code/Export:** `[Describe button location/icon]` Generates or displays the underlying workflow definition (e.g., JSON).
-   **Chat/Help:** `[Describe button location/icon]` Opens a chat interface or help documentation. `[Remove if not applicable]`

## Technologies Used

-   **Frontend:**
    -   HTML5
    -   CSS3 (with Tailwind CSS for utility-first styling)
    -   Vanilla JavaScript (ES6+)
-   **Interactivity & Updates:**
    -   **HTMX:** Handles dynamic HTML loading and partial page updates via HTML attributes.
    -   **Hyperscript:** Adds behavior and interactivity directly within HTML using the `_` attribute.
-   **Graphics:**
    -   SVG: Used for rendering node connection lines.
-   **Communication:**
    -   Custom DOM Events: Used for communication between different components (e.g., node added, connection made).
-   `[Add any other libraries or tools, e.g., specific drawing libraries, state management, backend language/framework if applicable]`

## Development

Since this project primarily uses vanilla JS, HTMX, and Hyperscript without a transpilation/build step (unless you added one for Tailwind, etc.):

1.  Ensure you have a local web server running (see Installation & Setup).
2.  Edit the HTML, CSS, and JavaScript files directly in the `public/` or `src/` directories.
3.  Refresh your browser to see the changes.
4.  If using Tailwind CLI in watch mode, it will automatically rebuild your `style.css` upon changes to source files or `tailwind.config.js`.

## Contributing

Contributions are welcome!

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

Please ensure your code follows the existing style and includes relevant updates if you add new features or change existing ones. Consider opening an issue first to discuss significant changes.

## License

Distributed under the MIT License. See `LICENSE` file for more information (or state directly here).

```

**Key Changes and Placeholders:**

1.  **Project Name:** Changed "Node Flow Editor" to "FlowAI" (you can change this back or use your actual project name).
2.  **Features:** Added placeholders `[...]` for you to add unique features of *your* specific editor.
3.  **Screenshots:** Added an optional section placeholder. Visuals are very helpful!
4.  **Project Structure:** Provided a *more common* example structure (separating `public` assets, `src` code, `templates`). **Crucially, update this to match your actual layout.**
5.  **Installation & Setup:** Made more explicit steps, including the need for a local server and optional `npm install`.
6.  **Usage & Controls:** Made controls descriptions slightly more generic with placeholders `[...]` for you to specify exact locations/interactions based on *your* UI design.
7.  **Technologies Used:** Clarified roles (HTMX for updates, Hyperscript for behavior), added Vanilla JS explicitly, mentioned SVG, Custom Events, and added a placeholder for other tech.
8.  **Development:** Added notes about the local server and optional Tailwind watch mode.
9.  **Contributing:** Added standard Git workflow steps.
10. **License:** Added placeholder for `LICENSE` file.

**Next Steps for You:**

1.  **Replace Placeholders:** Go through the text and replace all instances of `[LIKE THIS]` with your project's specific details (name, features, file paths, control locations, extra technologies, repo URL).
2.  **Verify Structure:** Make sure the `Project Structure` section accurately reflects your folders and key files.
3.  **Add Screenshots:** If possible, add a visual element.
4.  **Review:** Read through it one last time to ensure it accurately represents your project.
