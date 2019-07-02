class ValidationError extends Error {
    constructor(code, message, errors = null) {
        super(message);
        this.status_code = code;
        this.errors = errors;
    }

    json() {
        return { status_code: this.status_code, message: this.message, errors: this.errors };
    }
}

class Validator {
    static validate(inputs, data, return_promise=false) {
        const errors = {};

        for (const input in inputs) {
            for (const validator of inputs[input]) {
                let err = null;

                if(typeof validator === 'function') {
                    err = validator(input, data[input]);
                } else {
                    err = Validator[validator](input, data[input]);
                }

                if (err) {
                    if (typeof errors[input] !== 'object' || errors[input].constructor !== Array) {
                        errors[input] = [];
                    }

                    errors[input].push(err);
                }
            }
        }

        if(return_promise === true) {
            return Validator.returnPromise(errors);
        }

        return Object.keys(errors).length > 0 ? errors : null;
    }

    static returnPromise(errors) {
        return new Promise((resolve, reject) => {
            if(Object.keys(errors).length > 0) {
                reject(new ValidationError(422, 'Input validation error', errors));
            }

            resolve();
        });
    }

    static required(field, value) {
        const message = `${field} field is required!`;

        if (typeof value === 'string') {
            value = value.trim();
        }

        return value ? (value.length === 0 ? message : false) : message;
    }

    static boolean(field, value) {
        if(typeof value !== 'boolean') {
            return `${field} value should be a boolean`;
        }
        
        return false;
    }

    static string(field, value) {
        if(typeof value !== 'string') {
            return `${field} value should be a valid string`;
        }
        
        return false;
    }

    static email(field, value) {
        if (!/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(value)) {
            return `${field} is not a valid email address!`;
        }

        return false;
    }

    static username(field, value) {
        if (!/^[a-zA-Z]+[a-zA-Z0-9\._-]+$/.test(value)) {
            return `${field} is not valid!`;
        }

        return false;
    }
    
    static array(field, value) {
        if(value && value.constructor !== Array) {
            return `${field} should be an array!`;
        }

        return false;
    }

    static dictionary(field, value) {
        if(value && value.constructor !== Object) {
            return `${field} should be a valid dictionary!`;
        }

        return false;
    }

    static array_does_not_include_empty(field, value) {
        for(const item of value) {
            if(item === "" || item === null || (typeof item === 'string' && item.trim() === '')) {
                return `${field} array should not contain any empty value!`;
            }
        }

        return false;
    }
}

module.exports = Validator;
