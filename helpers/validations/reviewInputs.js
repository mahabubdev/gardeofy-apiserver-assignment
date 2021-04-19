const Joi = require('joi');

const reviewInputs = Joi.object().keys({
    description: Joi.string()
            .trim()
            .min(20).max(255)
            .required(),

    uid: Joi.string()
});

module.exports = (inputs) => {
    let validate = reviewInputs.validate(inputs);
    return validate;
}