const { deleteAddress } = require("../models/AddressModel");
const AddressModel = require("../models/AddressModel");


module.exports = {
    async index(request, response) {
        try {

            const result = await AddressModel.getAddresses();

            return response.status(200).json(result);

        } catch (err) {
            console.err(err);
            return response.status(500).json({ notification: "Internal error while trying to get addresses" })
        }
    },

    async getOne(request, response) {
        try {
            const { id } = request.params;
            const address = await AddressModel.getAddressById(id);
            return response.json(address);
        } catch (err) {
            if (err.errno === 19)
                return response.status(400).json({ notification: "Invalid ids" });

            console.err(err);
            return response.status(500).json({ notification: "Internal server error while trying to get the address" });
        }
    },

    async createAddress(request, response) {
        try {
            const newAddress = request.body;

            await AddressModel.createNewAddress(newAddress, request.session.user.id);

            response.status(200).json({ id: newAddress.id });
        } catch (err) {
            if (err.errno === 19)
                return response.status(400).json({ notification: "Invalid ids" });

            console.err(err);
            return response.status(500).json({ notification: "Internal server error while trying to register the new address" });
        }
    },

    async updateAddress(request, response) {
        try {
            const { id } = request.params;
            const newAddress = request.body;

            await AddressModel.updateAddress(newAddress, id);

            response.status(200).json({ message: "Sucesso!" });
        } catch (err) {
            console.err(err);
            return response.status(500).json({ notification: "Internal server error while trying to update address" });
        }
    },

    async deleteAddress(request, response) {
        try {
            const { id } = request.params;

            await AddressModel.deleteAddress(id);

            response.status(200).json({ message: "Sucesso!" });
        } catch (err) {
            console.err(err);
            return response.status(500).json({ notification: "Internal server error while trying to delete address" });
        }
    },
};
