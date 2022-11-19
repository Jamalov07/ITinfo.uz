const Joi = require("joi");
const PhoneSchema = Joi.object({
  login: Joi.string()
    .max(17)
    .pattern(/\d{2}-\d{3}-\d{2}-\d{2}/),
});

module.exports = PhoneSchema;
