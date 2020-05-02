const connection = require('../database/connection');

module.exports = {
    async index(request, response){
        const users = await connection('users').select('*');
        return response.json(users);
    }
}