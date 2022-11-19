const express = require("express");
const Category = require("../controllers/category.controller");
const Description = require("../controllers/description.cotroller");
const Dictionary = require("../controllers/dictionary.controller");
const { ForgotPassAndSendNew } = require("../controllers/ifForgotPass");
const Question_answer = require("../controllers/question_answer.controller");
const Synonym = require("../controllers/synonym.controller");
const Topic = require("../controllers/topic.controller");
const User = require("../controllers/user.controller");
const userEditPolice = require("../middleware/userEditPolice");
const userWorkpolice = require("../middleware/userWorkPolice");
const Validator = require("../middleware/validator");

express.application.prefix = express.Router.prefix = function (
  path,
  configure
) {
  const router = express.Router();
  this.use(path, router);
  configure(router);
  return router;
};
const router = express.Router();

router.prefix("/", (rout) => {
  rout.prefix("/", (user) => {
    user.get("/refresh", User.refreshUserToken);
    user.get("get/:id", userEditPolice, User.getUser);
    user.post("/",Validator("user"), User.addUser);
    user.put("/:id", Validator("user"), userEditPolice, User.editUser);
    user.delete("/:id", Validator("user"), userEditPolice, User.deleteUser);
    user.post("/login", Validator("SignInValidator"), User.loginUser);
    user.post("/logout", User.logOutUser);
  });
  rout.prefix("/activate", (activate) => {
    activate.get("/:link",User.userActivation);
  })
  rout.prefix("/forgot", (forgot) => { 
    forgot.post("/", ForgotPassAndSendNew);
  })
  rout.prefix("/dictionary", (dictionary) => {
    dictionary.get("/", Dictionary.getDictionarys);
    dictionary.get("/:id", Dictionary.getDictionary);
  });
  rout.prefix("/category", (category) => {
    category.get("/", Category.getCategorys);
    category.get("/:id", Category.getCategory);
  });
  rout.prefix("/topic", (topic) => {
    topic.get("/", Topic.getTopics);
    topic.get("/:id", Topic.getTopic);
  });
  rout.prefix("/description", (description) => {
    description.get("/", Description.getDescriptions);
    description.get("/:id", Description.getDescription);
  });
  rout.prefix("/synonym", (synonym) => {
    synonym.get("/", Synonym.getSynonyms);
    synonym.get("/:id", Synonym.getSynonym);
  });
  rout.prefix("/question_answer", (question_answer) => {
    question_answer.get("/", Question_answer.getQuestion_Answers);
    question_answer.get("/:id", Question_answer.getQuestion_Answer);
  });
});
module.exports = router;
