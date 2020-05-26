const DataBaseModel = require('../models/DatabaseModel');
const { uploadFile } = require('../models/GoogleDriveModel');


module.exports = {
  async index(request, response) {
    try {
      const result = await DataBaseModel.getOrders();
      return response.status(200).json(result);
    } catch (err) {
      console.log(err);
      return response.status(500).json({ notification: "Internal server error while trying to get products" });
    }
  },

  async create(request, response) {
    try {
      let { products, paymentType } = request.body;
      const user = request.session.user;

      const order = {
        payment_type: paymentType,
        user_id: user.id,
      };

      //VERIFICAR
      const [order_id] = await DataBaseModel.createNewOrder(order);
      console.log(order_id);

      products = products.map((value) => {
        const product = {
          product_id: value.product_id,
          order_id,
          product_quantity: value.product_quantity,
          subproduct_id: value.subproduct_id,
        }

        return product;
      });

      await DataBaseModel.createProductOrder(products);

      response.status(200).json({ order_id });
    } catch (err) {
      if (err.errno === 19)
        return response.status(400).json({ notification: "Invalid ids" });

      return response.status(500).json({ notification: "Internal server error while trying to register the new product" });
    }
  },

  async delete(request, response) {
    try {
      const { order_id } = request.params;
      await DataBaseModel.deleteOrder(order_id);
      response.status(200).json({message: "Deleted order: " + order_id});
    } catch (err) {
      return response.status(500).json({ notification: "Internal server error while trying to delete product" });
    }
  },

}