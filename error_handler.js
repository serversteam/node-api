const util = require('util');

class ErrorHandler {
    static handle(res) {
        return (e) => {
            console.log(e);
            if (typeof e.json === 'function') {
                res.status(e.status_code).json(e.json());
            } else {
                const parsed = ErrorHandler.messageParser(e.message);
                res.status(parsed.status_code).json(parsed);
            }
        }
    }

    static messageParser(message) {
        const messagePatterns = [
            
        ];
        let response = {status_code: 400, message: message};

        for (const p of messagePatterns) {
            const match = message.match(new RegExp(p.pattern, 'i'));

            if (match) {
                if (typeof p.callback === 'function') {
                    response = {status_code: p.code || response.status_code, message: p.callback(match)};
                } else {
                    response = {status_code: p.code || response.status_code, message: util.format(p.message, match[1] ? match[1].trim() : '')};
                }

                break;
            }
        }

        return response;
    }
};

module.exports = ErrorHandler;
