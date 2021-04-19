const Joi = require('joi');
const regInpSchema = Joi.object().keys({
        name: Joi.string()
            .trim()
            // .pattern(new RegExp('^\S[A-Z]\s[a-zA-Z]\S$'))
            .min(6).max(32)
            .required(),

        email: Joi.string()
            .trim()
            .email({ minDomainSegments: 2 })
            .min(10).max(32)
            .required(),

        photo: Joi.string().trim(),

        password: Joi.string()
            .trim()
            .min(6).max(16)
            .pattern(new RegExp('^[a-zA-Z0-9&%$_]{6,16}$')),

        c_password: Joi.ref('password'),
});

module.exports = (inputs) => {
    let validate = regInpSchema.validate(inputs);
    return validate;
}