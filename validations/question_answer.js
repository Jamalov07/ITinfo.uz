const Joi = require("joi");

exports.question_answerValidation = (data) => {
  const schema = Joi.object({
    question: Joi.string().min(10).max(100).required(),
    answer: Joi.string().min(10).max(100).required(),
    is_checked: Joi.boolean().default(false),
    expert_id: Joi.string().alphanum().length(24).required(),
  });
  return schema.validate(data);
};
