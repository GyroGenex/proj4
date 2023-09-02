const Joi = require('joi');

const validators = {

    registerSchema: Joi.object({
        first_name: Joi.string().min(3).max(100).required(),
        last_name: Joi.string().min(3).max(100).required(),
        email: Joi.string().min(3).required(),
        password: Joi.string().required(),
        role: Joi.string().required()
    }),

    loginSchema: Joi.object({
        id: Joi.string().required(),
        password: Joi.string().required(),
    })

};

module.exports = validators;
