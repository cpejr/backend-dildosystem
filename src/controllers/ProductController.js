const ProductModel = require('../models/ProductModel');
const SubproductModel = require('../models/SubproductModel');
const CategoryModel = require('../models/CategoryModel');
const ImageModel = require("../models/ImageModel");
const { uploadFile, deleteFile } = require('../models/GoogleDriveModel');
const { getImages } = require('../validators/ProductValidator');
const { isAdmin } = require('../middlewares/authentication');

module.exports = {

  async create(request, response) {
    try {
      const newProduct = request.body;
      const { originalname, buffer, mimetype } = request.files.imageFile[0];
      const images = request.files.imageFiles;

      //console.log(request.files)

      const image_id = await uploadFile(buffer, originalname, mimetype);

      newProduct.image_id = image_id;

      await ProductModel.createNewProduct(newProduct);

      if(images){
        await ImageModel.createImages(images, newProduct.id);
      }

      return response.status(200).json({ id: newProduct.id });
    } catch (err) {
      console.error(err);
      return response.status(500).json({ notification: "Internal server error while trying to register the new product" });
    }
  },

  async index(request, response) {
    try {
      const filter = request.query;
      const { max_price, min_price, order_by, order_ascending, page, search, category_id } = filter;
      delete filter.max_price;
      delete filter.min_price;
      delete filter.order_by;
      delete filter.order_ascending;
      delete filter.page;
      delete filter.search;
      delete filter.category_id;

      let type = "retailer";
      if (request.session)
        type = request.session.user.type;

      let query = { visible: true, ...filter };
      if (type === 'admin')
        query = { ...filter };

      const categories = await CategoryModel.getCategories();

      let subcategories = [];

      categories.forEach((cat) => {
        if (cat.id === category_id) {
          subcategories = cat.subcategories.map(subcat => subcat.id);
        }
      });

      const result = await ProductModel.getProducts(type, query, max_price, min_price, order_by, order_ascending, search, subcategories, page);
      //console.log("teste: ", result);
      response.setHeader('X-Total-Count', result.totalCount);
      return response.status(200).json(result.data);


    } catch (err) {
      console.error(err);
      return response.status(500).json({ notification: "Internal server error while trying to get products" });
    }
  },

  async getlowStock(request, response) {
    try {
      const lowProducts = await ProductModel.getlowStock();
      const result = {
        products: lowProducts,
        number: lowProducts ? lowProducts.length : 0
      }
      return response.status(200).json(result);
    }
    catch (err) {
      console.error(err);
      return response.status(500).json({ notification: "Internal server error while trying to get low stock products" });
    }
  },

  async getProduct(request, response) {
    try {
      const { product_id } = request.params;

      let showWholesaler = false;
      if (request.session) {
        const type = request.session.user.type;
        showWholesaler = type === "admin" || type === "wholesaler";
      }

      const promises = [];

      promises.push(ProductModel.getProductbyId(product_id, showWholesaler));
      promises.push(SubproductModel.getSubproductsbyProductId(product_id));

      const result = await Promise.all(promises);
      let data = result[0];
      if (data)
        data.subproducts = result[1];

      return response.status(200).json(data);

    } catch (err) {
      console.error(err);
      return response.status(500).json({ notification: "Internal server error while trying to get products" });
    }
  },

  async getImages(request, response) {
    try {
      let { ids } = request.params; //Coloque ids de produtos e subprodutos no params
      let { user } = request.session;
    
      let isAdmin = (user && user.type === "admin") ? true : false;

      const idVector = ids.split("-*-"); //Atenção aqui!! Tem que ser separados por esta string!
      
      const result = await ProductModel.findImages(idVector, isAdmin);

      return response.status(200).json(result);
    } catch (err) {
      console.error(err);
      return response.status(500).json({ notification: "Internal server error while trying to get images" });
    }
  },

  async update(request, response) {
    try {
      const newProduct = request.body;

      const { id } = request.params;

      if (request.file) {
        const { originalname, buffer, mimetype } = request.file;

        const image_id = await uploadFile(buffer, originalname, mimetype);

        newProduct.image_id = image_id;

        const prevProduct = await ProductModel.getProductbyId(id);

        await deleteFile(prevProduct.image_id);
      }

      await ProductModel.updateProduct(newProduct, id);

      response.status(200).json({ message: "Sucesso!" });
    } catch (err) {
      console.error(err);
      return response.status(500).json({ notification: "Internal server error while trying to update product" });
    }
  },

  async uploadFiles(request, response) {
    try {
      const images = request.files.imageFiles;
      const {product_id, subproduct_id} = request.body;

      const result = await ImageModel.createImages(images, product_id, subproduct_id);

      return response.status(200).json(result);
    } catch (err) {
      console.error(err);
      return response.status(500).json({ notification: "Internal server error while trying to upload images" });
    }
  },

  async deleteFile(request, response) {
    try {
      const { id } = request.params;
      await ImageModel.deleteImage(id);

      return response.status(200).json({ notification: "Image deleted!" });
    } catch (err) {
      console.error(err);
      return response.status(500).json({ notification: "Internal server error while trying to delete images" });
    }
  },

  async delete(request, response) {
    try {
      const { product_id } = request.params;
      const product = await ProductModel.getProductbyId(product_id);
      await deleteFile(product.image_id);
      await ProductModel.deleteProduct(product_id);
      response.status(200).json({ message: "Deleted product: " + product_id });
    } catch (err) {
      return response.status(500).json({ notification: "Internal server error while trying to delete product" });
    }
  },

}

