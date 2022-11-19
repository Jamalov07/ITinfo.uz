const Joi = require("joi");

const Question_answerSchema = Joi.object({
  question: Joi.string().min(10).max(100).required(),
  answer: Joi.string().min(10).max(100).required(),
  is_checked: Joi.boolean().default(false),
  expert_id: Joi.string().alphanum().length(24).required(),
});

module.exports = Question_answerSchema;