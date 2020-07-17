const { Segments, Joi } = require('celebrate');

let loginValidate = new Object();

loginValidate.signin = {
    [Segments.BODY]: Joi.object().keys({
        email: Joi.string().required(),
        password: Joi.string().min(6).required(),
    })
}

module.exports = loginValidate;  