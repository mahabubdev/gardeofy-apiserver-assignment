const Joi = require('joi');

const serviceInputs = Joi.object().keys({
    description: Joi.string()
            .trim()
            .min(20).max(255)
            .required(),

    name: Joi.string().trim()
            .min(10).max(32)
            .required()
});

module.exports = (inputs) => {
    let validate = serviceInputs.validate(inputs);
    return validate;
}