const connection = require('../database/connection');

module.exports = {
    async index(request, response) {
        const users = await connection('users').select('*');
        return response.json(users);
    },

    async create(request, response) {
        const user = request.body
        try {
            await connection('users').insert(user);
        } catch (err) {
            console.log("User creation failed: " + err);
        }
        return response.json({ notification: "Usuario criado!" });
    }
}