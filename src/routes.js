const express = require('express');
const routes = express.Router();
const UserController = require('./controllers/UserController');
const SessionController = require('./controllers/SessionController');
const { celebrate, Segments, Joi } = require('celebrate');

//Users
routes.get('/users', UserController.index);
routes.post('/user', celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().min(6).required(),
      type: Joi.string().valid("admin", "retailer", "wholesaler").required(),
      cpf: Joi.string().required(),
      birthdate: Joi.string().optional(),
      zipcode: Joi.string().optional(),
      phonenumber: Joi.string().optional(),
      state: Joi.string().optional(),
      city: Joi.string().optional(),
      neighborhood: Joi.string().optional(),
      street: Joi.string().optional(),
      number: Joi.string().optional(),
      complement: Joi.string().optional(),
      })
  }), UserController.create);

  //Session

  routes.post('/login', celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().min(6).required(),
   })
  }), SessionController.signin);

  
module.exports = routes;