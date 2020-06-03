const DataBaseModel = require('../models/DatabaseModel');
const { uploadFile } = require('../models/GoogleDriveModel');


module.exports = {
  async index(request, response) {
    try {
      const {page} = request.query;
      const result = await DataBaseModel.getOrders(page);
      
      response.setHeader('X-Total-Count', result.totalCount);
      return response.status(200).json(result.data);
      
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

      let products_id = [];
      let subproducts_id = [];

      products.forEach((value) => {
        if (value.subproduct_id)
          subproducts_id.push(value.subproduct_id);
        else
          products_id.push(value.product_id);
      })

      const stock = await DataBaseModel.getProductsQuantity(products_id, subproducts_id);

      let out_of_stock = [];
      let not_found = [];

      products.forEach((ordered) => {
        let found = false;

        if (ordered.subproduct_id)
          found = verify("subproduct_id", "subproduct_stock_quantity");
        else
          found = verify("product_id", "product_stock_quantity");

        if (!found) not_found.push(ordered);

        function verify(field_id, field_quantity) {
          for (let i = 0; i < stock.length; i++) {
            const stock_item = stock[i];

            if (stock_item[field_id] === ordered[field_id]) {
              if (stock_item[field_quantity] < ordered.product_quantity)
                out_of_stock.push(ordered)

              return true;
            }
          }
          return false;
        }
      })

      if (not_found.length > 0)
        return response.status(400).json({ notification: "Some items were not found or are not available", items: not_found });

      if (out_of_stock.length > 0)
        return response.status(400).json({ notification: "Some of the items are out of stock", items: out_of_stock });

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

      console.warn(err);
      return response.status(500).json({ notification: "Internal server error while trying to register the new product" });
    }
  },

  async delete(request, response) {
    try {
      const { order_id } = request.params;
      await DataBaseModel.deleteOrder(order_id);
      response.status(200).json({ message: "Deleted order: " + order_id });
    } catch (err) {
      console.warn(err);
      return response.status(500).json({ notification: "Internal server error while trying to delete product" });
    }
  },

}