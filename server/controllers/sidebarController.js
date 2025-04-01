const { writeFile } = require('fs').promises;
const { join } = require('path');
const logger = require('../utils/logger');

class SidebarController {
    async saveSidebar(req, res, content) {
        try {
            const sidebarPath = join(__dirname, '../../src/components/sideBar/sideBar.html');
            
            // Save new content
            await writeFile(sidebarPath, content, 'utf8');
            
            logger.info('Sidebar saved successfully');
            
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        } catch (error) {
            logger.error('Error saving sidebar:', error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Failed to save sidebar');
        }
    }
}

module.exports = new SidebarController();
