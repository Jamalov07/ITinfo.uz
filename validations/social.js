const Joi = require("joi");

exports.socialvalidation = (data) => {
  const schema = Joi.object({
    social_name: Joi.string().max(20).required(),
    social_icon_file: Joi.string().required(),
  });
    return schema.validate(data);
};
