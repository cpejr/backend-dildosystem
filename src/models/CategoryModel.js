const connection = require("../database/connection");
const { resolve } = require("path");

module.exports = {
  createNewCategory(category) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await connection("categories").insert(category);
        resolve(response);
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  },

  createNewSubcategory(subcategory) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await connection("subcategories").insert(subcategory);
        resolve(response);
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  },

  updateCategory(category, category_id) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await connection("categories")
          .where({ id: category_id })
          .update(category);
        resolve(response);
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  },

  updateSubcategory(subcategory, subcategory_id) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await connection("subcategories")
          .where({ id: subcategory_id })
          .update(subcategory);
        resolve(response);
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  },

  deleteCategory(category_id) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await connection("categories")
          .where({ id: category_id })
          .del();
        resolve(response);
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  },

  deleteSubcategory(subcategory_id) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await connection("subcategories")
          .where({ id: subcategory_id })
          .del();
        resolve(response);
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  },

  getCategories() {
    return new Promise(async (resolve, reject) => {
      try {
        const promises = [
          connection("categories").select("*"),
          connection("subcategories").select("*"),
        ];

        const result = await Promise.all(promises);

        const categories = result[0].map((category) => {
          let fullCat = { ...category, subcategories: [] };

          result[1].forEach((subcat) => {
            if (subcat.category_id === category.id) {
              delete subcat.category_id;
              fullCat.subcategories.push(subcat);
            }
          });
          return fullCat;
        });

        resolve(categories);
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  },

  //Cria e retorna uma query para o Product Model que contém todos os produtos
  //que estão categorizados com a subcategoria que esta função recebe como parâmetro
  async createSubcategoryQuery(subcategory_id) {
    const relations = await connection("products_subcategories")
      .where({"products_subcategories.subcategory_id": subcategory_id})
      .select(["products_subcategories.product_id"]);
    let result = [];
    if (relations && relations.length > 0){
        relations.forEach(relation => {
            result.push(relation.product_id);
        })
    }
    return result;
  },

  async categorize(product_id, subcategories_ids) {
    let newRelations = [];
    subcategories_ids.forEach((subcategory_id) => {
      const newRelation = {
        product_id,
        subcategory_id,
      };
      newRelations.push(newRelation);
    });

    try {
      const result = await connection("products_subcategories").insert(
        newRelations
      );
      return result;
    } catch (error) {
      console.error(error);
    }
  },

  async uncategorize(product_id, subcategory_id) {
    try {
      const result = await connection("products_subcategories")
        .where({
          product_id,
          subcategory_id,
        })
        .delete();
      return result;
    } catch (error) {
      console.error(error);
    }
  },
};
