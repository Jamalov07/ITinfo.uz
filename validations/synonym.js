const Joi = require("joi");

const Synonymschema = Joi.object({
  desc_id: Joi.string().alphanum().length(24).required(),
  dict_id: Joi.string().alphanum().length(24).required(),
});

module.exports = Synonymschema;
