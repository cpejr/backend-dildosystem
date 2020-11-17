const connection = require("../database/connection");
const { uploadFile, deleteFile } = require('./GoogleDriveModel');

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
                    uploadFile(buffer, originalname, mimetype).then((image_id) => {
                        image.id = image_id;
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

    async deleteImage(image_id) {
        try {
            await connection('images').where({ id: image_id }).delete();
            await deleteFile(image_id);
        } catch (error) {
            console.error(error);
        }
    }

};