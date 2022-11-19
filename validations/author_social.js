const Joi = require("joi");

const author_socialSchema = Joi.object({
  author_id: Joi.string().alphanum().length(24).required(),
  social_id: Joi.string().alphanum().length(24).required(),
  social_link: Joi.string().min(8).required(),
});

module.exports = author_socialSchema;