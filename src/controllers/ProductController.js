const connection = require('../database/connection');
const DataBaseModel = require('../models/DatabaseModel');

module.exports = {
  async index(request, response) {
    const users = await connection('users').select('*');
    return response.json(users);
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
      const { id }  = request.params;

      await DataBaseModel.updateProduct(newProduct, id);

      response.status(200).json({ message: "Sucesso!" });
    } catch (err) {
      console.log(err);
      return response.status(500).json({ notification: "Internal server error while trying to update product" });
    }
  }
}