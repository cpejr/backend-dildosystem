const connection = require("../database/connection");
const FirebaseModel = require("./FirebaseModel");

module.exports = {
    getUsers(query) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await connection("users")
                    .where(query)
                    .select("*");
                resolve(user);
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });
    },

    getUserByUid(uid) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await connection("users")
                    .where("firebase", uid)
                    .select("*")
                    .first();

                const email = await FirebaseModel.getUserEmail(uid);
                user = { ...user, email };
                resolve(user);
            } catch (error) {
                console.log(error);
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
                const email = await FirebaseModel.getUserEmail(user.firebase);
                user = { ...user, email };
                resolve(user);
            } catch (error) {
                console.log(error);
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
                console.log(error);
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
                console.log(error);
                reject(error);
            }
        });
    },

}