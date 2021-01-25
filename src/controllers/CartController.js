const { getCart } = require("../models/CartModel");
const ProductModel = require("../models/ProductModel");

module.exports = {
  async getCart(request, response) {
    try {
      const cart = request.body;
      let productQuery = cart.map(element => element.product_id);

      let userType = "retailer";
      if (request.session) {
        const type = request.session.user.type;
        userType = type;
        if (type === "wholesaler" && request.session.user.user_status !== "approved") userType = "retailer";
      }

      const result = await ProductModel.getProducts(
        userType,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        productQuery,
        1,
        true
      );

      let new_cart = [];
      cart.forEach(element => {
        let product = { ...result.data.find(p => p.id === element.product_id) };
        if (product.subproducts) {
          product.subproduct = product.subproducts.find(s => s.id === element.subproduct_id);
          delete product.subproducts
        }
        product.quantity = element.quantity;
        new_cart.push(product);
      });

      return response.status(200).json(new_cart);
    } catch (err) {
      console.error(err);
      return response
        .status(500)
        .json({
          notification: "Internal server error while trying to get cart",
        });
    }
  },
}