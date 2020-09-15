const connection = require("../database/connection");

module.exports = {
  createCarocel(newCarocel) {
    return new Promise(async (resolve, reject) => {
      try {
        let quant = connection('carocel').count('*');
        newCarocel.position = quant +1;
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
        const response = await connection('carocel').select('*');
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
        const response = await connection("carocel")
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
