const connection = require("../database/connection");

module.exports = {
    createNewCategory(category) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await connection("categories").insert(category);
                resolve(response);
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });
    },

    createNewSubcategory(subcategory) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await connection("subcategories").insert(subcategory);
                resolve(response);
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });
    },

    updateCategory(category, category_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await connection("categories")
                    .where({ id: category_id })
                    .update(category);
                resolve(response);
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });
    },

    updateSubcategory(subcategory, subcategory_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await connection("subcategories")
                    .where({ id: subcategory_id })
                    .update(subcategory);
                resolve(response);
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });
    },

    deleteCategory(category_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await connection("categories")
                    .where({ id: category_id })
                    .del();
                resolve(response);
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });
    },

    deleteSubcategory(subcategory_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await connection("subcategories")
                    .where({ id: subcategory_id })
                    .del();
                resolve(response);
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });
    },
}