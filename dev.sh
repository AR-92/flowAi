#!/bin/bash
# Start the Node-Server
node server &

# Start the standalone CLI (make sure it's available in your PATH)
tailwindcss -i ./assets/css/input.css -o ./assets/css/output.css --watch &

# Wait for both background processes to finish (this will keep the script running)
wait

# instructions on how to use the script
# chmod +x dev.sh this command will make the script executable and allow it to be run directly
# then just run ./dev.sh to start the server and watch the CSS files
