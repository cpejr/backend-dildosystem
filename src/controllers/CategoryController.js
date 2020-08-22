const CategoryModel = require('../models/CategoryModel');

module.exports = {

  async createCategory(request, response) {
    try {
      const newCategory = request.body;

      const [id] = await CategoryModel.createNewCategory(newCategory);

      response.status(200).json({ id });
    } catch (err) {
      if (err.errno === 19)
        return response.status(400).json({ notification: "Invalid ids" });
      
      console.log(err);
      return response.status(500).json({ notification: "Internal server error while trying to register the new category" });
    }
  },

  async createSubcategory(request, response) {
    try {
        const newSubcategory = request.body;
  
        const [id] = await CategoryModel.createNewSubcategory(newSubcategory);
  
        response.status(200).json({ id });
      } catch (err) { 
        if (err.errno === 19)
            return response.status(400).json({ notification: "Invalid ids" });
      
        console.log(err);
        return response.status(500).json({ notification: "Internal server error while trying to register the new Subcategory" });
      }
  },

  async updateCategory(request, response) {
    try {
        const {id} = request.params;
        const newCategory = request.body;
  
        await CategoryModel.updateCategory(newCategory, id);

        response.status(200).json({ message: "Sucesso!" });
      } catch (err) {
        console.log(err);
        return response.status(500).json({ notification: "Internal server error while trying to update category" });
      }
  },

  async updateSubcategory(request, response) {
    try {
        const {id} = request.params;
        const newSubcategory = request.body;
  
        await CategoryModel.updateSubcategory(newSubcategory, id);

        response.status(200).json({ message: "Sucesso!" });
      } catch (err) {
        console.log(err);
        return response.status(500).json({ notification: "Internal server error while trying to update subcategory" });
      }
  },

  async deleteCategory(request, response) {
    try {
        const {id} = request.params;
  
        await CategoryModel.deleteCategory(id);

        response.status(200).json({ message: "Sucesso!" });
      } catch (err) {
        console.log(err);
        return response.status(500).json({ notification: "Internal server error while trying to delete category" });
      }
  },

  async deleteSubcategory(request, response) {
    try {
        const {id} = request.params;
  
        await CategoryModel.deleteSubcategory(id);

        response.status(200).json({ message: "Sucesso!" });
      } catch (err) {
        console.log(err);
        return response.status(500).json({ notification: "Internal server error while trying to delete subcategory" });
      }
  },

}