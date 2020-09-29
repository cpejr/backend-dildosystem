const { v1: uuidv1 } = require('uuid');

module.exports = {
    async generateId (request, response, next) {
        request.body.id = uuidv1();
        next();
    }
}