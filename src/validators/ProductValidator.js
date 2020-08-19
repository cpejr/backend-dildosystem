const { Segments, Joi } = require('celebrate');

let productValidate = new Object();

productValidate.create = {
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        client_price: Joi.number().min(0).required(),
        client_sale_price: Joi.number().min(0).optional(),
        wholesaler_price: Joi.number().min(0).required(),
        wholesaler_sale_price: Joi.number().min(0).optional(),
        on_sale_client: Joi.boolean().optional(),
        on_sale_wholesaler: Joi.boolean().optional(),
        featured: Joi.boolean().optional(),
        description: Joi.string().required(),
        visible: Joi.boolean().optional(),
        stock_quantity: Joi.number().required(),
        min_stock: Joi.number().required(),
        subcategory_id: Joi.number().integer().min(0).required(),
        weight: Joi.number().min(0).max(300000), //validar
        height: Joi.number().min(0),
        width: Joi.number().min(0),
        length: Joi.number().min(0),
    })
}


productValidate.update = {
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required(),
    }),
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().optional(),
        client_price: Joi.number().min(0).optional(),
        client_sale_price: Joi.number().min(0).optional(),
        wholesaler_price: Joi.number().min(0).optional(),
        wholesaler_sale_price: Joi.number().min(0).optional(),
        on_sale_client: Joi.boolean().optional(),
        on_sale_wholesaler: Joi.boolean().optional(),
        featured: Joi.boolean().optional(),
        description: Joi.string().optional(),
        visible: Joi.boolean().optional(),
        stock_quantity: Joi.number().optional(),
        min_stock: Joi.number().optional(),
        subcategory_id: Joi.number().integer().min(0).optional(),
        weight: Joi.number().min(0).max(300000).optional(), //validar
        height: Joi.number().min(0).optional(),
        width: Joi.number().min(0).optional(),
        length: Joi.number().min(0).optional(),
    })
}

productValidate.index = {
    [Segments.QUERY]: Joi.object().keys({
        name: Joi.string().optional(),
        client_price: Joi.number().min(0).optional(),
        client_sale_price: Joi.number().min(0).optional(),
        wholesaler_price: Joi.number().min(0).optional(),
        wholesaler_sale_price: Joi.number().min(0).optional(),
        on_sale_client: Joi.boolean().optional(),
        on_sale_wholesaler: Joi.boolean().optional(),
        featured: Joi.boolean().optional(),
        description: Joi.string().optional(),
        visible: Joi.boolean().optional(),
        stock_quantity: Joi.number().optional(),
        min_stock: Joi.number().optional(),
        subcategory_id: Joi.number().integer().min(0).optional(),
        max_price: Joi.number().min(0).optional(),
        min_price: Joi.number().min(0).optional(),
        order_by: Joi.string().valid('price'),
        order_ascending: Joi.boolean().optional(),
        page: Joi.number().integer().min(1).optional(),
        search: Joi.string().optional()
    })
}


productValidate.getProduct = {
    [Segments.PARAMS]: Joi.object().keys({
        product_id: Joi.number().required(),
    })
}

productValidate.delete = {
    [Segments.PARAMS]: Joi.object().keys({
        product_id: Joi.number().integer().min(0).required(),
    })
}

module.exports = productValidate;  