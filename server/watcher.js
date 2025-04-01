const { spawn } = require('child_process');
const { watch } = require('fs');
const { join } = require('path');
const { readdirSync } = require('fs');
const logger = require('./utils/logger');

class ServerWatcher {
    constructor() {
        this.serverProcess = null;
        this.isRestarting = false;
        this.watchers = new Set();
    }

    watchDirectory(dir) {
        try {
            // Read all files and directories in the current directory
            const entries = readdirSync(dir, { withFileTypes: true });
            
            // Watch the current directory
            const watcher = watch(dir, (eventType, filename) => {
                if (filename && !filename.startsWith('.') && !filename.includes('node_modules')) {
                    logger.info(`File changed: ${join(dir, filename)}`);
                    this.restartServer();
                }
            });
            
            this.watchers.add(watcher);

            // Recursively watch all subdirectories
            for (const entry of entries) {
                if (entry.isDirectory() && 
                    entry.name !== 'node_modules' && 
                    !entry.name.startsWith('.')) {
                    this.watchDirectory(join(dir, entry.name));
                }
            }
        } catch (error) {
            logger.error('Watch error:', error);
        }
    }

    watchServer() {
        // Watch the server directory
        const serverDir = join(__dirname);
        this.watchDirectory(serverDir);

        // Start server initially
        this.startServer();

        // Handle process termination
        process.on('SIGINT', () => {
            this.cleanup();
            process.exit();
        });
    }

    cleanup() {
        this.stopServer();
        // Close all watchers
        for (const watcher of this.watchers) {
            watcher.close();
        }
        this.watchers.clear();
    }

    startServer() {
        logger.info('Starting server...');
        
        // Spawn a new Node.js process running the server
        this.serverProcess = spawn('node', ['index.js'], {
            cwd: __dirname,
            stdio: 'inherit'
        });

        this.serverProcess.on('error', (error) => {
            logger.error('Failed to start server:', error);
        });

        this.serverProcess.on('exit', (code, signal) => {
            if (!this.isRestarting) {
                logger.info(`Server process exited with code ${code}`);
            }
        });
    }

    stopServer() {
        if (this.serverProcess) {
            logger.info('Stopping server...');
            this.serverProcess.kill();
            this.serverProcess = null;
        }
    }

    restartServer() {
        if (this.isRestarting) return;
        
        this.isRestarting = true;
        logger.info('Restarting server...');
        
        this.stopServer();
        
        // Small delay to ensure clean shutdown
        setTimeout(() => {
            this.startServer();
            this.isRestarting = false;
        }, 1000);
    }
}

// Start the watcher if this file is run directly
if (require.main === module) {
    const watcher = new ServerWatcher();
    watcher.watchServer();
}

module.exports = ServerWatcher;