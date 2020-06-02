const connection = require('../database/connection');
const ITEMS_PER_PAGE = 3;

module.exports = {
  //Categories
  createNewCategory(category) {
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

  createNewSubcategory(subcategory) {
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

  getProductbyId(id, showWholesaler = false) {
    return new Promise(async (resolve, reject) => {
      try {
        let columns = ["id", "name", "client_price", "client_sale_price", "on_sale_client", "featured", "description", "visible", "stock_quantity", "image_id"];
        if (showWholesaler)
          columns = [...columns, "wholesaler_price", "wholesaler_sale_price", "on_sale_wholesaler"];
        const response = await connection("products").where("id", id).select(columns).first();

        resolve(response);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },

  getProducts(type, query, max_price, min_price, order_by, order_ascending, page = 1) {
    return new Promise(async (resolve, reject) => {
      try {
        let columns = ["id", "name", "client_price", "client_sale_price", "on_sale_client", "featured", "description", "visible", "stock_quantity", "image_id", "subcategory_id"];

        if (type === 'admin' || type === 'wholesaler')
          columns = [...columns, "wholesaler_price", "wholesaler_sale_price", "on_sale_wholesaler"];

        let pipeline = connection("products").select(columns);
        let reference = type === "retailer" ? "client_price" : "wholesaler_price";
        let reference_sale = type === "retailer" ? "client_sale_price" : "wholesaler_sale_price";
        let reference_on_sale = type === "retailer" ? "on_sale_client" : "on_sale_wholesaler";
        let order_reference = order_ascending === true ? "asc" : "desc";

        if (query)
          pipeline = pipeline.andWhere(query);

        if (max_price) {
          pipeline = pipeline.andWhere((qb) => {
            qb.where((qb2) => {
              qb2.andWhere(reference, "<=", max_price)
                .andWhere(reference_on_sale, "=", false)
            }).orWhere((qb2) => {
              qb2.andWhere(reference_sale, "<=", max_price)
                .andWhere(reference_on_sale, "=", true)
            })
          })
        }

        if (min_price) {
          pipeline = pipeline.andWhere((qb) => {
            qb.where((qb2) => {
              qb2.andWhere(reference, ">=", min_price)
                .andWhere(reference_on_sale, "=", false)
            }).orWhere((qb2) => {
              qb2.andWhere(reference_sale, ">=", min_price)
                .andWhere(reference_on_sale, "=", true)
            })
          })
        }

        if (order_by) {
          pipeline = pipeline.orderByRaw(`case when ${reference_on_sale} = true then ${reference_sale} else ${reference} end ${order_reference} `); //VERIFY WHEN CHANGE DATABASE YOU DICK!
        }

        pipeline = pipeline.limit(ITEMS_PER_PAGE)
          .offset((page - 1) * ITEMS_PER_PAGE);

        const totalCount = await pipeline.clone().count('id').first();

        const response = await pipeline;
        resolve({ data: response, totalCount: totalCount });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },

  deleteProduct(product_id) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await connection("products").where({ id: product_id }).delete();
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
      operateStock(products, false).then(() => {
        connection("orders_products").insert(products)
          .then(response => resolve(response))
          .catch(error => {
            console.log(error);
            reject(error);
          });
      })
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

  deleteOrder(order_id) {
    return new Promise((resolve, reject) => {
      connection("orders_products")
        .where("order_id", "=", order_id)
        .then((orders_products_vector) => {
          operateStock(orders_products_vector, true)
            .then(() => {
              connection("orders")
                .where("id", "=", order_id)
                .delete()
                .then((result) => {
                  resolve(result);
                }).catch((err) => {
                  console.log(err);
                  reject(err);
                });
            }).catch((err) => {
              console.log(err);
              reject(err);
            });
        }).catch((err) => {
          console.log(err);
          reject(err);
        });
    })
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

function operateStock(product_vector, isIncrement) {
  //This function is being used to manipulate the stock quantity inside the products with a vector of products inside an order.
  let promiseVector = [];
  product_vector.forEach((value) => {
    let product_quantity = value.product_quantity;
    if (!isIncrement) {
      product_quantity = -value.product_quantity;
    }
    if (!value.subproduct_id) {
      promiseVector.push(
        connection("products AS pr")
          .where("pr.id", "=", value.product_id)
          .increment("stock_quantity", product_quantity)
      );
    } else {
      promiseVector.push(
        connection("subproducts AS sb")
          .where("sb.id", "=", value.subproduct_id)
          .increment("stock_quantity", product_quantity)
      );
    }
  })
  return (Promise.all(promiseVector));
}