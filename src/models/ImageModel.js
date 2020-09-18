const { rejects } = require("assert");
const { resolve } = require("path");
const connection = require("../database/connection");
const { uploadFile, deleteFile } = require('./GoogleDriveModel');

module.exports = {

    async createImage(image_id, product_id, subproduct_id = null) {
        try {
            let existing;
            if (subproduct_id === null) {
                existing = await connection('images').where({ product_id: product_id });
            }

            const image = { image_id, product_id, subproduct_id, index: existing ? existing.lenght : 0 };
            await connection('images').insert(image);
        } catch (error) {
            console.log(error);
        }
    },

    async createImages(images, product_id, subproduct_id = null) {
        try {
            let existing;
            if (subproduct_id === null) {
                existing = await connection('images').where({ product_id: product_id }).count("id").first();
            }

            console.log("Existing: ", existing);

            const imageArray = images.map((imageData) => {
                const { originalname, buffer, mimetype } = imageData;
                let image = { product_id, subproduct_id, index: existing ? existing["count(`id`)"] : 0 };
                existing["count(`id`)"] += 1;
                return new Promise((resolve, reject) => {
                    uploadFile(buffer, originalname, mimetype).then((image_id) => {
                        image.image_id = image_id;
                        resolve(image);
                    }).catch((error) => {
                        console.log(error);
                        reject(error);
                    })
                })
            })

            await Promise.all(imageArray);

            console.log("ImageArray: ", imageArray)
            await connection('images').insert(imageArray);

        } catch (error) {
            console.log(error);
        }
    },

    async deleteImage(image_id) {
        try {
            await connection('images').where({ id: image_id }).delete();
        } catch (error) {
            console.log(error);
        }
    }

};