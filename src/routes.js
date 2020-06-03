const express = require('express');
const routes = express.Router();
const UserController = require('./controllers/UserController');
const CategoryController = require('./controllers/CategoryController');
const ProductController = require('./controllers/ProductController');
const SessionController = require('./controllers/SessionController');
const DriveController = require('./controllers/DriveController');
const SubproductController = require('./controllers/SubproductController');
const OrderController = require('./controllers/OrderController');
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
    client_price: Joi.number().min(0).required(),
    client_sale_price: Joi.number().min(0).optional(),
    wholesaler_price: Joi.number().min(0).required(),
    wholesaler_sale_price: Joi.number().min(0).optional(),
    on_sale_client: Joi.boolean().optional(),
    on_sale_wholesaler: Joi.boolean().optional(),
    featured: Joi.boolean().optional(),
    description: Joi.string().required(),
    visible: Joi.boolean().optional(),
    stock_quantity: Joi.number().required(),
    subcategory_id: Joi.number().integer().min(0).required(),
  })
}), ProductController.create);

routes.put('/updateProduct/:id', authenticateToken, isAdmin, imageUpload('imageFile'), celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.number().required(),
  }),
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().optional(),
    client_price: Joi.number().min(0).optional(),
    client_sale_price: Joi.number().min(0).optional(),
    wholesaler_price: Joi.number().min(0).optional(),
    wholesaler_sale_price: Joi.number().min(0).optional(),
    on_sale_client: Joi.boolean().optional(),
    on_sale_wholesaler: Joi.boolean().optional(),
    featured: Joi.boolean().optional(),
    description: Joi.string().optional(),
    visible: Joi.boolean().optional(),
    stock_quantity: Joi.number().optional(),
    subcategory_id: Joi.number().integer().min(0).optional(),
  })
}), ProductController.update);

routes.get('/products', authenticateOptionalToken, celebrate({
  [Segments.QUERY]: Joi.object().keys({
    name: Joi.string().optional(),
    client_price: Joi.number().min(0).optional(),
    client_sale_price: Joi.number().min(0).optional(),
    wholesaler_price: Joi.number().min(0).optional(),
    wholesaler_sale_price: Joi.number().min(0).optional(),
    on_sale_client: Joi.boolean().optional(),
    on_sale_wholesaler: Joi.boolean().optional(),
    featured: Joi.boolean().optional(),
    description: Joi.string().optional(),
    visible: Joi.boolean().optional(),
    stock_quantity: Joi.number().optional(),
    subcategory_id: Joi.number().integer().min(0).optional(),
    max_price: Joi.number().min(0).optional(),
    min_price: Joi.number().min(0).optional(),
    order_by: Joi.string().valid('price'),
    order_ascending: Joi.boolean().optional(),
    page: Joi.number().integer().min(1).optional(),
  })
}), ProductController.index);

routes.get('/product/:product_id', authenticateOptionalToken, celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    product_id: Joi.number().required(),
  })
}), ProductController.getProduct);

routes.delete('/product/:product_id', authenticateToken, isAdmin, celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    product_id: Joi.number().integer().min(0).required(),
  })
}), ProductController.delete);

//Subproducts
routes.post('/newSubproduct', authenticateToken, isAdmin, imageUpload('imageFile'), celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    visible: Joi.boolean().optional(),
    stock_quantity: Joi.number().required(),
    product_id: Joi.number().required(),
  })
}), SubproductController.create);

routes.get('/subproducts/:product_id', authenticateOptionalToken, celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    product_id: Joi.number().required(),
  })
}), SubproductController.getSubproducts);


//Orders
routes.post('/newOrder', authenticateToken, celebrate({
  [Segments.BODY]: Joi.object().keys({
    products: Joi.array().items(Joi.object().keys({
      product_id: Joi.number().integer().min(0).required(),
      product_quantity: Joi.number().integer().min(1).required(),
      subproduct_id: Joi.number().integer().min(0).optional(),
    }))
      .min(1)
      .unique((a, b) => a.product_id === b.product_id && a.subproduct_id === b.subproduct_id)
      .required(),
    paymentType: Joi.string().required(),
  })
}), OrderController.create);

routes.get('/orders', authenticateToken, isAdmin,
  OrderController.index);

routes.delete('/order/:order_id', authenticateToken, isAdmin, celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    order_id: Joi.number().integer().min(0).required(),
  })
}), OrderController.delete);

//GoogleDrive
routes.get('/validateCredentials', DriveController.validateCredentials)


//Categories
routes.post('/newCategory', authenticateToken, isAdmin, celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
  })
}), CategoryController.createCategory);

routes.post('/newSubcategory', authenticateToken, isAdmin, celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    category_id: Joi.number().integer().min(0).required(),
  })
}), CategoryController.createSubcategory);

routes.put('/category/:id', authenticateToken, isAdmin, celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.number().integer().min(0).required(),
  }),
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().optional(),
  })
}), CategoryController.updateCategory);

routes.put('/subcategory/:id', authenticateToken, isAdmin, celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.number().integer().min(0).required(),
  }),
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().optional(),
    category_id: Joi.number().integer().min(0).optional(),
  })
}), CategoryController.updateSubcategory);

routes.delete('/category/:id', authenticateToken, isAdmin, celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.number().integer().min(0).required(),
  }),
}), CategoryController.deleteCategory);

routes.delete('/subcategory/:id', authenticateToken, isAdmin, celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.number().integer().min(0).required(),
  }),
}), CategoryController.deleteSubcategory);




module.exports = routes;
