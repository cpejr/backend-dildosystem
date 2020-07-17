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
        zipcode: Joi.string().optional(),
        phonenumber: Joi.string().optional(),
        state: Joi.string().optional(),
        city: Joi.string().optional(),
        neighborhood: Joi.string().optional(),
        street: Joi.string().optional(),
        number: Joi.string().optional(),
        complement: Joi.string().optional(),
    })
}

module.exports = userValidate;      