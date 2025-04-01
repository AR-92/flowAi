const logger = {
    info: (message, ...args) => {
        console.log(`[INFO] ${message}`, ...args);
    },
    error: (message, error) => {
        console.error(`[ERROR] ${message}`, error);
    },
    debug: (message, ...args) => {
        if (process.env.DEBUG) {
            console.debug(`[DEBUG] ${message}`, ...args);
        }
    }
};

module.exports = logger;