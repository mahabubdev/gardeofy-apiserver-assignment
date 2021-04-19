const Joi = require('joi');

const loginInpSchema = Joi.object().keys({
    email: Joi.string()
            .trim()
            .email({ minDomainSegments: 2 })
            .min(10).max(32)
            .required(),

    password: Joi.string()
            .trim()
            .min(6).max(16)
            .pattern(new RegExp('^[a-zA-Z0-9&%$_]{6,16}$'))
});

module.exports = (inputs) => {
    let validate = loginInpSchema.validate(inputs);
    return validate;
}