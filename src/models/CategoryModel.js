const connection = require("../database/connection");
const { resolve } = require("path");

module.exports = {
    createNewCategory(category) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await connection("categories").insert(category);
                resolve(response);
            } catch (error) {
                console.err(error);
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
                console.err(error);
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
                console.err(error);
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
                console.err(error);
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
                console.err(error);
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
                console.err(error);
                reject(error);
            }
        });
    },

    getCategories() {

        return new Promise(async (resolve, reject) => {
            try {

                const promises = [connection("categories").select('*'), connection("subcategories").select('*')];

                const result = await Promise.all(promises);



                const categories = result[0].map((category) => {
                    let fullCat = { ...category, subcategories: [] };
                    
                    result[1].forEach(subcat => {
                        if (subcat.category_id === category.id) {
                            delete subcat.category_id;
                            fullCat.subcategories.push(subcat);
                        }
                    })
                    return fullCat;
                });
                
                resolve(categories);

            } catch (error) {
                console.err(error);
                reject(error);
            }
        });
    }
}