const connection = require('../database/connection');
const DataBaseModel = require('../models/DatabaseModel');

module.exports = {
  async index(request, response) {
    let type = "retailer";
    if (request.session)
      type = request.session.user.type;

    let columns = ["id", "name", "client_price", "client_sale_price", "on_sale_client", "featured", "description", "visible", "stock_quantity", "image_id"];
    if (type === 'admin' || type === 'wholesaler')
      columns = [...columns, "wholesailer_price", "wholesailer_sale_price", "on_sale_wholesaler" ];

    let query = connection('products').select(columns);
    if (type !== 'admin')
      query = query.where({ visible: true });

    const result = await query;
    return response.json(result);
  },

  async create(request, response) {
    try {
      const newProduct = request.body;

      const [id] = await DataBaseModel.createNewProduct(newProduct);

      response.status(200).json({ id });
    } catch (err) {

      return response.status(500).json({ notification: "Internal server error while trying to register the new product" });
    }
  },

  async update(request, response) {
    try {
      const newProduct = request.body;
      const { id } = request.params;

      await DataBaseModel.updateProduct(newProduct, id);

      response.status(200).json({ message: "Sucesso!" });
    } catch (err) {
      console.log(err);
      return response.status(500).json({ notification: "Internal server error while trying to update product" });
    }
  }
}