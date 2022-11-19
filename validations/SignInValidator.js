const Joi = require("joi");

const SignInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().alphanum().required(),
});

module.exports = SignInSchema;
