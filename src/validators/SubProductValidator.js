const { Segments, Joi } = require('celebrate');

let subProductValidate = new Object();

subProductValidate.create = {
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string().required(),
        visible: Joi.boolean().optional(),
        stock_quantity: Joi.number().required(),
        min_stock: Joi.number().required(),
        product_id: Joi.number().required(),
    })
}

subProductValidate.getSubproducts = {
    [Segments.PARAMS]: Joi.object().keys({
        product_id: Joi.number().required(),
    })
}

subProductValidate.delete = {
    [Segments.PARAMS]: Joi.object().keys({
        product_id: Joi.number().integer().min(0).required(),
    })
}



module.exports = subProductValidate;      