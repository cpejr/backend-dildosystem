const connection = require("../database/connection");

module.exports = {
  createCarousel(newCarousel) {
    return new Promise(async (resolve, reject) => {
      try {
        let quant;
        if(process.env.NODE_ENV == "production"){
          quant = await connection("carousel").count("position").first();
           quant = parseInt(quant.count) + 1;
        }else{
          quant = await connection("carousel").count("*").first();
          quant = parseInt(quant["count(*)"]) + 1;
        }
        newCarousel.position = quant;
        const response = await connection("carousel").insert(newCarousel);
        resolve(response);
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  },

  updateCarousel(info) {
    return new Promise(async (resolve, reject) => {
      let response;
      
        try {

          info.forEach(async element => { 
            response = await connection("carousel")
            .where({ id: element.id })
            .update({position: element.position});
        });
  
          resolve(response);
        } catch (error) {
          console.error(error);
          reject(error);
        }
  });
},

  getCarousel() {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await connection("carousel").select("*");
        resolve(response);
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  },

  deleteCarousel(product_id) {
    return new Promise(async (resolve, reject) => {
      try {
        const item = await connection("carousel")
          .select("image_id", "id")
          .where({ id: product_id })
          .first();

        const response = await connection("carousel")
          .where({ id: product_id })
          .delete();

        const all = await connection("carousel").select("*");

        const updateFields = all.map(async (x) => {
          console.log(x.id);
          console.log(item.id);
          if (item.id < x.id) {
            const position = (x.position) - 1;
            console.log("posição");
            console.log(position);
            const update = await connection("carousel")
              .where({ id: x.id })
              .update("position",position);
            console.log(update);
          }
        });

        resolve(item);
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  },
};
