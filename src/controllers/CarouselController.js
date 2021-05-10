const CarouselModel = require("../models/CarouselModel");
const { uploadFile, deleteFile } = require('../models/GoogleDriveModel');

const { uploadAWS, deleteAWS } = require('../models/AWSModel')
const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)


module.exports = {
  async index(request, response) {
    try {

      const result = await CarouselModel.getCarousel();
      
      return response.status(200).json(result);
    } catch (err) {   
      console.error(err);
      return response.status(500).json({
        notification: "Internal server error while trying to get orders",
      });
    }
  },

  async update(request, response) {
    try {
      const info = request.body;
  
        const result = await CarouselModel.updateCarousel(info.info);

       

      return response.status(200).json("Atualizado com sucesso!");
    } catch (err) {
      console.error(err);
      return response.status(500).json({
        notification: "Internal server error while trying to update order",
      });
    }
  },

  async create(request, response) {
    try {
      const newCarousel = request.body;
      // const { originalname, buffer, mimetype } = request.file;
      const file = request.file;

      // const image_id = await uploadFile(buffer, originalname, mimetype);

      const image_id = await uploadAWS(file)
      console.log('Response: ', image_id)
      await unlinkFile(file.path)

      newCarousel.image_id = image_id.key;

      await CarouselModel.createCarousel(newCarousel);

      response.status(200).json({ id: newCarousel.id });
    } catch (err) {
      console.error(err);
      return response.status(500).json({ notification: "Internal server error while trying to register the new carousel image" });
    }
  },

  async delete(request, response) {
    try {
      const { id } = request.params;
      const carousel_item = await CarouselModel.deleteCarousel(id);
      await deleteAWS(carousel_item.image_id);
      response.status(200).json({ message: "Deleted Carousel_Item: " + id });
    } catch (err) {
      console.warn(err);  
      return response.status(500).json({
        notification: "Internal server error while trying to delete order",
      });
    }
  },
};
