const Joi = require("joi");

const userValidate = data =>{
    const userSchema = Joi.object({
        ...data,
        name: Joi.string()
        .min(3)
        .max(50),
        email: Joi.string().email().required(),
        password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    })

    return userSchema.validate(data);
}

module.exports = {
    userValidate
}