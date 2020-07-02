const connection = require('../database/connection');
const ITEMS_PER_PAGE = 15;
const ORDERS_PER_PAGE = 3;

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

        let pipeline = connection("products");
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
        const totalCount = await pipeline.clone().select().count('id').first();

        pipeline = pipeline.limit(ITEMS_PER_PAGE)
          .offset((page - 1) * ITEMS_PER_PAGE);

        const response = await pipeline.select(columns);
        resolve({ data: response, totalCount: totalCount['count(`id`)'] });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },

  getProductsQuantity(products_id, subproducts_id) {
    return new Promise(async (resolve, reject) => {
      try {
        /**
         * SELECT p.id AS product_id, p.stock_quantity AS product_stock_quantity, sp.id AS subproduct_id, sp.stock_quantity AS subproduct_stock_quantity FROM products p
         * LEFT OUTER JOIN subproducts sp ON p.id = sp.product_id  AND sp.id IN (2) AND sp.visible = 1
         * WHERE (p.id IN (2,3,10) OR sp.id IN (2)) AND p.visible = 1 
         */

        const response = await connection('products AS p')
          .select('p.id AS product_id', 'p.stock_quantity AS product_stock_quantity', 'sp.id AS subproduct_id', 'sp.stock_quantity AS subproduct_stock_quantity')
          .leftOuterJoin('subproducts AS sp', function () {
            this.on('p.id', '=', 'sp.product_id').andOnIn('sp.visible', [true]).andOnIn('sp.id', subproducts_id)
          })
          .where(function () {
            this.whereIn('p.id', products_id).orWhereIn('sp.id', subproducts_id);
          }).andWhere('p.visible', '=', true);

        resolve(response);
      } catch (err) {
        reject(err);
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

  deleteSubProduct(product_id) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await connection("subproducts").where({ id: product_id }).delete();
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

  async updateOrder(id, order){
    const response = await connection("orders")
    .where("id", id)
    .update(order);
    return response;
  },

  createProductOrder(products) {
    return new Promise((resolve, reject) => {
      operateStock(products, false).then(() => {
        connection("orders_products").insert(products)
          .then(response => resolve(response))
          .catch(error => {
            reject(error);
          });
      })
    });
  },

  getOrders(page = 1) {
    //  SELECT o.*,op.product_id,op.product_quantity,op.subproduct_id 
    //  FROM orders o 
    //  INNER JOIN orders_products op ON o.id = op.order_id 

    return new Promise(async (resolve, reject) => {
      const pipeline = connection("orders AS o")
      
      const query1 = pipeline.select().clone().count('o.id').first();

      const query2 = pipeline.select('o.*')
        .limit(ORDERS_PER_PAGE)
        .offset((page - 1) * ORDERS_PER_PAGE)
      
      const orders = await query2;

      const orders_id = orders.map(order => {
        return order.id;
      });      

      const query3 = connection('orders_products AS op')
        .select(' op.*')
        .whereIn(' op.order_id', orders_id)
      
      const [totalCount, products] = await Promise.all([query1, query3]);
      
      //console.log(products);

      const result = {}

      orders.forEach((order) => {
        result[order.id] = order;
        result[order.id].products = [];
      })

      //console.log(result);

      products.forEach((product) => {
        result[product.order_id].products.push(product)
      })

      const finalResult = [];
      Object.keys(result).forEach((value, index) => {
        finalResult[index] = result[value]
      })

      resolve({ data: finalResult, totalCount: totalCount['count(`o`.`id`)'] });
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