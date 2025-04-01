const logger = require('../utils/logger');

class HttpError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

const errorHandler = (error, req, res) => {
    if (error.message === 'NOT_FOUND') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
    }

    logger.error('Server error:', error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('500 Internal Server Error');
};

module.exports = {
    errorHandler,
    HttpError
};