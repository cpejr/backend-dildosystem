const connection = require("../database/connection");

module.exports = {
    //Subproducts
    createNewSubproduct(subproduct) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await connection("subproducts").insert(subproduct);
                resolve(response);
            } catch (error) {
                console.error(error);
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
                console.error(error);
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
            console.error(error);
            reject(error);
          }
        });
      },

      async getSubproductsPrices(subproducts_id, user_type) {
        /**
         * SELECT p.id AS product_id, p.stock_quantity AS product_stock_quantity, sp.id AS subproduct_id, sp.stock_quantity AS subproduct_stock_quantity FROM products p
         * LEFT OUTER JOIN subproducts sp ON p.id = sp.product_id  AND sp.id IN (2) AND sp.visible = 1
         * WHERE (p.id IN (2,3,10) OR sp.id IN (2)) AND p.visible = 1
         */
        let products_id = subproducts_id.map((subproduct)=>{
            return subproduct.product_id;
        })

        const response = await connection("products AS p")
          .select(
            "p.id",
            "p.on_sale_client",
            "p.on_sale_wholesaler",
            "p.client_price",
            "p.wholesaler_price",
            "p.wholesaler_sale_price",
            "p.client_sale_price"
          )
          .whereIn("p.id", products_id);
    
        const productPrice = {};
    
        response.forEach((product) => {
          let price;
    
          if (user_type === "wholesailer") {
            // == é necessário
            if (product.on_sale_wholesaler == 1)
              price = product.wholesaler_sale_price;
            else price = product.wholesaler_price;
          } else {
            // == é necessário
            if (product.on_sale_client == 1) price = product.client_sale_price;
            else price = product.client_price;
          }
    
          productPrice[product.id] = price;
        });

        subproducts_id.forEach((subproduct)=>{
            
        });


    
        return productPrice;
      },

    deleteSubProduct(product_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await connection("subproducts")
                    .where({ id: product_id })
                    .delete();
                resolve(response);
            } catch (error) {
                console.error(error);
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
                console.error(error);
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
                console.error(error);
                reject(error);
            }
        });
    },
}