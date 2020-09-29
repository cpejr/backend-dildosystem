const { Segments, Joi } = require('celebrate');

let CarouselValidate = new Object();

CarouselValidate.updateCarousel = {
    [Segments.BODY]: Joi.object().keys({
        position: Joi.number().integer().min(1).optional(),
    }),
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().required(),
    })
}

CarouselValidate.deleteCarousel = {
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().required(),
    })
}


module.exports = CarouselValidate;      