const Joi = require("joi");

const MediaSchema = Joi.object({
  media_name: Joi.string().min(2).max(100).required(),
  media_file: Joi.string(),
  target_table_name: Joi.string().min(4).max(20).required(),
  target_table_id: Joi.string().alphanum().length(24).required(),
});

module.exports = MediaSchema;
