const connection = require("../database/connection");

module.exports = {
  createBanner(newBanner) {
    return new Promise(async (resolve, reject) => {
      try {
        let quant;
        if(process.env.NODE_ENV == "production"){
          quant = await connection("banner").count("position").first();
           quant = parseInt(quant.count) + 1;
        }else{
          quant = await connection("banner").count("*").first();
          quant = parseInt(quant["count(*)"]) + 1;
        }
        newBanner.position = quant;
        const response = await connection("banner").insert(newBanner);
        resolve(response);
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  },

  updateBanner(info) {
    return new Promise(async (resolve, reject) => {
      let response;
        try {
          info.forEach(async element => { 
            response = await connection("banner")
            .where({ id: element.id })
            .update({position: element.position})
            .update({link: element.link});
        });  
          resolve(response);
        } catch (error) {
          console.error(error);
          reject(error);
        }
  });
},

  getBanner() {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await connection("banner").select("*");
        resolve(response);
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  },

  deleteBanner(banner_id) {
    return new Promise(async (resolve, reject) => {
      try {
        const item = await connection("banner")
          .select("image_id", "id")
          .where({ id: banner_id })
          .first();

        const response = await connection("banner")
          .where({ id: banner_id })
          .delete();

        const all = await connection("banner").select("*");

        const updateFields = all.map(async (x) => {
          //console.log(x.id);
         // console.log(item.id);
          if (item.id < x.id) {
            const position = (x.position) - 1;
            //console.log("posição");
            //console.log(position);
            const update = await connection("banner")
              .where({ id: x.id })
              .update("position",position);
            //console.log(update);
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
