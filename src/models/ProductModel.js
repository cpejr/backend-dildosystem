const connection = require("../database/connection");
const categoryModel = require("./CategoryModel");
const subproductModel = require("./SubProductModel");
const ITEMS_PER_PAGE = 15;

module.exports = {
  createNewProduct(product) {
    return new Promise(async (resolve, reject) => {
      const subcategory_id = product.subcategory_id;
      //delete product.subcategory_id;
      try {
        const response = await connection("products").insert(product);
        await categoryModel.categorize(product.id, [subcategory_id]);
        resolve(response);
      } catch (error) {
        console.error(error);
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
        //console.log("subproducts: ", subproducts);
        let productIDs = new Set();
        subproducts.forEach((subproduct) => {
          productIDs.add(subproduct.product_id);
        });
        productIDs = Array.from(productIDs);
        //console.log("productIDs: ", productIDs);
        let products = await connection("products")
          .select()
          .whereIn("products.id", productIDs)
          .orWhere(
            "products.stock_quantity",
            "<=",
            connection.raw("products.min_stock")
          );
        let result = subproducts.map((subproduct) => {
          let product = products.find((obj) => {
            return obj.id === subproduct.product_id;
          });
          const newProduct = { ...product, subproduct };
          //console.log("newProduct: ", newProduct);
          return newProduct;
        });
        products = products.filter(function (e) {
          return productIDs.indexOf(e.id) < 0;
        });
        result = [...result, ...products];
        resolve(result);
      } catch (error) {
        console.error(error);
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
          "best_seller",
          "release",
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
        let response = await connection("products")
          .where("id", id)
          .select(columns)
          .first();

        const images = await connection("images")
          .where("product_id", id)
          .select(["id", "index"]);

        response.secondaries = images;

        resolve(response);
      } catch (error) {
        console.error(error);
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
    categoryQuery,
    subcategoryQuery,
    page = 1
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        let columns = [
          //Colunas padrão da busca.
          "products.id",
          "products.name",
          "client_price",
          "client_sale_price",
          "on_sale_client",
          "products.best_seller",
          "products.release",
          "products.description",
          "products.visible",
          "products.stock_quantity",
          "products.min_stock",
          "products.image_id",
          "subcategory_id",
          "products.weight",
          "products.height",
          "products.width",
          "products.length",
        ];

        if (type === "admin" || type === "wholesaler")
          //Adiciona colunas na busca dependendo do tipo de usuário.
          columns = [
            ...columns,
            "wholesaler_price",
            "wholesaler_sale_price",
            "on_sale_wholesaler",
          ];

        let pipeline = connection("products");

        //Vão determinar a ordem de preço a ser buscado dependendo do tipo de usuário.
        let reference =
          type === "retailer" ? "client_price" : "wholesaler_price";
        let reference_sale =
          type === "retailer" ? "client_sale_price" : "wholesaler_sale_price";
        let reference_on_sale =
          type === "retailer" ? "on_sale_client" : "on_sale_wholesaler";
        let order_reference = order_ascending === true ? "asc" : "desc";

        if (search) {
          //Faz busca por aproximação de nome e descrição se a query existir.
          pipeline = pipeline.andWhere((qb) => {
            const words = search.split("%");
            words.forEach((word) => {
              qb.orWhere((qb2) => {
                qb2
                  .where("products.name", "ilike", `%${word}%`)
                  .orWhere("products.description", "ilike", `%${word}%`);
              });
            });
          });
        }

        if (query) {
          Object.keys(query).forEach((key) => {
            pipeline = pipeline.andWhere(`products.${key}`, "=", query[key]);
          });
        }

        if (categoryQuery.length > 0) { //Insere restrição de subcategoria se a query existir.
          pipeline = pipeline
            .whereIn("products.id", categoryQuery);
        }

        if (subcategoryQuery.length > 0) { //Insere restrição de subcategoria se a query existir.
          pipeline = pipeline
            .whereIn("products.id", subcategoryQuery);
        }

        if (max_price) { //Insere comparações de preço máximo se a query existir.
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
          //Insere comparações de preço mínimo se a query existir.
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

        let totalCount;

        if (process.env.NODE_ENV == "production") {
          totalCount = await pipeline.clone().select().count("id").first();
        } else {
          totalCount = await pipeline.clone().select().count("*").first();
        }

        if (order_by) {
          pipeline = pipeline.orderByRaw(
            `case when ${reference_on_sale} = true then ${reference_sale} else ${reference} end ${order_reference} `
          ); //VERIFY WHEN CHANGE DATABASE YOU DICK!
        }

        pipeline = pipeline
          .limit(ITEMS_PER_PAGE)
          .offset((page - 1) * ITEMS_PER_PAGE) //Paginação
          .select(columns)

        const products = await pipeline; //Efetivamente faz a busca completa da pipeline.
        const subpPromises = [];

        //PUXA OS SUBPRODUTOS DE UM DADO PRODUTO E OS COLOCA NOS OBJETOS
        products.forEach(prod => {
          subpPromises.push(subproductModel.getSubproductsbyProductId(prod.id));
        })

        const subproducts = await Promise.all(subpPromises);
        console.log
        subproducts.forEach((subpList, index) => {
          if (subpList && subpList.length > 0) {
            products[index].subproducts = subpList;
          }
        });

        //PUXA AS IMAGENS SECUNDÁRIAS DOS PRODUTOS
        const prodIds = products.map(prod => prod.id);
        console.log("productIDs: ", prodIds);
        const secondaryImages = await connection("images")
          .select('*')
          .whereIn('images.product_id', prodIds);

        console.log("secondaryImages:", secondaryImages);

        //COLOCA AS IMAGENS SECUNDÁRIAS ONDE DEVEM FICAR
        secondaryImages.forEach(image => {
          const prodIndex = products.findIndex(prod => prod.id === image.product_id);
          if (!image.subproduct_id) { // CASO EM QUE NÃO HÁ ID DE SUBPRODUTO - IMAGEM SECUNDÁRIA DE PRODUTO
            if (!products[prodIndex].secondaries) products[prodIndex].secondaries = []; //SE FOR A PRIMEIRA IMAGEM SECUNDÁRIA
            products[prodIndex].secondaries.push(
              {
                id: image.id,
                index: image.index/* (products[prodIndex].secondaries.length + 1) */
              }
            )
          } else { // CASO EM QUE HÁ ID DE SUBPRODUTO
            const subpIndex = products[prodIndex].subproducts.findIndex(subp => subp.id === image.subproduct_id);
            if (!products[prodIndex].subproducts[subpIndex].secondaries) products[prodIndex].subproducts[subpIndex].secondaries = []; //SE FOR A PRIMEIRA IMAGEM SECUNDÁRIA

            products[prodIndex].subproducts[subpIndex].secondaries.push(
              {
                id: image.id,
                index: image.index /* (products[prodIndex].subproducts[subpIndex].secondaries.length + 1) */
              }
            )
          }
        })

        if (process.env.NODE_ENV == "production") {
          resolve({ data: products, totalCount: totalCount.count });
        } else {
          resolve({ data: products, totalCount: totalCount["count(*)"] });
        }
      } catch (error) {
        console.error(error);
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

    return productPrice;
  },

  async findImages(ids, isAdmin) {
    try {
      //console.log("ids: ", ids);

      const result = await connection("images AS img")
        .select("*")
        .whereIn("img.product_id", ids)
        .orWhereIn("img.subproduct_id", ids);
      //.groupBy("img.product_id");

      //console.log("resultado: ", result);
      return result;
    } catch (err) {
      console.error(err);
      return [];
    }
  },

  updateProduct(product, product_id) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await connection("products")
          .where({ id: product_id })
          .update(product);
        resolve(response);
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  },

  deleteProduct(product_id) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await connection("products")
          .where({ id: product_id })
          .delete();
        resolve(response);
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  },

  productIsInOrder(product_id) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await connection("orders_products")
          .select('*')
          .whereIn("product_id", [product_id])
          .first();
        if (response) {
          resolve(true);
        }
        else {
          resolve(false);
        }
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  },
};
