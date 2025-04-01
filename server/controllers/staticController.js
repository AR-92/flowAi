const { readFile } = require('fs').promises;
const { join, extname } = require('path');
const config = require('../config');
const logger = require('../utils/logger');

class StaticController {
    async serveFile(req, res, filepath) {
        try {
            let fullPath;
            if (filepath === '/') {
                fullPath = join(__dirname, '../../index.html');
            } else {
                fullPath = join(__dirname, '../..', filepath);
            }

            const content = await readFile(fullPath);
            const ext = extname(fullPath);
            
            const headers = {
                'Content-Type': config.static.mimeTypes[ext] || 'application/octet-stream',
                ...config.static.headers
            };

            res.writeHead(200, headers);
            res.end(content);

            logger.debug(`Served: ${filepath}`);
        } catch (error) {
            if (error.code === 'ENOENT') {
                throw new Error('NOT_FOUND');
            }
            throw error;
        }
    }
}

module.exports = new StaticController();
