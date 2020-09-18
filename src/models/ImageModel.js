const connection = require("../database/connection");
const { uploadFile, deleteFile } = require('./GoogleDriveModel');

module.exports = {

    async createImages(images, product_id, subproduct_id = null) {
        try {
            let existing;
            if (subproduct_id === null) {
                existing = await connection('images').where({ product_id: product_id }).count("id").first();
            } else {
                existing = await connection('images').where({ subproduct_id: subproduct_id });
            }

            const imageArray = images.map((imageData) => {
                const { originalname, buffer, mimetype } = imageData;
                let image = { product_id, subproduct_id, index: existing ? existing["count(`id`)"] : 0 };
                existing["count(`id`)"] += 1;
                return new Promise((resolve, reject) => {
                    uploadFile(buffer, originalname, mimetype).then((image_id) => {
                        image.id = image_id;
                        resolve(image);
                    }).catch((error) => {
                        console.log(error);
                        reject(error);
                    })
                })
            })

            let result = [];
            
            for(let i = 0; i < imageArray.length; i++){
                const resu = await imageArray[i];
                result.push(resu);
            }

            await connection('images').insert(result);

        } catch (error) {
            console.log(error);
        }
    },

    async deleteImage(image_id) {
        try {
            await connection('images').where({ id: image_id }).delete();
            await deleteFile(image_id);
        } catch (error) {
            console.log(error);
        }
    }

};