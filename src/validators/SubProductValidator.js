const { Segments, Joi } = require('celebrate');

let subProductValidate = new Object();

subProductValidate.create = {
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string().required(),
        visible: Joi.boolean().optional(),
        stock_quantity: Joi.number().required(),
        min_stock: Joi.number().required(),
        product_id: Joi.string().required(),
    })
}

subProductValidate.getSubproducts = {
    [Segments.PARAMS]: Joi.object().keys({
        product_id: Joi.string().required(),
    })
}

subProductValidate.update = {
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().required(),
    }),
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().optional(),
        description: Joi.string().optional(),
        visible: Joi.boolean().optional(),
        stock_quantity: Joi.number().optional(),
        min_stock: Joi.number().optional(),
        subcategory_id: Joi.string().optional(),
        product_id: Joi.string().optional(),
        weight: Joi.number().min(0).max(300000).optional(), //validar
        height: Joi.number().min(0).optional(),
        width: Joi.number().min(0).optional(),
        length: Joi.number().min(0).optional(),
    })
}


subProductValidate.delete = {
    [Segments.PARAMS]: Joi.object().keys({
        product_id: Joi.string().required(),
    })
}



module.exports = subProductValidate;      