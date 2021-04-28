const connection = require("../database/connection");
// const { uploadFile, deleteFile } = require('./GoogleDriveModel');
const { uploadAWS, deleteAWS } = require('../models/AWSModel')

module.exports = {

    async createImages(images, product_id, subproduct_id = null) {
        try {
            let existing;
            if (subproduct_id === null) {
                existing = await connection('images').where({ product_id: product_id, subproduct_id: null }).count("id").first();
            } else {
                existing = await connection('images').where({ subproduct_id: subproduct_id }).count("id").first();
            }

            const imageArray = images.map((imageData) => {
                const { originalname, buffer, mimetype } = imageData;
                let image;
                if (process.env.NODE_ENV == "production") {
                    existing.count = parseInt(existing.count);
                    existing.count = existing.count + 1;
                    image = { product_id, subproduct_id, index: existing ? existing.count : 0 };
                } else {
                    image = { product_id, subproduct_id, index: existing ? existing["count(`id`)"] : 0 };
                    existing["count(`id`)"] += 1;
                }

                return new Promise((resolve, reject) => {
                    uploadAWS(imageData).then((image_id) => {
                        image.id = image_id.key;
                        resolve(image);
                    }).catch((error) => {
                        console.error(error);
                        reject(error);
                    })
                })
            })

            let result = await Promise.all(imageArray);

            await connection('images').insert(result);

        } catch (error) {
            console.error(error);
        }
    },

    async deleteImage(product_id) {
        try {
            const resultSearch = await connection('images').where('product_id', product_id).select('*')
            console.log('resultado da busca no banco: ', resultSearch)
            const result = resultSearch.map((img) => {
                return new Promise(async (resolve, reject) => {
                    const resultDel = await connection('images').where('id', img.id).del()
                    await deleteAWS(img.id);
                    resolve(resultDel)
                })
            })
            // await connection('images').where({ id: product_id }).delete();
        } catch (error) {
            console.error(error);
        }
    }

};