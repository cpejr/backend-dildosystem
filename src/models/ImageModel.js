const connection = require("../database/connection");

module.exports = {

    async createImage(image_id, product_id, subproduct_id = null) {
        try {
            let existing;
            if (subproduct_id === null){
                existing = await connection('images').where({product_id: product_id});
            } else {
                existing = await connection('images')
            }
            const image = { image_id, product_id, subproduct_id, index: existing ? existing.lenght : 0};
            await connection('images').insert(image);
        } catch (error) {
            console.log(error);
        }
    },

    async createImages(images) {
        try {

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