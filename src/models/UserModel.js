const connection = require("../database/connection");
const FirebaseModel = require("./FirebaseModel");

module.exports = {
    getUsers(query) { //FirebaseModel.getUserEmails only works if there are less than 100 users in the system.
        return new Promise(async (resolve, reject) => {
            try {
                let users = await connection("users")
                    .where(query)
                    .select("*");
                const userIds = users.map((user) => { return {uid: user.firebase} });
                const userObj = await FirebaseModel.getUserEmails(userIds);

                users = users.map((user, index) => {
                    //Only works if FirebaseModel.getUserEmails returns users in the exact order of the ids.
                    return ({...user, email: userObj[index].email})
                })

                resolve(users);
            } catch (error) {
                console.log(error);
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

                const userObj = await FirebaseModel.getUserEmails([{uid: uid}]);
                const email = userObj[0].email;
                user = { ...user, email: email };
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
                const userObj = await FirebaseModel.getUserEmails([{uid: user.firebase}]);
                const email = userObj[0].email
                user = { ...user, email: email };
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