const CarocelModel = require("../models/CarocelModel");
const { uploadFile, deleteFile } = require('../models/GoogleDriveModel');


module.exports = {
  async index(request, response) {
    try {

      const result = await CarocelModel.getCarocel();
      
      response.setHeader("X-Total-Count", result.totalCount);
      return response.status(200).json(result.data);
    } catch (err) {   
      console.log(err);
      return response.status(500).json({
        notification: "Internal server error while trying to get orders",
      });
    }
  },

  async update(request, response) {
    try {
      const { id } = request.params;
      const position = request.body;
      const result = await CarocelModel.updateCarocel(id, position);

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
      const newCarocel = request.body;
      const { originalname, buffer, mimetype } = request.file;

      const image_id = await uploadFile(buffer, originalname, mimetype);

      newCarocel.image_id = image_id;

      const [id] = await CarocelModel.createCarocel(newCarocel);

      response.status(200).json({ id });
    } catch (err) {
      console.log(err);
      return response.status(500).json({ notification: "Internal server error while trying to register the new carocel image" });
    }
  },

  async delete(request, response) {
    try {
      const { id } = request.params;
      const carocel_item = await CarocelModel.deleteCarocel(id);
      await deleteFile(carocel_item.image_id);
      response.status(200).json({ message: "Deleted Carocel_Item: " + id });
    } catch (err) {
      console.warn(err);
      return response.status(500).json({
        notification: "Internal server error while trying to delete order",
      });
    }
  },
};
