const Joi = require("joi");

const firstLetter = (parent, helpers) => {
  return parent.term[0].toLowerCase();
};

exports.dictionaryValidation = (data) => {
  const schema = Joi.object({
    term: Joi.string().min(2).max(20).required(),
    letter: Joi.string().default(firstLetter)
  });
    return schema.validate(data);
};
