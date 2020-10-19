const connection = require("../database/connection");
const FirebaseModel = require("./FirebaseModel");

module.exports = {
    getAddresses() {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await connection("address").select("*");
                resolve(response);
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });
    },

    getAddressById(id) {
        return new Promise(async (resolve, reject) => {
            try {
                let address = await connection("address")
                    .where("id", id)
                    .select("*")
                    .first();
                resolve(address);
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });
    },

    createNewAddress(address) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await connection("address").insert(address);
                resolve(response);
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });
    },

    deleteAddress(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await connection("address")
                    .where({ id: id })
                    .delete();
                resolve(response);
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });
    },

    updateAddress(address, address_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await connection("address")
                    .where({ id: address_id })
                    .update(address);
                resolve(response);
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });
    },
}