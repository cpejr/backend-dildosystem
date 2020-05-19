const connection = require('../database/connection');
const DataBaseModel = require('../models/DatabaseModel');
const { uploadFile } = require('../models/GoogleDriveModel');


module.exports = {
  async index(request, response) {
    let type = "retailer";
    if (request.session)
      type = request.session.user.type;

    let columns = ["id", "name", "client_price", "client_sale_price", "on_sale_client", "featured", "description", "visible", "stock_quantity", "image_id"];
    if (type === 'admin' || type === 'wholesaler')
      columns = [...columns, "wholesaler_price", "wholesaler_sale_price", "on_sale_wholesaler" ];

    let query = connection('products').select(columns);
    if (type !== 'admin')
      query = query.where({ visible: true });

    const result = await query;
    return response.json(result);
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