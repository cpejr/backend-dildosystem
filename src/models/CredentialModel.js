const connection = require("../database/connection");

module.exports = {
    getCredentials() {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await connection("credentials").select("*").first();
                resolve(response);
            } catch (error) {
                console.err(error);
                reject(error);
            }
        });
    },

    updateCredentials(credentials) {
        return new Promise(async (resolve, reject) => {
            try {
                const token = await connection("credentials").first();

                if (!token) {
                    createCredentials(credentials);
                }

                const response = await connection("credentials")
                    .first()
                    .update(credentials);
                resolve(response);
            } catch (error) {
                console.err(error);
                reject(error);
            }
        });
    },

    createCredentials: createCredentials,
}

function createCredentials(credentials) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await connection("credentials").insert(credentials);
            resolve(response);
        } catch (error) {
            console.err(error);
            reject(error);
        }
    });
}
