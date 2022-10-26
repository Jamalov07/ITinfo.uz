const Joi = require("joi");

exports.author_socialValidation = (data) => {
  const schema = Joi.object({
    author_id: Joi.string().alphanum().length(24).required(),
    social_id: Joi.string().alphanum().length(24).required(),
    social_link: Joi.string().min(8).required(),
  });
    return schema.validate(data)
};
