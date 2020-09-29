const { Segments, Joi } = require('celebrate');

let categoryValidate = new Object();

categoryValidate.createCategory = {
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
    })
}

categoryValidate.createSubcategory = {
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        category_id: Joi.string().required(),
    })
}

categoryValidate.updateCategory = {
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().required(),
    }),
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().optional(),
    })
}

categoryValidate.updateSubcategory = {
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().required(),
    }),
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().optional(),
        category_id: Joi.string().optional(),
    })
}

categoryValidate.deleteCategory = {
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().required(),
    }),
}

categoryValidate.deleteSubcategory = {
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().required(),
    }),
}


module.exports = categoryValidate;      