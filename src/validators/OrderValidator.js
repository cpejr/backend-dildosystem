const { Segments, Joi } = require('celebrate');

let orderValidate = new Object();

orderValidate.create = {
    [Segments.BODY]: Joi.object().keys({
        products: Joi.array().items(Joi.object().keys({
            product_id: Joi.string().required(),
            product_quantity: Joi.number().integer().min(1).required(),
            subproduct_id: Joi.string().optional(),
        }))
            .min(1)
            .unique((a, b) => a.product_id === b.product_id && a.subproduct_id === b.subproduct_id)
            .required(),
        paymentType: Joi.string().required(),
        trackprice: Joi.number().required(),
        tracktype: Joi.string().required(),
        address_id: Joi.string().required()
    })
}

orderValidate.index = {
    [Segments.QUERY]: Joi.object().keys({
        byid: Joi.string().optional(),
        page: Joi.number().integer().min(1).optional(),
        byStatus: Joi.string().valid('pending', 'paid', 'mailed','delivered').optional()
    }),
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().optional(),
    })
}

orderValidate.getOne = {
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().required()
    }),
    [Segments.QUERY]: Joi.object().keys({
        order_id: Joi.string().required()
    })
}

orderValidate.update = {
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().required(),
    }),
    [Segments.BODY]: Joi.object().keys({
        payment_type: Joi.string().optional(),
        order_status: Joi.string().valid('pending', 'paid', 'mailed','delivered').optional(),
        track_number: Joi.string().allow("").optional()
    })
}

orderValidate.delete = {
    [Segments.PARAMS]: Joi.object().keys({
        order_id: Joi.string().required(),
    })
}



module.exports = orderValidate;  