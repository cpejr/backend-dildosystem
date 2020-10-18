const { Segments, Joi } = require('celebrate');

let addressValidate = new Object();

addressValidate.create = {
    [Segments.BODY]: Joi.object().keys({
        zipcode: Joi.string().optional(),
        state: Joi.string().optional(),
        city: Joi.string().optional(),
        neighborhood: Joi.string().optional(),
        street: Joi.string().optional(),
        number: Joi.string().optional(),
        complement: Joi.string().optional(),
    })
}

addressValidate.getOne = {
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().optional(),
    })
}

addressValidate.update = {
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().required(),
    }),

    [Segments.BODY]: Joi.object().keys({
        zipcode: Joi.string().optional(),
        state: Joi.string().optional(),
        city: Joi.string().optional(),
        neighborhood: Joi.string().optional(),
        street: Joi.string().optional(),
        number: Joi.string().optional(),
        complement: Joi.string().optional(),
    })
    
}

addressValidate.delete = {
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().required(),
    })
}

module.exports = addressValidate;      