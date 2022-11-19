const Joi = require("joi");

const Desc_qaSchema = Joi.object({
  qa_id: Joi.string().alphanum().length(24).required(),
  desc_id: Joi.string().alphanum().length(24).required(),
});

module.exports = Desc_qaSchema;