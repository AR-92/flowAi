const { readdir, stat } = require('fs').promises;
const { join } = require('path');

async function getDirectoryStructure(path) {
    const items = await readdir(path);
    const structure = [];

    for (const item of items) {
        const fullPath = join(path, item);
        const stats = await stat(fullPath);
        
        if (stats.isDirectory()) {
            const children = await getDirectoryStructure(fullPath);
            structure.push({
                name: item,
                path: fullPath,
                isDirectory: true,
                children
            });
        } else {
            structure.push({
                name: item.replace('.html', ''),
                path: item,
                isDirectory: false
            });
        }
    }

    return structure;
}

module.exports = {
    getDirectoryStructure
};