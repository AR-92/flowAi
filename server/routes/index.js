const staticController = require('../controllers/staticController');
const iconController = require('../controllers/iconController');
const sidebarController = require('../controllers/sidebarController');
const { errorHandler } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

class Router {
    async handleRequest(req, res, path) {
        try {
            // Get request body for POST requests
            let body = '';
            if (req.method === 'POST') {
                body = await new Promise((resolve, reject) => {
                    let data = '';
                    req.on('data', chunk => data += chunk);
                    req.on('end', () => resolve(data));
                    req.on('error', reject);
                });
            }

            // API endpoints
            if (path === '/api/icons') {
                return await iconController.getIcons(req, res);
            } else if (path === '/api/save-sidebar' && req.method === 'POST') {
                return await sidebarController.saveSidebar(req, res, body);
            }

            // Static file serving
            const sanitizedPath = this.sanitizePath(path);
            await staticController.serveFile(req, res, sanitizedPath);
        } catch (error) {
            errorHandler(error, req, res);
        }
    }

    sanitizePath(path) {
        return path.replace(/\.\./g, '').replace(/\/+/g, '/');
    }
}

module.exports = new Router();
