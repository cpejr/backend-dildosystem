const connection = require("../database/connection");
const FirebaseModel = require("./FirebaseModel");

module.exports = {
    getUsers(query) { //FirebaseModel.getUserEmails only works if there are less than 100 users in the system.
        return new Promise(async (resolve, reject) => {
            try {
                let users = await connection("users")
                    .where(query)
                    .select("*");

                resolve(users);
            } catch (error) {
                console.error(error);
                reject(error);
            }
        });
    },

    getUserByUid(uid) {
        return new Promise(async (resolve, reject) => {
            try {
                let user = await connection("users")
                    .where("firebase", uid)
                    .select("*")
                    .first();

                resolve(user);
            } catch (error) {
                console.error(error);
                reject(error);
            }
        });
    },

    getUserById(id) {
        return new Promise(async (resolve, reject) => {
            try {
                let user = await connection("users")
                    .where("id", id)
                    .select("*")
                    .first();
                resolve(user);
            } catch (error) {
                console.error(error);
                reject(error);
            }
        });
    },

    deleteUser(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await connection("users")
                    .where({ id: id })
                    .delete();
                resolve(response);
            } catch (error) {
                console.error(error);
                reject(error);
            }
        });
    },

    updateUser(user, user_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await connection("users")
                    .where({ id: user_id })
                    .update(user);
                resolve(response);
            } catch (error) {
                console.error(error);
                reject(error);
            }
        });
    },

    getWish(id) {
        return new Promise(async (resolve, reject) => {
            try {
                let user = await connection("wishlist")
                    .where({ user_id: id })
                    .join("products", "wishlist.product_id", '=', 'products.id')
                    .select('*');
                    
                resolve(user);
            } catch (error) {
                console.error(error);
                reject(error);
            }
        });
    },

    createNewWish(wish) {
        return new Promise(async (resolve, reject) => {
            try {
                let user = await connection("wishlist")
                    .insert(wish)

                resolve(user);
            } catch (error) {
                console.error(error);
                reject(error);
            }
        });
    },

    deleteWish(product_id, user_id) {
        return new Promise(async (resolve, reject) => {
            try {
                let user = await connection("wishlist")
                    .where({ 
                        user_id,
                        product_id
                    })
                    .delete();

                resolve(user);
            } catch (error) {
                console.error(error);
                reject(error)
            }
        });

    },

    getUserAddress(id) {
        return new Promise(async (resolve, reject) => {
            try {
                let user_address = await connection("users_address")
                    .where({ user_id: id })
                    .join("address", "users_address.address_id", '=', 'address.id')
                    .select('*');
                    
                resolve(user_address);
            } catch (error) {
                console.error(error);
                reject(error);
            }
        });
    },

    createNewUserAddress(user_address) {
        return new Promise(async (resolve, reject) => {
            try {
                let user = await connection("users_address")
                    .insert(user_address)

                resolve(user);
            } catch (error) {
                console.error(error);
                reject(error);
            }
        });
    },

    deleteUserAddress(user_id, address_id) {
        return new Promise(async (resolve, reject) => {
            try {
                let user = await connection("users_address")
                    .where({ 
                        user_id,
                        address_id
                    })
                    .delete();
                resolve(user);
            } catch (error) {
                console.error(error);
                reject(error)
            }
        });

    }

}