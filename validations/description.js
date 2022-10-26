const Joi = require("joi");

exports.descriptionValidation = (data) => {
  const schema = Joi.object({
    category_id: Joi.string().alphanum().length(24),
    description: Joi.string().min(5).max(255).required(),
  });
    return schema.validate(data);
};

