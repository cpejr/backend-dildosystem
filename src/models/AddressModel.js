const connection = require("../database/connection");
const FirebaseModel = require("./FirebaseModel");
const { v1: uuidv1 } = require('uuid');

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

    createNewAddress(address, userId) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await connection("address").insert(address);

                const user_address_relation = {
                    id: uuidv1(),
                    user_id: userId,
                    address_id: address.id
                }

                await connection("users_address").insert(user_address_relation)
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