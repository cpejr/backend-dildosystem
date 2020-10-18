const { Segments, Joi } = require('celebrate');

let userValidate = new Object();

userValidate.create = {
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().min(6).required(),
        type: Joi.string().valid("retailer", "wholesaler").required(),
        cpf: Joi.string().required(),
        birthdate: Joi.string().optional(),
        phonenumber: Joi.string().optional(),
    })
}

userValidate.index = {
    [Segments.QUERY]: Joi.object().keys({
        user_status: Joi.string().valid('pending', 'approved', 'refused').optional(),
    })
}

userValidate.getOne = {
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().optional(),
    })
}

userValidate.update = {
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().required(),
    }),

    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().optional(),
        email: Joi.string().optional(),
        password: Joi.string().min(6).optional(),
        type: Joi.string().valid("retailer", "wholesaler").optional(),
        cpf: Joi.string().optional(),
        birthdate: Joi.string().optional(),
        phonenumber: Joi.string().optional(),
        user_status: Joi.string().valid('pending', 'approved', 'refused').optional(),
    })
    
}

userValidate.delete = {
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().required(),
    })
}

userValidate.forgottenPassword = {
    [Segments.BODY]: Joi.object().keys({
        email: Joi.string().required(),
    })
}

userValidate.wishList = {
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().required(),
    })
}

userValidate.wishListDelete = {
    [Segments.BODY]: Joi.object().keys({
        user_id: Joi.string().required(),
        product_id: Joi.string().required()
    })
}

userValidate.userAddress = {
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().required(),
    })
}

userValidate.userAddressDelete = {
    [Segments.BODY]: Joi.object().keys({
        user_id: Joi.string().required(),
        address_id: Joi.string().required()
    })
}

module.exports = userValidate;      