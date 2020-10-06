const express = require('express');
const routes = express.Router();

const UserController = require('./controllers/UserController');
const userValidate = require('./validators/UserValidator');

const CategoryController = require('./controllers/CategoryController');
const categoryValidate = require('./validators/CategoryValidator')

const ProductController = require('./controllers/ProductController');
const productValidate = require('./validators/ProductValidator');

const SessionController = require('./controllers/SessionController');
const loginValidate = require('./validators/LoginValidator');

const DriveController = require('./controllers/DriveController');

const SubproductController = require('./controllers/SubproductController');
const subProductValidate = require('./validators/SubProductValidator');

const OrderController = require('./controllers/OrderController');
const orderValidate = require('./validators/OrderValidator');

const CarouselController = require('./controllers/CarouselController');
const CarouselValidate = require('./validators/CarouselValidator');

const { authenticateToken, isAdmin, authenticateOptionalToken, isAdminOrSelf } = require('./middlewares/authentication');
const { celebrate, Segments, Joi } = require('celebrate');
const imageUpload = require('./middlewares/imageUpload');
const imageMultUpload = require('./middlewares/imageMultUpload');
const { generateId } = require('./middlewares/idGenerator');

//Users
routes.post('/user', celebrate(userValidate.create), generateId, UserController.create);
routes.get('/users', authenticateToken, isAdmin, celebrate(userValidate.index), UserController.index);
routes.get('/user/:id', authenticateToken, isAdmin, celebrate(userValidate.getOne), UserController.getOne);
routes.delete('/user/:id', authenticateToken, isAdminOrSelf, celebrate(userValidate.delete), UserController.delete);
routes.put('/user/:id', authenticateOptionalToken, isAdminOrSelf, celebrate(userValidate.update), UserController.update);
routes.post('/forgottenPassword', celebrate(userValidate.forgottenPassword), UserController.forgottenPassword);
routes.get('/userwishlist/:id', authenticateToken, celebrate(userValidate.wishList), UserController.getWishList)
routes.post('/userwishlist/:id', authenticateToken, celebrate(userValidate.wishList), generateId, UserController.createWish)
routes.delete('/userwishlist', authenticateToken, celebrate(userValidate.wishListDelete), UserController.deleteAWish );

//Session
routes.post('/login', celebrate(loginValidate.signin), SessionController.signin);
routes.get('/verify', celebrate(loginValidate.verifyToken), SessionController.verifyToken);

//Product
routes.post('/newProduct', authenticateToken, isAdmin, imageMultUpload('imageFile','imageFiles'), celebrate(productValidate.create), generateId, ProductController.create);
routes.get('/products', authenticateOptionalToken, celebrate(productValidate.index), ProductController.index);
routes.get('/product/:product_id', authenticateOptionalToken, celebrate(productValidate.getProduct), ProductController.getProduct);
routes.put('/updateProduct/:id', authenticateToken, isAdmin, imageUpload('imageFile', 'update'), celebrate(productValidate.update), ProductController.update);
routes.delete('/product/:product_id', authenticateToken, isAdmin, celebrate(productValidate.delete), ProductController.delete);
routes.get('/lowStock', authenticateToken, isAdmin, ProductController.getlowStock);

//Subproducts
routes.post('/newSubproduct', authenticateToken, isAdmin, imageUpload('imageFile'), celebrate(subProductValidate.create), generateId, SubproductController.create);
routes.get('/subproducts/:product_id', authenticateOptionalToken, celebrate(subProductValidate.getSubproducts), SubproductController.getSubproducts);
routes.delete('/subproducts/:product_id', authenticateToken, isAdmin, celebrate(subProductValidate.delete), SubproductController.delete);
routes.put('/updateSubproduct/:id', authenticateToken, isAdmin, imageUpload('imageFile', 'update'), celebrate(subProductValidate.update), SubproductController.update);

//Orders
routes.post('/newOrder', authenticateToken, celebrate(orderValidate.create), generateId, OrderController.create);
routes.get('/orders', authenticateToken, isAdmin,celebrate(orderValidate.index), OrderController.index);
routes.get('/orders/:id', authenticateToken, isAdminOrSelf,celebrate(orderValidate.index), OrderController.index);
routes.put('/order/:id', authenticateToken, isAdmin, celebrate(orderValidate.update), OrderController.update);
routes.delete('/order/:order_id', authenticateToken, isAdmin, celebrate(orderValidate.delete), OrderController.delete);

//GoogleDrive
routes.get('/validateCredentials', DriveController.validateCredentials)

//Categories
routes.post('/newCategory', authenticateToken, isAdmin, celebrate(categoryValidate.createCategory), generateId, CategoryController.createCategory);
routes.post('/newSubcategory', authenticateToken, isAdmin, celebrate(categoryValidate.createSubcategory), generateId, CategoryController.createSubcategory);
routes.put('/category/:id', authenticateToken, isAdmin, celebrate(categoryValidate.updateCategory), CategoryController.updateCategory);
routes.put('/subcategory/:id', authenticateToken, isAdmin, celebrate(categoryValidate.updateSubcategory), CategoryController.updateSubcategory);
routes.delete('/category/:id', authenticateToken, isAdmin, celebrate(categoryValidate.deleteCategory), CategoryController.deleteCategory);
routes.delete('/subcategory/:id', authenticateToken, isAdmin, celebrate(categoryValidate.deleteSubcategory), CategoryController.deleteSubcategory);
routes.get('/categories', CategoryController.getCategories)

//Carousel
routes.get('/carousel', CarouselController.index);
routes.post('/newCarousel', authenticateToken, isAdmin, imageUpload('imageFile'), generateId, CarouselController.create);
routes.put('/carousel/:id', authenticateToken, isAdmin, celebrate(CarouselValidate.updateCarousel), CarouselController.update);
routes.delete('/carousel/:id', authenticateToken, isAdmin, celebrate(CarouselValidate.deleteCarousel), CarouselController.delete);

//Images
routes.post('/images', authenticateToken, isAdmin, celebrate(productValidate.uploadFiles), imageMultUpload(undefined,'imageFiles'), ProductController.uploadFiles);
routes.delete('/image/:id', authenticateToken, isAdmin, celebrate(productValidate.deleteFile), ProductController.deleteFile)
routes.get('/image/:ids', celebrate(productValidate.getImages), ProductController.getImages)

module.exports = routes;
