const { Segments, Joi } = require('celebrate');

let orderValidate = new Object();

orderValidate.createMock = {
    [Segments.BODY]: Joi.object().keys({
        order_number: Joi.string().required(),
        shipping_name: Joi.string().required(),
        shipping_price: Joi.number().required(),
        payment_method_type: Joi.string().required(),
    }).unknown(true)
}

orderValidate.getMock = {
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().required()
    })
}

orderValidate.create = {
    [Segments.BODY]: Joi.object().keys({
        id: Joi.string().required(),
        products: Joi.array().items(Joi.object().keys({
            product_id: Joi.string().required(),
            product_quantity: Joi.number().integer().min(1).required(),
            subproduct_id: Joi.string().optional(),
        }))
            .min(1)
            .unique((a, b) => a.product_id === b.product_id && a.subproduct_id === b.subproduct_id)
            .required(),
        payment_type: Joi.string().required(),
        track_price: Joi.number().required(),
        track_type: Joi.string().required(),
        address_id: Joi.string().required(),
        delivery_time: Joi.number().integer().min(1).required()
    }),

}

orderValidate.index = {
    [Segments.QUERY]: Joi.object().keys({
        byid: Joi.string().optional(),
        page: Joi.number().integer().min(1).optional(),
        byStatus: Joi.string().valid('pending', 'paid', 'mailed', 'delivered', 'cancelled').optional()
    }),
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().optional(),
    })
}

orderValidate.getOne = {
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().optional()
    }),
    [Segments.QUERY]: Joi.object().keys({
        order_id: Joi.string().required()
    })
}

orderValidate.changeStatus = {
    [Segments.BODY]: Joi.object().keys({
        checkout_cielo_order_number: Joi.string().required(),
        amount: Joi.string().required(),
        order_number: Joi.string().required(),
        payment_status: Joi.string().required(),
        test_transaction: Joi.string().optional(),
        brand: Joi.string().required(),
        nsu: Joi.string().required()
    })
}

orderValidate.update = {
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().required(),
    }),
    [Segments.BODY]: Joi.object().keys({
        payment_type: Joi.string().optional(),
        order_status: Joi.string().valid('pending', 'paid', 'mailed', 'delivered', 'cancelled').optional(),
        track_number: Joi.string().allow("").optional()
    })
}

orderValidate.delete = {
    [Segments.PARAMS]: Joi.object().keys({
        order_id: Joi.string().required(),
    })
}


module.exports = orderValidate;  