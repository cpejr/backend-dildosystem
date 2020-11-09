const { Segments, Joi } = require('celebrate');

let CarouselValidate = new Object();

CarouselValidate.updateCarousel = {
    [Segments.BODY]: Joi.object().keys({
        info: Joi.array().items(Joi.object().keys({
            id: Joi.string().optional(),
            image_id: Joi.string().optional(),
            position: Joi.number().integer().min(1).optional(),
        }))
    })
},

    CarouselValidate.deleteCarousel = {
        [Segments.PARAMS]: Joi.object().keys({
            id: Joi.string().required(),
        })
    }


module.exports = CarouselValidate;      