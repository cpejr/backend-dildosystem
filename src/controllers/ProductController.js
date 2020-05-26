const DataBaseModel = require('../models/DatabaseModel');
const { uploadFile } = require('../models/GoogleDriveModel');


module.exports = {
  async index(request, response) {
    try {
      const filter = request.query;
      let type = "retailer";
      if (request.session)
        type = request.session.user.type;

      let columns = ["id", "name", "client_price", "client_sale_price", "on_sale_client", "featured", "description", "visible", "stock_quantity", "image_id", "subcategory_id"];
      if (type === 'admin' || type === 'wholesaler')
        columns = [...columns, "wholesaler_price", "wholesaler_sale_price", "on_sale_wholesaler"];

      let query = { visible: true, ...filter };
      if (type === 'admin')
        query = { ...filter };

      const result = await DataBaseModel.getProducts(columns, query);
      return response.status(200).json(result);

    } catch (err) {
      console.log(err);
      return response.status(500).json({ notification: "Internal server error while trying to get products" });
    }
  },

  async create(request, response) {
    try {
      const newProduct = request.body;
      const { originalname, buffer, mimetype } = request.file;

      const image_id = await uploadFile(buffer, originalname, mimetype);

      newProduct.image_id = image_id;

      const [id] = await DataBaseModel.createNewProduct(newProduct);

      response.status(200).json({ id });
    } catch (err) {
      console.log(err);
      return response.status(500).json({ notification: "Internal server error while trying to register the new product" });
    }
  },

  async update(request, response) {
    try {
      const newProduct = request.body;
      const { originalname, buffer, mimetype } = request.file;

      const { id } = request.params;

      const image_id = await uploadFile(buffer, originalname, mimetype);

      newProduct.image_id = image_id;

      await DataBaseModel.updateProduct(newProduct, id);

      response.status(200).json({ message: "Sucesso!" });
    } catch (err) {
      console.log(err);
      return response.status(500).json({ notification: "Internal server error while trying to update product" });
    }
  }
}