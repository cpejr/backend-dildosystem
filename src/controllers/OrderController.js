const OrderModel = require("../models/OrderModel");
const ProductModel = require("../models/ProductModel");
const { v1: uuidv1 } = require('uuid');
const { getOne } = require("./UserController");

module.exports = {
  async index(request, response) {
    try {
      const { page, byStatus, byid} = request.query;
      const {id} = request.params;
      let query = byStatus ? { order_status: byStatus } : {};
      const result = await OrderModel.getOrders(page, query, byid, id);
      
      response.setHeader("X-Total-Count", result.totalCount);
      return response.status(200).json(result.data);
    } catch (err) {   
      console.log(err);
      return response.status(500).json({
        notification: "Internal server error while trying to get orders",
      });
    }
  },

  async getOne(request, response){
    try{
      const {id} = request.params;
      const {order_id} = request.query;
      const result = await OrderModel.getOne(id, order_id);

      response.status(200).json(result);
    }
    catch(err){
      console.log(err);
      return response.status(500).json({
        notification: "Internal server error while trying to get one order",
      });
    }
  },

  async update(request, response) {
    try {
      const { id } = request.params;
      const fields = request.body;
      const result = await OrderModel.updateOrder(id, fields);

      return response.status(200).json(result.data);
    } catch (err) {
      console.log(err);
      return response.status(500).json({
        notification: "Internal server error while trying to update order",
      });
    }
  },

  async create(request, response) {
    try {
      let { products, paymentType, tracktype, trackprice, id, address_id } = request.body;
      const user = request.session.user;

      const order = {
        id: id,
        track_price: trackprice,
        track_type: tracktype,
        payment_type: paymentType,
        user_id: user.id,
        address_id: address_id
      };

      let products_id = [];
      let subproducts_id = [];
      let completesubproducts = [];

      products.forEach((value) => {
        if(value.subproduct_id){ 
          subproducts_id.push(value.subproduct_id); 
          completesubproducts.push({product_id: value.product_id, subproduct_id: value.subproduct_id}); 

        }
        else products_id.push(value.product_id);
      });

      const stock = await ProductModel.getProductsQuantity(
        products_id,
        subproducts_id
      );
      let out_of_stock = [];
      let not_found = [];

      products.forEach((ordered) => {
        let found = false;

        if (ordered.subproduct_id)
          found = verify("subproduct_id", "subproduct_stock_quantity");
        else found = verify("product_id", "product_stock_quantity");

        if (!found) not_found.push(ordered);

        function verify(field_id, field_quantity) {
          for (let i = 0; i < stock.length; i++) {
            const stock_item = stock[i];

            if (stock_item[field_id] === ordered[field_id]) {
              if (stock_item[field_quantity] < ordered.product_quantity)
                out_of_stock.push(ordered);

              return true;
            }
          }
          return false;
        }
      });
      
      if (not_found.length > 0)
        return response.status(400).json({
          notification: "Some items were not found or are not available",
          items: not_found,
        });

      if (out_of_stock.length > 0)
        return response.status(400).json({
          notification: "Some of the items are out of stock",
          items: out_of_stock,
        });

      const orderPromise = OrderModel.createNewOrder(order);
      const pricesPromise = ProductModel.getProductsPrices(
        products_id,
        user.type
      );

      let [order_id, prices] = await Promise.all([orderPromise, pricesPromise]);
       
      products = products.map((value) => {
        const product = {
          id: uuidv1(),
          product_id: value.product_id,
          order_id,
          product_quantity: value.product_quantity,
          subproduct_id: value.subproduct_id,
          price: prices[value.product_id],
        };

        return product;
      });

      await OrderModel.createProductOrder(products);

      response.status(200).json({ order_id });
    } catch (err) {
      if (err.errno === 19)
        return response.status(400).json({ notification: "Invalid ids" });

      console.warn(err);
      return response.status(500).json({
        notification:
          "Internal server error while trying to register the new order",
      });
    }
  },

  async delete(request, response) {
    try {
      const { order_id } = request.params;
      await OrderModel.deleteOrder(order_id);
      response.status(200).json({ message: "Deleted order: " + order_id });
    } catch (err) {
      console.warn(err);
      return response.status(500).json({
        notification: "Internal server error while trying to delete order",
      });
    }
  },

  async getOrderAddress(request, response) {
    try {

      const { id } = request.params;

      const result = await OrderModel.getOrderAddressAddress(id);

      return response.status(200).json(result);

    } catch (err) {
      console.log(err);
      return response.status(500).json({notification: "Internal error while trying to get order address"})
    }
  },
};
