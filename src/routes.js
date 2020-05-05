const express = require('express');
const routes = express.Router();
const UserController = require('./controllers/UserController');

//Users
routes.get('/users', UserController.index);
routes.get('/', (request, response) =>{ return response.json({resposta: "Banana", feijao: "cozido"})});

module.exports = routes;