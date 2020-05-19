const DataBaseModel = require('../models/DatabaseModel');
const { uploadFile } = require('../models/GoogleDriveModel');

module.exports = {
    async create(request, response) {
        try {
            const newSubproduct = request.body;
            const { originalname, buffer, mimetype } = request.file;

            const image_id = await uploadFile(buffer, originalname, mimetype);

            newSubproduct.image_id = image_id;

            const [id] = await DataBaseModel.createNewSubproduct(newSubproduct);

            response.status(200).json({ id });
        } catch (err) {
            console.log(err);
            return response.status(500).json({ notification: "Internal server error while trying to register the new subproduct" });
        }
    },

    async getSubproducts(request, response) {
        try {
            let type = "retailer";
            if (request.session)
                type = request.session.user.type;

            let query = { visible: true };
            if (type === 'admin')
                query = {};

            const { product_id } = request.params;
            const result = await DataBaseModel.getSubproductsbyProductId(product_id, query);
            response.status(200).json(result);
        } catch (err) {
            console.log(err);
            return response.status(500).json({ notification: "Internal server error while trying to get subproducts" });
        }
    }
}