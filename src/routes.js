const express = require('express');
const routes = express.Router();

routes.get('/', (request, response)=>{
    console.log("Rota padrao faz nada");
    return response.json({resposta: "AAAAAA"});
})

module.exports = routes;