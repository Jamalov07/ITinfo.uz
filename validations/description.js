const Joi = require("joi");

const DescriptionSchema = Joi.object({
  category_id: Joi.string().alphanum().length(24),
  description: Joi.string().min(5).max(255).required(),
});

module.exports = DescriptionSchema;