const { Segments, Joi } = require('celebrate');

let CarocelValidate = new Object();

CarocelValidate.updateCarocel = {
    [Segments.BODY]: Joi.object().keys({
        position: Joi.number().integer().min(1).optional(),
    }),
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().integer().min(0).required(),
    })
}

CarocelValidate.deleteCarocel = {
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().integer().min(0).required(),
    })
}


module.exports = CarocelValidate;      