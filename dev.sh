#!/bin/bash

# Kill any existing server process on port 3000 (only if it exists)
pid=$(sudo lsof -t -i:3000)
if [[ -n "$pid" ]]; then
  sudo kill -9 "$pid"
fi



# Start the Node-Server
node server &
# Start the standalone TailwindCSS CLI
tailwindcss -i ./assets/css/input.css -o ./assets/css/flowAi.css --watch

# instructions on how to use the script
# chmod +x dev.sh this command will make the script executable and allow it to be run directly
# then just run ./dev.sh to start the server and watch the CSS files
