const { Segments, Joi } = require('celebrate');

let orderValidate = new Object();

orderValidate.create = {
    [Segments.BODY]: Joi.object().keys({
        products: Joi.array().items(Joi.object().keys({
            product_id: Joi.number().integer().min(0).required(),
            product_quantity: Joi.number().integer().min(1).required(),
            subproduct_id: Joi.number().integer().min(0).optional(),
        }))
            .min(1)
            .unique((a, b) => a.product_id === b.product_id && a.subproduct_id === b.subproduct_id)
            .required(),
        paymentType: Joi.string().required(),
        trackprice: Joi.number().required(),
        tracktype: Joi.string().required(),
    })
}

orderValidate.index = {
    [Segments.QUERY]: Joi.object().keys({
        byid: Joi.number().integer().optional(),
        page: Joi.number().integer().min(1).optional(),
        byStatus: Joi.string().valid('pending', 'paid', 'mailed','delivered').optional()
    }),
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().integer().min(0).optional(),
    })
}

orderValidate.update = {
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().integer().min(0).required(),
    }),
    [Segments.BODY]: Joi.object().keys({
        payment_type: Joi.string().optional(),
        order_status: Joi.string().valid('pending', 'paid', 'mailed','delivered').optional(),
        track_number: Joi.string().optional()
    })
}

orderValidate.delete = {
    [Segments.PARAMS]: Joi.object().keys({
        order_id: Joi.number().integer().min(0).required(),
    })
}



module.exports = orderValidate;  