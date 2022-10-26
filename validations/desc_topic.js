const Joi = require("joi");

exports.desc_topicValidation = (data) => {
  const schema = Joi.object({
    desc_id: Joi.string().alphanum().length(24).required(),
    topic_id: Joi.string().alphanum().length(24).required(),
  });
  return schema.validate(data);
};
