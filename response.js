class Response {
    static success(res, message, options = {}) {
        return Response.construct_response(res, 200, message, options);
    }

    static error_bad_request(res, message = 'Bad request', options = {}) {
        return Response.construct_response(res, 400, message, options);
    }

    static error_not_authorized(res, message = 'Not authorized', options = {}) {
        return Response.construct_response(res, 401, message, options)
    }

    static error_forbidden(res, message = 'You don\'t have enough permissions to access this', options = {}) {
        return Response.construct_response(res, 403, message, options)
    }

    static error_not_found(res, message = 'The resource you are looking for is not found', options = {}) {
        return Response.construct_response(res, 404, message, options)
    }

    static error_method_not_allowed(res, message = 'Method not allowed for this resource', options = {}) {
        return Response.construct_response(res, 405, message, options)
    }

    static error_not_acceptable(res, message = 'Headers are not valid', options = {}) {
        return Response.construct_response(res, 406, message, options)
    }

    static error_request_timeout(res, message = 'Request timeout', options = {}) {
        return Response.construct_response(res, 408, message, options)
    }

    static error_conflict(res, message = 'Conflict', options = {}) {
        return Response.construct_response(res, 409, message, options)
    }

    static error_gone(res, message = 'Resource is not available', options = {}) {
        return Response.construct_response(res, 410, message, options)
    }

    static error_unprocessable_entity(res, message = 'Input validation failed, please provide correct values', options = {}) {
        return Response.construct_response(res, 422, message, options)
    }

    static error_too_many_requests(res, message = 'Too many requests', options = {}) {
        return Response.construct_response(res, 429, message, options)
    }

    static error_invalid_token(res, message = 'Invalid Token', options = {}) {
        return Response.construct_response(res, 498, message, options)
    }

    static error_token_required(res, message = 'Token is required to make this call', options = {}) {
        return Response.construct_response(res, 499, message, options)
    }

    static error_internal_server_error(res, message = 'Internal server error', options = {}) {
        return Response.construct_response(res, 500, message, options)
    }

    static error_not_implemented(res, message = 'Not implemented', options = {}) {
        return Response.construct_response(res, 501, message, options)
    }

    static error_bad_gateway(res, message = 'Bad gateway', options = {}) {
        return Response.construct_response(res, 502, message, options)
    }

    static error_service_unavailable(res, message = 'Service unavailable', options = {}) {
        return Response.construct_response(res, 503, message, options)
    }

    static error_gateway_timeout(res, message = 'Gateway timeout', options = {}) {
        return Response.construct_response(res, 504, message, options)
    }

    static construct_response(res, code, message, options = {}) {
        const response = { status_code: code, message: message };

        if (options['data']) {
            response[options['data_key'] ? options['data_key'] : 'data'] = options['data'];
        }

        return res.status(response.status_code).json(response);
    }
}

class CustomError extends Error {
    constructor(code, message, errors = null) {
        super(message);
        this.status_code = code;
        this.errors = errors;
    }

    json() {
        const response = { status_code: this.status_code, message: this.message };
        if (this.errors) {
            response['errors'] = this.errors;
        }
        return response;
    }

    static fromError(e) {
        return CustomError(e.code || 500, e.message || e);
    }
}

module.exports = {
    Response,
    CustomError
};
