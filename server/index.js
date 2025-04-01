const { createServer } = require('http');
const router = require('./routes');
const config = require('./config');
const logger = require('./utils/logger');

class Server {
    constructor() {
        this.server = null;
    }

    async start() {
        this.server = createServer(async (req, res) => {
            const startTime = Date.now();
            
            try {
                const url = new URL(req.url, `http://${req.headers.host}`);
                await router.handleRequest(req, res, url.pathname);
            } catch (error) {
                logger.error('Unhandled server error:', error);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 Internal Server Error');
            } finally {
                const duration = Date.now() - startTime;
                logger.debug(`${req.method} ${req.url} - ${duration}ms`);
            }
        });

        // Handle server-specific errors
        this.server.on('error', (error) => {
            logger.error('Server error:', error);
            this.shutdown();
        });

        // Start listening
        this.server.listen(config.server.port, config.server.host, () => {
            logger.info(`Server running at http://${config.server.host}:${config.server.port}`);
        });

        // Handle process signals
        process.on('SIGTERM', () => this.shutdown());
        process.on('SIGINT', () => this.shutdown());
        process.on('uncaughtException', (error) => {
            logger.error('Uncaught Exception:', error);
            this.shutdown();
        });
        process.on('unhandledRejection', (reason, promise) => {
            logger.error('Unhandled Rejection:', reason);
            this.shutdown();
        });
    }

    async shutdown() {
        if (this.server) {
            logger.info('Shutting down server...');
            
            // Close the server
            await new Promise((resolve) => {
                this.server.close(() => {
                    logger.info('Server closed');
                    resolve();
                });
            });

            // Exit process
            process.exit(0);
        }
    }
}

// Start the server if this file is run directly
if (require.main === module) {
    const server = new Server();
    server.start();
}

module.exports = Server;
