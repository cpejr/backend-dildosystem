const CarouselModel = require("../models/CarouselModel");
const { uploadFile, deleteFile } = require('../models/GoogleDriveModel');


module.exports = {
  async index(request, response) {
    try {

      const result = await CarouselModel.getCarousel();
      
      return response.status(200).json(result);
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
      const result = await CarouselModel.updateCarousel(id, position);

      return response.status(200).json("Atualizado com sucesso!");
    } catch (err) {
      console.log(err);
      return response.status(500).json({
        notification: "Internal server error while trying to update order",
      });
    }
  },

  async create(request, response) {
    try {
      const newCarousel = request.body;
      const { originalname, buffer, mimetype } = request.file;

      const image_id = await uploadFile(buffer, originalname, mimetype);

      newCarousel.image_id = image_id;

      const [id] = await CarouselModel.createCarousel(newCarousel);

      response.status(200).json({ id });
    } catch (err) {
      console.log(err);
      return response.status(500).json({ notification: "Internal server error while trying to register the new carousel image" });
    }
  },

  async delete(request, response) {
    try {
      const { id } = request.params;
      const carousel_item = await CarouselModel.deleteCarousel(id);
      await deleteFile(carousel_item.image_id);
      response.status(200).json({ message: "Deleted Carousel_Item: " + id });
    } catch (err) {
      console.warn(err);  
      return response.status(500).json({
        notification: "Internal server error while trying to delete order",
      });
    }
  },
};
