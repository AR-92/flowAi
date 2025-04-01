const config = {
    server: {
        port: process.env.PORT || 3000,
        host: process.env.HOST || 'localhost'
    },
    static: {
        mimeTypes: {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'text/javascript',
            '.json': 'application/json',
            '.svg': 'image/svg+xml',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.ico': 'image/x-icon'
        },
        headers: {
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'SAMEORIGIN',
            'X-XSS-Protection': '1; mode=block'
        }
    }
};

module.exports = config;