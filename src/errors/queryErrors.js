exports.QueryError = class QueryError extends Error {
    constructor(
        message,
        collection,
        originalError = ''
    ) {
        super(message);
        this.message = message;
        this.collection = collection;
        this.originalError = originalError;
        this.errorType = "QueryError";
    }

    toString() {
        return `${this.errorType}: while performing a query to ${this.collection} collection`;
    }
}

exports.ResourceError = class ResourceError extends QueryError {
    constructor(message, resource, collection, originalError = '') {
        super(message, collection, originalError);
        this.resource = resource;
        this.errorType = 'ResourceError';
    }

    toString() {
        return `${this.errorType}: ${this.resource} doesnt exists at ${this.collection}`;
    }
};