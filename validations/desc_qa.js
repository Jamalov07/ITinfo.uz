const Joi = require("joi");

exports.desc_qaValidation = (data) => {
  const schema = Joi.object({
    qa_id: Joi.string().alphanum().length(24).required(),
    desc_id: Joi.string().alphanum().length(24).required(),
  });
  return schema.validate(data);
};
