const connection = require('../database/connection');

module.exports = {
    getUserByUid(uid) {
        return new Promise(async(resolve,reject)=>{
            try {
                const user = await connection("users").where("firebase", uid).select("*").first();
                resolve(user);
            } catch (error) {
                console.log(error);
                reject(error);
            } 
        });
    }
}