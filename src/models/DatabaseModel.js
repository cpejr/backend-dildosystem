const connection = require('../database/connection');

module.exports = {
  //Categories
  createNewCategory(category){
    return new Promise(async (resolve, reject) => {
      try {
        const response = await connection("categories").insert(category);
        resolve(response);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },

  createNewSubcategory(subcategory){
    return new Promise(async (resolve, reject) => {
      try {
        const response = await connection("subcategories").insert(subcategory);
        resolve(response);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },

  updateCategory(category, category_id) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await connection("categories").where({ id: category_id }).update(category);
        resolve(response);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },

  updateSubcategory(subcategory, subcategory_id) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await connection("subcategories").where({ id: subcategory_id }).update(subcategory);
        resolve(response);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },

  deleteCategory(category_id) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await connection("categories").where({ id: category_id }).del();
        resolve(response);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },

  deleteSubcategory(subcategory_id) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await connection("subcategories").where({ id: subcategory_id }).del();
        resolve(response);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
  
  //User
  getUserByUid(uid) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await connection("users").where("firebase", uid).select("*").first();
        resolve(user);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },

  //Products
  createNewProduct(product) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await connection("products").insert(product);
        resolve(response);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },

  updateProduct(product, product_id) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await connection("products").where({ id: product_id }).update(product);
        resolve(response);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },

  getProductbyId(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await connection("products").where("id", id).select("*").first();
        resolve(response);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },

  getProducts(columns, query) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await connection("products").where(query).select(columns);
        resolve(response);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },

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
        const response = await connection("subproducts").where(newQuery).select("*");
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
        const response = await connection("subproducts").where({ id: subproduct_id }).update(subproduct);
        resolve(response);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },

  //Orders
  createNewOrder(order) {
    return new Promise((resolve, reject) => {
      connection("orders").insert(order)
        .then(response => resolve(response))
        .catch(error => {
          console.log(error);
          reject(error);
        });
    });
  },

  createProductOrder(products) {
    return new Promise((resolve, reject) => {
      connection("orders_products").insert(products)
        .then(response => resolve(response))
        .catch(error => {
          console.log(error);
          reject(error);
        });
    });
  },

  getOrders() {
    //  SELECT o.*,op.product_id,op.product_quantity,op.subproduct_id 
    //  FROM orders o 
    //  INNER JOIN orders_products op ON o.id = op.order_id 

    return new Promise((resolve, reject) => {
      connection("orders AS o")
        .select('o.*', ' op.product_id', ' op.product_quantity', ' op.subproduct_id')
        .innerJoin('orders_products AS op', 'o.id', 'op.order_id')
        .then(response => {
          const result = {};

          response.forEach((value) => {
            const order = {
              id: value.id,
              user_id: value.user_id,
              created_at: value.created_at,
              payment_type: value.payment_type,
              status: value.status,
              products: []
            }

            if (!result[order.id])
              result[order.id] = order;

            const product = {
              product_id: value.product_id,
              product_quantity: value.product_quantity,
              subproduct_id: value.subproduct_id,
            }

            result[order.id].products.push(product)
          })

          const finalResult = [];
          Object.keys(result).forEach((value, index) => {
            finalResult[index] = result[value]
          })

          resolve(finalResult)
        }
        )
        .catch((error) => {
          console.log(error);
          reject(error);
        })
    });
  },
  
  //Credentials
  getCredentials() {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await connection("credentials").select("*").first();
        resolve(response);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    })
  },

  updateCredentials(credentials) {
    return new Promise(async (resolve, reject) => {
      try {
        const token = await connection("credentials").first();

        if (!token) {
          createCredentials(credentials)
        }

        const response = await connection("credentials").first().update(credentials);
        resolve(response);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    })
  },

  createCredentials: createCredentials
}

function createCredentials(credentials) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await connection("credentials").insert(credentials);
      resolve(response);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  })
}