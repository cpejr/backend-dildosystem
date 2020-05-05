const connection = require('../database/connection');

module.exports = {
    async index(request, response){
        const users = await connection('users').select('*');
        return response.json(users);
    },

    async create(request, response){
        const {name, email, firebase} = request.body; 
        await connection('users').insert({name, email, firebase});
        return response.json({notification: "Usuario criado!"});
    }
}