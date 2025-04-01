# Node Flow Editor

A web-based node editor for creating AI workflows. Built with vanilla JavaScript, HTMX, and Hyperscript for a lightweight and performant experience.

## Features

- 🎯 Intuitive node-based workflow editor
- 🔍 Smooth zoom and pan functionality
- 📱 Responsive design with Tailwind CSS
- 🎨 Dark theme optimized for long coding sessions
- 🧩 Modular component architecture
- 🔌 Easy-to-extend node system

## Project Structure
```
project-root/
├── index.html              # Main application entry point
├── assets/
│   └── css/
│       └── custom.css      # Custom styling overrides
├── src/
│   ├── js/
│   │   ├── utils.js       # Utility functions
│   │   └── zoom.js        # Zoom and pan functionality
│   └── components/
│       └── nodes/
│           └── input.html  # Node component templates
├── lib/
│   ├── hyperscript.js     # Hyperscript for interactivity
│   └── htmx.js           # HTMX for dynamic content
└── README.md
```

## Controls

### Navigation
- **Pan**: Click and drag on empty space
- **Zoom**: Mouse wheel or use zoom controls
- **Reset View**: Click the reset button in bottom-left corner

### Interface
- **Sidebar**: Toggle with button in top-left
- **Add Node**: Plus button in top-left toolbar
- **Add Note**: Note button in bottom-left toolbar
- **View Code**: Code button in bottom-right
- **Chat**: Message button in bottom-right

## Technologies Used

- **HTMX**: For dynamic HTML updates
- **Hyperscript**: For interactive behaviors
- **Tailwind CSS**: For styling
- **Custom Events**: For component communication
- **SVG**: For node connections and graphics

## Development

1. Clone the repository
2. Open `index.html` in your browser
3. No build step required - edit files directly

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

MIT License - Feel free to use this project for personal or commercial purposes.
