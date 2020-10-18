
const connection = require("../database/connection");

const ORDERS_PER_PAGE = 10;

module.exports = {
  createNewOrder(order) {
    return new Promise((resolve, reject) => {
      connection("orders")
        .insert(order)
        .then((response) => resolve(order.id))
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  },

  async updateOrder(id, order) {
    const response = await connection("orders").where("id","=", id).update(order);
    return response;
  },

  createProductOrder(products) {
    return new Promise((resolve, reject) => {
      operateStock(products, false).then(() => {
        connection("orders_products")
          .insert(products)
          .then((response) => resolve(response))
          .catch((error) => {
            reject(error);
          });
      });
    });
  },
  

  getOrders(page = 1, query, byid, byuserid) {
    //  SELECT o.*,op.product_id,op.product_quantity,op.subproduct_id
    //  FROM orders o
    //  INNER JOIN orders_products op ON o.id = op.order_id

    return new Promise(async (resolve, reject) => {
      const pipeline = connection("orders AS o");

      //Get number of orders
      const query1 = pipeline.select().clone().count("o.id").first();
      let query2 = [];
      //Get order
      if (byid != undefined) {
        query2 = pipeline
          .select(
            "o.*",
            "u.name",
            "u.email",
            "u.firebase",
            "u.type",
            "u.cpf",
            "u.birthdate",
            //"u.zipcode",
            "u.phonenumber",
            "a.zipcode",
            "a.state",
            "a.city",
            "a.neighborhood",
            "a.street",
            "a.number",
            "a.complement",
            // "u.state",
            // "u.city",
            // "u.neighborhood",
            // "u.street",
            // "u.number",
            // "u.complement"
          )
          .join("users AS u", "u.id", "=", "o.user_id")
          .join("address AS a", "a.id", "=", connection.raw("address_id"))
          .where(query)
          .andWhere("o.id", "=", byid)
          .limit(ORDERS_PER_PAGE)
          .offset((page - 1) * ORDERS_PER_PAGE);
      } 
      else if(byuserid != undefined){
        query2 = pipeline
          .select(
            "o.*",
            "u.name",
            "u.email",
            "u.firebase",
            "u.type",
            "u.cpf",
            "u.birthdate",
            // "u.zipcode",
            "u.phonenumber",
            "a.zipcode",
            "a.state",
            "a.city",
            "a.neighborhood",
            "a.street",
            "a.number",
            "a.complement",
            // "u.state",
            // "u.city",
            // "u.neighborhood",
            // "u.street",
            // "u.number",
            // "u.complement"
          )
          .join("users AS u", "u.id", "=", "o.user_id")
          .join("address AS a", "a.id", "=", connection.raw("address_id"))
          .where(query)
          .andWhere("u.id", "=", byuserid)
          .limit(ORDERS_PER_PAGE)
          .offset((page - 1) * ORDERS_PER_PAGE);
      }
      else {
        query2 = pipeline
          .select(
            "o.*",
            "u.name",
            "u.email",
            "u.firebase",
            "u.type",
            "u.cpf",
            "u.birthdate",
            //"u.zipcode",
            "u.phonenumber",
            "a.zipcode",
            "a.state",
            "a.city",
            "a.neighborhood",
            "a.street",
            "a.number",
            "a.complement",
            // "u.state",
            // "u.city",
            // "u.neighborhood",
            // "u.street",
            // "u.number",
            // "u.complement"
          )
          .join("users AS u", "u.id", "=", "o.user_id")
          .join("address AS a", "a.id", "=", connection.raw("address_id"))
          .where(query)
          .limit(ORDERS_PER_PAGE)
          .offset((page - 1) * ORDERS_PER_PAGE);
      }

      const orders = await query2;

      const orders_id = orders.map((order) => {
        return order.id;
      });

      //Get orders_products
      const query3 = connection("orders_products AS op")
        .select("op.*", "p.*")
        .whereIn("op.order_id", orders_id)
        .join("products AS p", "op.product_id", "=", "p.id");

      const [totalCount, products] = await Promise.all([query1, query3]);

      //console.log(products);

      const result = {};

      orders.forEach((order) => {
        const user = {};

        user.name = order.name;
        user.email = order.email;
        user.type = order.type;
        user.cpf = order.cpf;
        user.birthdate = order.birthdate;
        //user.zipcode = order.zipcode;
        user.phonenumber = order.phonenumber;
        // user.state = order.state;
        // user.city = order.city;
        // user.neighborhood = order.neighborhood;
        // user.street = order.street;
        // user.number = order.number;
        // user.complement = order.complement;

        delete order.name;
        delete order.email;
        delete order.type;
        delete order.cpf;
        delete order.birthdate;
        //delete order.zipcode;
        delete order.phonenumber;
        // delete order.state;
        // delete order.city;
        // delete order.neighborhood;
        // delete order.street;
        // delete order.number;
        // delete order.complement;

        order.user = user;

        result[order.id] = order;
        result[order.id].products = [];
        result[order.id].totalPrice = 0;
      });

      products.forEach((product) => {
        result[product.order_id].products.push(product);
        result[product.order_id].totalPrice +=
          product.product_quantity * product.price;
      });

      const finalResult = [];
      Object.keys(result).forEach((value, index) => {
        finalResult[index] = result[value];
      });

      resolve({ data: finalResult, totalCount: totalCount["count(`o`.`id`)"] });
    });
  },

  getOne(id, order_id){
    return new Promise(async(resolve, reject) => {
      
      const query1 = connection("orders")
        .select(
        "orders.*",
        "a.zipcode",
        "a.state",
        "a.city",
        "a.neighborhood",
        "a.street",
        "a.number",
        "a.complement",
        )
        .where("orders.id", "=", order_id)
        .andWhere("orders.user_id", "=", id)
        .join("address AS a", "a.id", "=", connection.raw("orders.address_id"))
        .first();
      
      const query2 = connection("users AS u")
        .select(
        "u.id AS order_user_id",  
        "u.name",
        "u.email",
        "u.type",
        "u.cpf",
        "u.birthdate",
        "u.phonenumber",
        )
        .where("order_user_id", id)
        .first();
        
      const query3 = connection("orders_products AS op")
        .join("products AS p", "op.product_id", "=", "p.id")
        .select("op.*", "p.*")  
        .where("op.order_id", order_id);

      const [order, user, products] = await Promise.all([query1, query2, query3])

      let result = {
        ...order,
        ...user,
        products
      }
      
      resolve(result);
    }
    )
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
                })
                .catch((err) => {
                  console.log(err);
                  reject(err);
                });
            })
            .catch((err) => {
              console.log(err);
              reject(err);
            });
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  },
};

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
  });
  return Promise.all(promiseVector);
}
