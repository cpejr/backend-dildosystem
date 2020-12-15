const BannerModel = require("../models/BannerModel");
const { uploadFile, deleteFile } = require('../models/GoogleDriveModel');


module.exports = {
  async index(request, response) {
    try {

      const result = await BannerModel.getBanner();
      
      return response.status(200).json(result);
    } catch (err) {   
      console.error(err);
      return response.status(500).json({
        notification: "Internal server error while trying to get banner image",
      });
    }
  },

  async update(request, response) {
    try {
      const info = request.body;
      //console.log(info)
      const result = await BannerModel.updateBanner(info.info);

      return response.status(200).json("Atualizado com sucesso!");
    } catch (err) {
      console.error(err);
      return response.status(500).json({
        notification: "Internal server error while trying to update banner image",
      });
    }
  },

  async create(request, response) {
    try {
      const newBanner = request.body;
      const { originalname, buffer, mimetype } = request.file;

      const image_id = await uploadFile(buffer, originalname, mimetype);

      newBanner.image_id = image_id;

      await BannerModel.createBanner(newBanner);

      response.status(200).json({ id: newBanner.id });
    } catch (err) {
      console.error(err);
      return response.status(500).json({ notification: "Internal server error while trying to register the new banner image" });
    }
  },

  async delete(request, response) {
    try {
      const { id } = request.params;
      const Banner_item = await BannerModel.deleteBanner(id);
      await deleteFile(Banner_item.image_id);
      response.status(200).json({ message: "Deleted Banner_Item: " + id });
    } catch (err) {
      console.warn(err);  
      return response.status(500).json({
        notification: "Internal server error while trying to delete order",
      });
    }
  },
};
