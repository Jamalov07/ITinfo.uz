const Joi = require("joi");

const Desc_topicSchema = Joi.object({
  desc_id: Joi.string().alphanum().length(24).required(),
  topic_id: Joi.string().alphanum().length(24).required(),
});

module.exports = Desc_topicSchema;