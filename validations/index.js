const admin = require("./admin");
const user = require("./user");
const author = require("./author");
const author_social = require("./author_social");
const category = require("./category");
const desc_qa = require("./desc_qa");
const desc_topic = require("./desc_topic");
const description = require("./description");
const dictionary = require("./dictionary");
const guest = require("./guest");
const media = require("./media");
const question_answer = require("./question_answer");
const social = require("./social");
const synonym = require("./synonym");
const tag = require("./tag");
const topic = require("./topic");
const SignInValidator = require("./SignInValidator");
const phoneValidator = require("./phoneValidator");

module.exports = {
  admin,
  author_social,
  author,
  category,
  desc_qa,
  desc_topic,
  description,
  dictionary,
  guest,
  media,
  question_answer,
  social,
  synonym,
  tag,
  topic,
  user,
  SignInValidator,
  phoneValidator,
};
