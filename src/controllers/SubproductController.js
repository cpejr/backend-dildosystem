const SubproductModel = require('../models/SubproductModel');
const { uploadFile } = require('../models/GoogleDriveModel');

module.exports = {
  async create(request, response) {
    try {
      const newSubproduct = request.body;
      const { originalname, buffer, mimetype } = request.file;

      const image_id = await uploadFile(buffer, originalname, mimetype);

      newSubproduct.image_id = image_id;

      const [id] = await SubproductModel.createNewSubproduct(newSubproduct);

      response.status(200).json({ id });
    } catch (err) {
      if (err.errno === 19)
        return response.status(400).json({ notification: "Invalid product id" })


      console.log(err);
      return response.status(500).json({ notification: "Internal server error while trying to register the new subproduct" });
    }
  },

  async getSubproducts(request, response) {
    try {
      let type = "retailer";
      if (request.session)
        type = request.session.user.type;

      let query = { visible: true };
      if (type === 'admin')
        query = {};

      const { product_id } = request.params;
      const result = await SubproductModel.getSubproductsbyProductId(product_id, query);
      response.status(200).json(result);
    } catch (err) {
      console.log(err.errno);
      return response.status(500).json({ notification: "Internal server error while trying to get subproducts" });
    }
  },

  async delete(request, response) {
    try {
      const { product_id } = request.params;
      await SubproductModel.deleteSubProduct(product_id);
      response.status(200).json({ message: "Deleted subproduct: " + product_id });
    } catch (err) {
      return response.status(500).json({ notification: "Internal server error while trying to delete product" });
    }
  },
}