const express = require('express');
const routes = express.Router();
const connection = require('./database/connection');

routes.get('/', (request, response)=>{
    return response.json({resposta: "Conectou na rota.get('/')"});
})

module.exports = routes;