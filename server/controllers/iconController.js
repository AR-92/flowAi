const { readdir, readFile } = require('fs').promises;
const { join } = require('path');

class IconController {
    async getIcons(req, res) {
        try {
            const iconsPath = join(__dirname, '../../assets/icons');
            const files = await readdir(iconsPath);
            
            const icons = await Promise.all(
                files
                    .filter(file => file.endsWith('.svg'))
                    .map(async file => {
                        const content = await readFile(join(iconsPath, file), 'utf8');
                        return {
                            name: file.replace('.svg', ''),
                            svg: content
                        };
                    })
            );

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(icons));
        } catch (error) {
            console.error('Error reading icons:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to fetch icons' }));
        }
    }
}

module.exports = new IconController();