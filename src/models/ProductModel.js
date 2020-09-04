const connection = require("../database/connection");
const ITEMS_PER_PAGE = 15;

module.exports = {
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
        const response = await connection("products")
          .where({ id: product_id })
          .update(product);
        resolve(response);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },

  getlowStock() {
    return new Promise(async (resolve, reject) => {
      try {
        const subproducts = await connection("subproducts")
          .select()
          .where(
            "subproducts.stock_quantity",
            "<=",
            connection.raw("subproducts.min_stock")
          );
        console.log("subproducts: ", subproducts);
        let productIDs = new Set();
        subproducts.forEach((subproduct) => {
          productIDs.add(subproduct.product_id);
        });
        productIDs = Array.from(productIDs);
        console.log("productIDs: ", productIDs);
        let products = await connection("products")
          .select()
          .whereIn("products.id", productIDs)
          .orWhere(
            "products.stock_quantity",
            "<=",
            connection.raw("products.min_stock")
          );
        let result = subproducts.map((subproduct) => {
          let product = products.find(obj => {
            return obj.id === subproduct.product_id;
          })
          const newProduct = { ...product, subproduct };
          console.log("newProduct: ", newProduct);
          return (newProduct)
        })
        products = products.filter(
          function (e) {
            return productIDs.indexOf(e.id) < 0;
          }
        );
        result = [...result, ...products]
        resolve(result);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },

  getProductbyId(id, showWholesaler = false) {
    return new Promise(async (resolve, reject) => {
      try {
        let columns = [
          "id",
          "name",
          "client_price",
          "client_sale_price",
          "on_sale_client",
          "featured",
          "description",
          "visible",
          "stock_quantity",
          "min_stock",
          "image_id",
          "width",
          "height",
          "length",
          "weight",
        ];
        if (showWholesaler)
          columns = [
            ...columns,
            "wholesaler_price",
            "wholesaler_sale_price",
            "on_sale_wholesaler",
          ];
        const response = await connection("products")
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

  getProducts(
    type,
    query,
    max_price,
    min_price,
    order_by,
    order_ascending,
    search,
    page = 1
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        let columns = [
          "id",
          "name",
          "client_price",
          "client_sale_price",
          "on_sale_client",
          "featured",
          "description",
          "visible",
          "stock_quantity",
          "min_stock",
          "image_id",
          "subcategory_id",
        ];

        if (type === "admin" || type === "wholesaler")
          columns = [
            ...columns,
            "wholesaler_price",
            "wholesaler_sale_price",
            "on_sale_wholesaler",
          ];

        let pipeline = connection("products");
        let reference =
          type === "retailer" ? "client_price" : "wholesaler_price";
        let reference_sale =
          type === "retailer" ? "client_sale_price" : "wholesaler_sale_price";
        let reference_on_sale =
          type === "retailer" ? "on_sale_client" : "on_sale_wholesaler";
        let order_reference = order_ascending === true ? "asc" : "desc";


        if (search) {
          pipeline = pipeline.andWhere((qb) => {
            const words = search.split('%');
            words.forEach(word => {
              qb.orWhere((qb2) => {
                qb2.where("name", "like", `%${word}%`).orWhere(
                  "description",
                  "like",
                  `%${word}%`
                );
              })
            })

          });
        }

        if (query) pipeline = pipeline.andWhere(query);

        if (max_price) {
          pipeline = pipeline.andWhere((qb) => {
            qb.where((qb2) => {
              qb2
                .andWhere(reference, "<=", max_price)
                .andWhere(reference_on_sale, "=", false);
            }).orWhere((qb2) => {
              qb2
                .andWhere(reference_sale, "<=", max_price)
                .andWhere(reference_on_sale, "=", true);
            });
          });
        }

        if (min_price) {
          pipeline = pipeline.andWhere((qb) => {
            qb.where((qb2) => {
              qb2
                .andWhere(reference, ">=", min_price)
                .andWhere(reference_on_sale, "=", false);
            }).orWhere((qb2) => {
              qb2
                .andWhere(reference_sale, ">=", min_price)
                .andWhere(reference_on_sale, "=", true);
            });
          });
        }

        if (order_by) {
          pipeline = pipeline.orderByRaw(
            `case when ${reference_on_sale} = true then ${reference_sale} else ${reference} end ${order_reference} `
          ); //VERIFY WHEN CHANGE DATABASE YOU DICK!
        }
        const totalCount = await pipeline.clone().select().count("id").first();

        pipeline = pipeline
          .limit(ITEMS_PER_PAGE)
          .offset((page - 1) * ITEMS_PER_PAGE);

        const response = await pipeline.select(columns);
        resolve({ data: response, totalCount: totalCount["count(`id`)"] });
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

        const response = await connection("products AS p")
          .select(
            "p.id AS product_id",
            "p.stock_quantity AS product_stock_quantity",
            "sp.id AS subproduct_id",
            "sp.stock_quantity AS subproduct_stock_quantity"
          )
          .leftOuterJoin("subproducts AS sp", function () {
            this.on("p.id", "=", "sp.product_id")
              .andOnIn("sp.visible", [true])
              .andOnIn("sp.id", subproducts_id);
          })
          .where(function () {
            this.whereIn("p.id", products_id).orWhereIn(
              "sp.id",
              subproducts_id
            );
          })
          .andWhere("p.visible", "=", true);

        resolve(response);
      } catch (err) {
        reject(err);
      }
    });
  },

  async getProductsPrices(products_id, user_type) {
    /**
     * SELECT p.id AS product_id, p.stock_quantity AS product_stock_quantity, sp.id AS subproduct_id, sp.stock_quantity AS subproduct_stock_quantity FROM products p
     * LEFT OUTER JOIN subproducts sp ON p.id = sp.product_id  AND sp.id IN (2) AND sp.visible = 1
     * WHERE (p.id IN (2,3,10) OR sp.id IN (2)) AND p.visible = 1
     */

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

    console.log(productPrice);
    return productPrice;
  },

  deleteProduct(product_id) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await connection("products")
          .where({ id: product_id })
          .delete();
        resolve(response);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
};
