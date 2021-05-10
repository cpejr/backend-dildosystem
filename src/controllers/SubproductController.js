const SubproductModel = require('../models/SubproductModel');
const ImageModel = require('../models/ImageModel');
const { uploadFile, deleteFile } = require('../models/GoogleDriveModel');

const { uploadAWS, deleteAWS } = require('../models/AWSModel')
const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)


module.exports = {
  async create(request, response) {
    try {
      const newSubproduct = request.body;
      // const { originalname, buffer, mimetype } = request.file;
      const file = request.file;
      console.log('File: ', file)

      const image_id = await uploadAWS(file)
      console.log('Response: ', image_id)
      await unlinkFile(file.path)

      // const image_id = await uploadFile(buffer, originalname, mimetype);

      newSubproduct.image_id = image_id.key;

      await SubproductModel.createNewSubproduct(newSubproduct);

      response.status(200).json({ id: newSubproduct.id });
    } catch (err) {
      if (err.errno === 19)
        return response.status(400).json({ notification: "Invalid product id" })


      console.error(err);
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
      console.error(err.errno);
      return response.status(500).json({ notification: "Internal server error while trying to get subproducts" });
    }
  },

  async update(request, response) {
    try {
      const newSubProduct = request.body;

      const { id } = request.params;

      if (request.file) {
        const file = request.file
        console.log('File: ', file)

        // const image_id = await uploadFile(buffer, originalname, mimetype);

        const image_id = await uploadAWS(file)
        console.log('Response: ', image_id)
        await unlinkFile(file.path)
        newSubProduct.image_id = image_id.key;
        const prevSubProduct = await SubproductModel.getSubproductbyId(id);
        await deleteAWS(prevSubProduct.image_id);
      }

      await SubproductModel.updateSubproduct(newSubProduct, id);

      response.status(200).json({ message: "Sucesso!" });
    } catch (err) {
      console.error(err);
      return response.status(500).json({ notification: "Internal server error while trying to update subproduct" });
    }
  },

  async delete(request, response) {
    try {
      const { product_id } = request.params;
      console.log( product_id )
      const subProduct = await SubproductModel.getSubproductbyId(product_id);
      await deleteAWS(subProduct.image_id)
      await SubproductModel.deleteSubProduct(product_id);
      response.status(200).json({ message: "Deleted subproduct: " + product_id });
    } catch (err) {
      return response.status(500).json({ notification: "Internal server error while trying to delete Subproduct" });
    }
  },
}