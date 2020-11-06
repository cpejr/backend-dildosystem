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
          //console.log("newProduct: ", newProduct);
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
        let response = await connection("products")
          .where("id", id)
          .select(columns)
          .first();

        const images = await connection("images")
          .where("product_id", id)
          .select(["id", "index"])

        response.secondaries = images;

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
    subcategories,
    page = 1
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        let columns = [ //Colunas padrão da busca.
          "products.id",
          "products.name",
          "client_price",
          "client_sale_price",
          "on_sale_client",
          "products.featured",
          "products.description",
          "products.visible",
          "products.stock_quantity",
          "products.min_stock",
          "products.image_id",
          "subcategory_id",
          "products.weight",
          "products.height",
          "products.width",
          "products.length"
        ];

        if (type === "admin" || type === "wholesaler") //Adiciona colunas na busca dependendo do tipo de usuário.
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


        if (search) { //Faz busca por aproximação de nome e descrição se a query existir.
          pipeline = pipeline.andWhere((qb) => {
            const words = search.split('%');
            words.forEach(word => {
              qb.orWhere((qb2) => {
                qb2.where("products.name", "like", `%${word}%`).orWhere(
                  "products.description",
                  "like",
                  `%${word}%`
                );
              })
            })

          });
        }

        if (query) {
          Object.keys(query).forEach((key) => {
            pipeline = pipeline.andWhere(`products.${key}`, "=", query[key]);
          })
        }

        if (subcategories.length > 0) { //Insere restrição de subcategoria se a query existir.
          pipeline = pipeline.andWhere((qb) => {
            subcategories.forEach(subcat => {
              qb.orWhere("subcategory_id", "=", subcat)
            })
          })
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

        if (min_price) { //Insere comparações de preço mínimo se a query existir.
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

        let totalCount; 

        if(process.env.NODE_ENV == "production"){
          totalCount = await pipeline.clone().select().count("id").first();
       }else{
        totalCount = await pipeline.clone().select().count("*").first();
       }

        let spColumns = [ //Vai permitir que os campos da tabela de subprodutos sejam incluidos no join.
          "sp.id AS spId",
          "sp.name AS spName",
          "sp.description AS spDescription",
          "sp.visible AS spVisible",
          "sp.stock_quantity AS spStockQuantity",
          "sp.min_stock AS spMinStock",
          "sp.image_id AS spImageId",
          "sp.product_id AS spProductId",
          "sp.created_at AS spCreatedAt",
          "sp.updated_at AS spUpdatedAt"
        ] // Renomeando todos os campos.

        let imgColumns = [
          "img.id AS imgId",
          "img.product_id AS imgProductId",
          "img.subproduct_id AS imgSubproductId",
          "img.index AS imgIndex"
        ] // Renomeando todos os campos.

        columns = [...columns, ...spColumns, ...imgColumns]; //Adicionando campos dos subprodutos no select.

        pipeline = pipeline
          .limit(ITEMS_PER_PAGE)
          .offset((page - 1) * ITEMS_PER_PAGE) //Paginação
          .leftJoin("subproducts AS sp", "products.id", "sp.product_id")
          .leftJoin("images AS img", function () { //Vai dar join em imagens usando ids dos produtos e dos subprodutos.
            this
              .on("products.id", "=", "img.product_id")
              .orOn("sp.id", "=", "img.subproduct_id");
          }) //Essse joins geram muitas cópias de cada produto. A função .then a seguir organiza o resultado final.
          .select(columns)
          .then(function (data) {
            /////
            function checkMultiple(id, arr) { //Identifica se o produto está aparecendo mais de uma vez no pipeline 
              //Isso acontece quando ele tem subprodutos, secundarias, ou pior, quando seus subprodutos tem secundarias.
              let indexes = []; //Identificador de index dos produtos repetidos. É usado mais pra frente.
              arr.forEach((product, index) => {
                if (product.id === id) {
                  indexes.push(index); //Vai inserir o index de um produto que se repete na pipeline.
                }
              });

              if (indexes.length > 1) {
                return { resu: true, indexes }; //Avisa que tem mais de uma cópia. Envia os indexes delas como vetor.
              } else {
                return { resu: false, indexes }; //O contrário do de cima. Um indice no vetor.
              }
            }
            //////
            let result = [];
            if (data.length > 0) {
              for (let aux = 0; aux < data.length; aux++) { //Percorre todos os produtos.
                const search = checkMultiple(data[aux].id, data); //Retorna se o produto tem repetição ou não.
                if (search.resu === true) { //Produto está repetido.
                  let completeProduct = { ...data[aux] } //Cópia do primeiro produto encontrado.
                  //Removendo campos do subproduto da pipeline (Vão ser jogados na cópia final).
                  delete completeProduct["spId"];
                  delete completeProduct["spName"];
                  delete completeProduct["spDescription"];
                  delete completeProduct["spVisible"];
                  delete completeProduct["spStockQuantity"];
                  delete completeProduct["spMinStock"];
                  delete completeProduct["spImageId"];
                  delete completeProduct["spProductId"];
                  delete completeProduct["spCreatedAt"];
                  delete completeProduct["spUpdatedAt"];


                  //Mesma coisa para os campos de imagens secundarias.
                  delete completeProduct["imgId"];
                  delete completeProduct["imgProductId"];
                  delete completeProduct["imgSubproductId"];
                  delete completeProduct["imgIndex"];


                  completeProduct.subproducts = []; //Campo do produto que vai guardar vetor de subprodutos.
                  completeProduct.secondaries = []; //Campo do produto que vai guardar seu proprio vetor de imagens secundarias.
                  for (let i = search.indexes[0]; i < search.indexes[0] + search.indexes.length; i++) { //Usa o indexes para localizar as cópias.

                    if (data[i].imgId !== null) { //Só vai inserir a imagem no produto final se ela não for de um subproduto
                      const isOn1 = completeProduct.secondaries.findIndex((element) => { //Solução tosca para evitar cópias indesejadas.
                        return element.index === data[i].imgIndex;
                      })
                      if (isOn1 < 0) {
                        completeProduct.secondaries.push({ //Insere imagem secundária no produto com os nomes dos campos certos.
                          id: data[i].imgId,
                          index: data[i].imgIndex
                        })
                      }
                    } else { //Imagem pertence a um subproduto localizado nesse produto.

                    }

                    const isOn2 = completeProduct.subproducts.findIndex((element) => { //Solução tosca para evitar cópias indesejadas.
                      return element.id === data[i].spId;
                    })
                    if (isOn2 < 0) {
                      completeProduct.subproducts.push({ //Insere os subprodutos no vetor dentro de produtos com os nomes certos.
                        id: data[i].spId,
                        name: data[i].spName,
                        description: data[i].spDescription,
                        secondaries: [],
                        visible: data[i].spVisible,
                        stock_quantity: data[i].spStockQuantity,
                        min_stock: data[i].spMinStock,
                        image_id: data[i].spImageId,
                        product_id: data[i].spProductId,
                        created_at: data[i].spCreatedAt,
                        updated_at: data[i].spUpdatedAt
                      })
                    }
                  }
                  aux += search.indexes.length - 1; //Modifica o aux do for para não gerar mais de uma cópia por produto.
                  //Funciona baseando-se no principio de que o pipeline sempre gera cópias do produto com subproduto em sequência.

                  const isOn3 = result.findIndex((element) => { //Solução tosca para evitar cópias indesejadas.
                    return element.id === completeProduct.id;
                  })
                  if (isOn3 < 0) {
                    //No caso de um produto mais de uma imagem secundaria, mas nao ter subprodutos.
                    if (completeProduct["subproducts"].length === 0) delete completeProduct["subproducts"];
                    //No caso de um produto mais de um subproduto, mas nao ter secundarias.
                    if (completeProduct["secondaries"].length === 0) delete completeProduct["secondaries"];
                    result.push(completeProduct); //Insere o produto completo no resultado.
                  }

                } else { //Produto não está repetido.
                  //Remove os campos puxados pela pipeline do subproduto (nesse caso todos vem como null)
                  data[aux].subproducts = [];
                  data[aux].secondaries = [];
                  if (data[aux].spId !== null) { //Testa e trata o caso especial de so existir um subproduto.
                    data[aux].subproducts.push({
                      id: data[aux].spId,
                      name: data[aux].spName,
                      description: data[aux].spDescription,
                      visible: data[aux].spVisible,
                      stock_quantity: data[aux].spStockQuantity,
                      min_stock: data[aux].spMinStock,
                      image_id: data[aux].spImageId,
                      product_id: data[aux].spProductId,
                      created_at: data[aux].spCreatedAt,
                      updated_at: data[aux].spUpdatedAt,
                    })
                  }
                  delete data[aux].spId;
                  delete data[aux].spName;
                  delete data[aux].spDescription;
                  delete data[aux].spVisible;
                  delete data[aux].spStockQuantity;
                  delete data[aux].spMinStock;
                  delete data[aux].spImageId;
                  delete data[aux].spProductId;
                  delete data[aux].spCreatedAt;
                  delete data[aux].spUpdatedAt;
                  //Nao precisa desse vetor no resultado se nao tiver subprodutos
                  if (data[aux].subproducts.length === 0) delete data[aux].subproducts;

                  if (data[aux].imgId !== null) { //Testa e trata o caso especial de so existir uma imagem secundaria.
                    data[aux].secondaries.push({
                      id: data[aux].imgId,
                      product_id: data[aux].imgProductId,
                      subproduct_id: data[aux].imgSubproductId,
                      index: data[aux].imgIndex,
                    })
                  }
                  //Mesma coisa para os campos da imagem
                  delete data[aux].imgId;
                  delete data[aux].imgProductId;
                  delete data[aux].imgSubproductId;
                  delete data[aux].imgIndex;
                  //Nao precisa desse vetor no resultado se nao tiver subprodutos
                  if (data[aux].secondaries.length === 0) delete data[aux].secondaries;

                  result.push(data[aux]); //Insere produto limpo no resultado.
                }
              }
              return result; //Resultado final da pipeline.
            } else {
              return data; //Por algum motivo não achou produtos
            }
          });

        const response = await pipeline; //Efetivamente faz a busca completa da pipeline.
        if(process.env.NODE_ENV == "production"){
          resolve({ data: response, totalCount: totalCount.count });
       }else{
        resolve({ data: response, totalCount: totalCount["count(`id`)"]});
       }
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

    return productPrice;
  },

  async findImages(ids, isAdmin) {
    try {
      console.log("ids: ", ids);

      const result = await connection("images AS img")
        .select("*")
        .whereIn("img.product_id", ids)
        .orWhereIn("img.subproduct_id", ids);
      //.groupBy("img.product_id");

      console.log("resultado: ", result);
      return result;
    } catch (err) {
      console.log(err);
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
        console.log(error);
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
        console.log(error);
        reject(error);
      }
    });
  },
};
