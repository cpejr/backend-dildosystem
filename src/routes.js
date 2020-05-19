const express = require('express');
const routes = express.Router();
const UserController = require('./controllers/UserController');
const ProductController = require('./controllers/ProductController');
const SessionController = require('./controllers/SessionController');
const DriveController = require('./controllers/DriveController');
const { authenticateToken, isAdmin, authenticateOptionalToken } = require('./middlewares/authentication');
const { celebrate, Segments, Joi } = require('celebrate');
const imageUpload = require('./middlewares/imageUpload');

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

//Product
routes.post('/newProduct', authenticateToken, isAdmin, imageUpload('imageFile'), celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    client_price: Joi.number().required(),
    client_sale_price: Joi.number().optional(),
    wholesaler_price: Joi.number().required(),
    wholesaler_sale_price: Joi.number().optional(),
    on_sale_client: Joi.boolean().optional(),
    on_sale_wholesaler: Joi.boolean().optional(),
    featured: Joi.boolean().optional(),
    description: Joi.string().required(),
    visible: Joi.boolean().optional(),
    stock_quantity: Joi.number().required(),
  })
}), ProductController.create);

routes.put('/updateProduct/:id', authenticateToken, isAdmin, imageUpload('imageFile'), celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.number().required(),
  }),
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().optional(),
    client_price: Joi.number().optional(),
    client_sale_price: Joi.number().optional(),
    wholesaler_price: Joi.number().optional(),
    wholesaler_sale_price: Joi.number().optional(),
    on_sale_client: Joi.boolean().optional(),
    on_sale_wholesaler: Joi.boolean().optional(),
    featured: Joi.boolean().optional(),
    description: Joi.string().optional(),
    visible: Joi.boolean().optional(),
    stock_quantity: Joi.number().optional(),
  })
}), ProductController.update);

routes.get('/products', authenticateOptionalToken, celebrate({
  [Segments.QUERY]: Joi.object().keys({
    name: Joi.string().optional(),
    client_price: Joi.number().optional(),
    client_sale_price: Joi.number().optional(),
    wholesaler_price: Joi.number().optional(),
    wholesaler_sale_price: Joi.number().optional(),
    on_sale_client: Joi.boolean().optional(),
    on_sale_wholesaler: Joi.boolean().optional(),
    featured: Joi.boolean().optional(),
    description: Joi.string().optional(),
    visible: Joi.boolean().optional(),
    stock_quantity: Joi.number().optional(),
    image_id: Joi.string().optional(),
  })
}), ProductController.index);


//GoogleDrive
routes.get('/validateCredentials', DriveController.validateCredentials)

module.exports = routes;