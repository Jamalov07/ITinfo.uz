const express = require("express");
const Admin = require("../controllers/admin.controller");
const Author = require("../controllers/author.controller");
const Author_Social = require("../controllers/author_social_controller");
const Category = require("../controllers/category.controller");
const Description = require("../controllers/description.cotroller");
const Desc_QA = require("../controllers/desc_QA.controller");
const Desc_Topic = require("../controllers/desc_topic.controller");
const Dictionary = require("../controllers/dictionary.controller");
const Media = require("../controllers/media.controller");
const Question_Answer = require("../controllers/question_answer.controller");
const Social = require("../controllers/social.controller");
const Synonym = require("../controllers/synonym.controller");
const Tag = require("../controllers/tag.controller");
const Topic = require("../controllers/topic.controller");
const User = require("../controllers/user.controller");
const adminWorkPolice = require("../middleware/adminWorkPolice");
const adminEditPolice = require("../middleware/adminEditPolice");
const creatorPolice = require("../middleware/creatorPolice");
const Validator = require("../middleware/validator");
const { ForgotPassAndSendNew } = require("../controllers/ifForgotPass");

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
  rout.prefix("/", (admin) => {
    admin.get("/", adminWorkPolice, Admin.getAdmins);
    admin.get("/refresh", Admin.refreshAdminToken);
    admin.get("/get/:id", adminWorkPolice, Admin.getAdmin);
    admin.post("/",Validator("admin"),  Admin.addAdmin);
    admin.put("/:id", adminEditPolice,Validator("admin"), Admin.editAdmin);
    admin.delete("/:id", adminEditPolice, Admin.deleteAdmin);
    admin.post("/login/",Validator("SignInValidator"), Admin.loginAdmin);
    admin.post("/logout", Admin.logOutAdmin);
  });
  rout.prefix("/forgot", (forgot) => {
    forgot.post("/", ForgotPassAndSendNew);
  })
  rout.prefix("/author_social", (author_social) => {
    author_social.get("/", adminWorkPolice, Author_Social.getAuthor_Socials);
    author_social.get("/:id", adminWorkPolice, Author_Social.getAuthor_Social);
    author_social.post("/",Validator("author_social"), adminWorkPolice, Author_Social.addAuthor_Social);
    author_social.put("/:id",Validator("author_social"), adminWorkPolice, Author_Social.editAuthor_Social);
    author_social.delete("/:id", adminWorkPolice, Author_Social.deleteAuthor_Social);
  });
  rout.prefix("/author", (author) => {
    author.get("/", adminWorkPolice, Author.getAuthors);
    author.get("/:id", adminWorkPolice, Author.getAuthor);
    author.post("/",Validator("author"), adminWorkPolice, Author.addAuthor);
    author.put("/:id",Validator("author"), adminWorkPolice, Author.editAuthor);
    author.delete("/:id", adminWorkPolice, Author.deleteAuthor);
  });
  rout.prefix("/category", (category) => {
    category.get("/", adminWorkPolice, Category.getCategorys);
    category.get("/:id", adminWorkPolice, Category.getCategory);
    category.post("/",Validator("category"), adminWorkPolice, Category.addCategory);
    category.put("/:id",Validator("category"), adminWorkPolice, Category.editCategory);
    category.delete("/:id", adminWorkPolice, Category.deleteCategory);
  });
  rout.prefix("/desc_qa", (desc_qa) => {
    desc_qa.get("/", adminWorkPolice, Desc_QA.getDesc_QAs);
    desc_qa.get("/:id", adminWorkPolice, Desc_QA.getDesc_QA);
    desc_qa.post("/",Validator("desc_qa"), adminWorkPolice, Desc_QA.addDesc_QA);
    desc_qa.put("/:id",Validator("desc_qa"), adminWorkPolice, Desc_QA.editDesc_QA);
    desc_qa.delete("/:id", adminWorkPolice, Desc_QA.deleteDesc_QA);
  });
  rout.prefix("/desc_topic", (desc_topic) => {
    desc_topic.get("/", adminWorkPolice, Desc_Topic.getDesc_Topics);
    desc_topic.get("/:id", adminWorkPolice, Desc_Topic.getDesc_Topic);
    desc_topic.post("/",Validator("desc_topic"), adminWorkPolice, Desc_Topic.addDesc_Topic);
    desc_topic.put("/:id", Validator("desc_topic"),adminWorkPolice, Desc_Topic.editDesc_Topic);
    desc_topic.delete("/:id", adminWorkPolice, Desc_Topic.deleteDesc_Topic);
  });
  rout.prefix("/description", (description) => {
    description.get("/", adminWorkPolice, Description.getDescriptions);
    description.get("/:id", adminWorkPolice, Description.getDescription);
    description.post("/",Validator("description"), adminWorkPolice, Description.addDescription);
    description.put("/:id",Validator("description"), adminWorkPolice, Description.editDescription);
    description.delete("/:id", adminWorkPolice, Description.deleteDescription);
  });
  rout.prefix("/dictionary", (dictionary) => {
    dictionary.get("/", adminWorkPolice, Dictionary.getDictionarys);
    dictionary.get("/:id", adminWorkPolice, Dictionary.getDictionary);
    dictionary.post("/",Validator("dictionary"), adminWorkPolice, Dictionary.addDictionary);
    dictionary.put("/:id", Validator("dictionary"),adminWorkPolice, Dictionary.editDictionary);
    dictionary.delete("/:id", adminWorkPolice, Dictionary.deleteDictionary);
  });
  rout.prefix("/media", (media) => {
    media.get("/", adminWorkPolice, Media.getMedias);
    media.get("/:id", adminWorkPolice, Media.getMedia);
    media.post("/",Validator("media"), adminWorkPolice, Media.addMedia);
    media.put("/:id",Validator("media"),  adminWorkPolice, Media.editMedia);
    media.delete("/:id", adminWorkPolice, Media.deleteMedia);
  });
  rout.prefix("/question_answer", (question_answer) => {
    question_answer.get("/", adminWorkPolice, Question_Answer.getQuestion_Answers);
    question_answer.get("/:id", adminWorkPolice, Question_Answer.getQuestion_Answer);
    question_answer.post("/",Validator("question_answer"),  adminWorkPolice, Question_Answer.addQuestion_Answer);
    question_answer.put("/:id",Validator("question_answer"), adminWorkPolice, Question_Answer.editQuestion_Answer);
    question_answer.delete("/:id", adminWorkPolice, Question_Answer.deleteQuestion_Answer);
  });
  rout.prefix("/social", (social) => {
    social.get("/", adminWorkPolice, Social.getSocials);
    social.get("/:id", adminWorkPolice, Social.getSocial);
    social.post("/",Validator("social"), adminWorkPolice, Social.addSocial);
    social.put("/:id",Validator("social"),  adminWorkPolice, Social.editSocial);
    social.delete("/:id", adminWorkPolice, Social.deleteSocial);
  });
  rout.prefix("/synonym", (synonym) => {
    synonym.get("/", adminWorkPolice, Synonym.getSynonyms);
    synonym.get("/:id", adminWorkPolice, Synonym.getSynonym);
    synonym.post("/",Validator("synonym"),  adminWorkPolice, Synonym.addSynonym);
    synonym.put("/:id",Validator("synonym"),  adminWorkPolice, Synonym.editSynonym);
    synonym.delete("/:id", adminWorkPolice, Synonym.deleteSynonym);
  });
  rout.prefix("/tag", (tag) => {
    tag.get("/", adminWorkPolice, Tag.getTags);
    tag.get("/:id", adminWorkPolice, Tag.getTag);
    tag.post("/",Validator("tag"),  adminWorkPolice, Tag.addTag);
    tag.put("/:id",Validator("tag"), adminWorkPolice, Tag.editTag);
    tag.delete("/:id", adminWorkPolice, Tag.deleteTag);
  });
  rout.prefix("/topic", (topic) => {
    topic.get("/", adminWorkPolice, Topic.getTopics);
    topic.get("/:id", adminWorkPolice, Topic.getTopic);
    topic.post("/",Validator("topic"), adminWorkPolice, Topic.addTopic);
    topic.put("/:id", Validator("topic"),adminWorkPolice, Topic.editTopic);
    topic.delete("/:id", adminWorkPolice, Topic.deleteTopic);
  });
  rout.prefix("/user", (user) => {
    user.get("/", adminWorkPolice, User.getUsers);
    user.get("/:id", adminWorkPolice, User.getUser);
    user.post("/",Validator("user"), adminWorkPolice, User.addUser);
    user.put("/:id",Validator("user"), adminWorkPolice, User.editUser);
    user.delete("/:id", adminWorkPolice, User.deleteUser);
  });
});

module.exports = router;
