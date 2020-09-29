exports.DuplicatedResource = class DuplicatedResource {
    constructor(resourceName, message) {
        this.resourceName = resourceName;
        this.message = message;
        this.errorType = 'DuplicatedResource';
    }

    toString() {
        return `${this.errorType}: trying to create an existing resource (${this.resourceName}) that should be unique. ${this.message}`;
    }
}

exports.ResourceNotExists = class ResourceNotExists {
    constructor(resourceName, resourceID) {
        this.resourceName = resourceName;
        this.resourceID = resourceID;
        this.errorType = 'ResourceNotExists';
    }

    toString() {
        return `${this.errorType}: the ${this.resourceName} with ID ${this.resourceID} doesnt exists`;
    }
}