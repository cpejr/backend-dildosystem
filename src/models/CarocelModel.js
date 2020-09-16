const connection = require("../database/connection");

module.exports = {
  createCarocel(newCarocel) {
    return new Promise(async (resolve, reject) => {
      try {
        let quant = await connection("carocel").count("*").first();
        console.log(quant["count(*)"]);
        newCarocel.position = quant["count(*)"] + 1;
        const response = await connection("carocel").insert(newCarocel);
        resolve(response);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },

  updateCarocel(id, fields) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await connection("carocel")
          .where({ id: id })
          .update(fields);

        resolve(response);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },

  getCarocel() {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await connection("carocel").select("*");
        resolve(response);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },

  deleteCarocel(product_id) {
    return new Promise(async (resolve, reject) => {
      try {
        const item = await connection("carocel")
          .select("image_id", "id")
          .where({ id: product_id })
          .first();

        const response = await connection("carocel")
          .where({ id: product_id })
          .delete();

        const all = await connection("carocel").select("*");

        const updateFields = all.map(async (x) => {
          console.log(x.id);
          console.log(item.id);
          if (item.id < x.id) {
            const position = (x.position) - 1;
            console.log("posição");
            console.log(position);
            const update = await connection("carocel")
              .where({ id: x.id })
              .update("position",position);
            console.log(update);
          }
        });

        resolve(item);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
};
