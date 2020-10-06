const connection = require("../database/connection");

module.exports = {
    //Subproducts
    createNewSubproduct(subproduct) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await connection("subproducts").insert(subproduct);
                resolve(response);
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });
    },

    getSubproductsbyProductId(product_id, query) {
        return new Promise(async (resolve, reject) => {
            try {
                const newQuery = { ...query, product_id: product_id };
                const response = await connection("subproducts")
                    .where(newQuery)
                    .select("*");
                resolve(response);
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });
    },

    getSubproductbyId(id) {
        return new Promise(async (resolve, reject) => {
          try {
            let columns = [
              "id",
              "name",
              "description",
              "visible",
              "stock_quantity",
              "min_stock",
              "image_id",
              "product_id",
            ];
           
            let response = await connection("subproducts")
              .where("id", id)
              .select(columns)
              .first();
    
            resolve(response);
          } catch (error) {
            console.log(error);
            reject(error);
          }
        });
      },

    deleteSubProduct(product_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await connection("subproducts")
                    .where({ id: product_id })
                    .delete();
                resolve(response);
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });
    },

    deleteSubProduct(product_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await connection("subproducts")
                    .where({ id: product_id })
                    .delete();
                resolve(response);
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });
    },

    updateSubproduct(subproduct, subproduct_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await connection("subproducts")
                    .where({ id: subproduct_id })
                    .update(subproduct);
                resolve(response);
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });
    },
}