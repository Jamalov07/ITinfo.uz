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
const express = require("express");
const authorWorkPolice = require("../middleware/authorWorkPolice");
const authorEditPolice = require("../middleware/authorEditPolice");
const Validator = require("../middleware/validator");
const adminWorkPolice = require("../middleware/adminWorkPolice");
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
  rout.prefix("/", (author) => {
    author.get("/", authorWorkPolice, Author.getAuthors);
    author.get("/refresh", Author.refreshAuthorToken);
    author.post("/",Validator("author"), Author.addAuthor);
    author.get("/get/:id", authorWorkPolice, Author.getAuthor);
    author.post("/login",Validator("SignInValidator"), Author.loginAuthor);
    author.put("/:id",authorEditPolice, Validator("author"),  Author.editAuthor);
    author.delete("/:id", authorEditPolice, Author.deleteAuthor);
    author.post("/logout", Author.logOutAuthor);
  });
  rout.prefix("/forgot", (forgot) => {
    forgot.post("/", ForgotPassAndSendNew);
  })
  rout.prefix("/author_social", (author_social) => {
    author_social.get("/", authorWorkPolice, Author_Social.getAuthor_Socials);
    author_social.get("/:id", authorWorkPolice, Author_Social.getAuthor_Social);
    author_social.post("/",Validator("author_social"), authorWorkPolice, Author_Social.addAuthor_Social);
    author_social.put("/:id",Validator("author_social"), authorWorkPolice, Author_Social.editAuthor_Social);
    author_social.delete("/:id", authorWorkPolice, Author_Social.deleteAuthor_Social);
  });
 
  rout.prefix("/category", (category) => {
    category.get("/", authorWorkPolice, Category.getCategorys);
    category.get("/:id", authorWorkPolice, Category.getCategory);
    category.post("/",Validator("category"), authorWorkPolice, Category.addCategory);
    category.put("/:id",Validator("category"), authorWorkPolice, Category.editCategory);
    category.delete("/:id", authorWorkPolice, Category.deleteCategory);
  });
  rout.prefix("/desc_qa", (desc_qa) => {
    desc_qa.get("/", authorWorkPolice, Desc_QA.getDesc_QAs);
    desc_qa.get("/:id", authorWorkPolice, Desc_QA.getDesc_QA);
    desc_qa.post("/",Validator("desc_qa"), authorWorkPolice, Desc_QA.addDesc_QA);
    desc_qa.put("/:id",Validator("desc_qa"), authorWorkPolice, Desc_QA.editDesc_QA);
    desc_qa.delete("/:id", authorWorkPolice, Desc_QA.deleteDesc_QA);
  });
  rout.prefix("/desc_topic", (desc_topic) => {
    desc_topic.get("/", authorWorkPolice, Desc_Topic.getDesc_Topics);
    desc_topic.get("/:id", authorWorkPolice, Desc_Topic.getDesc_Topic);
    desc_topic.post("/",Validator("desc_topic"), authorWorkPolice, Desc_Topic.addDesc_Topic);
    desc_topic.put("/:id", Validator("desc_topic"),authorWorkPolice, Desc_Topic.editDesc_Topic);
    desc_topic.delete("/:id", authorWorkPolice, Desc_Topic.deleteDesc_Topic);
  });
  rout.prefix("/description", (description) => {
    description.get("/", authorWorkPolice, Description.getDescriptions);
    description.get("/:id", authorWorkPolice, Description.getDescription);
    description.post("/",Validator("description"), authorWorkPolice, Description.addDescription);
    description.put("/:id",Validator("description"), authorWorkPolice, Description.editDescription);
    description.delete("/:id", authorWorkPolice, Description.deleteDescription);
  });
  rout.prefix("/dictionary", (dictionary) => {
    dictionary.get("/", authorWorkPolice, Dictionary.getDictionarys);
    dictionary.get("/:id", authorWorkPolice, Dictionary.getDictionary);
    dictionary.post("/",Validator("dictionary"), authorWorkPolice, Dictionary.addDictionary);
    dictionary.put("/:id", Validator("dictionary"),authorWorkPolice, Dictionary.editDictionary);
    dictionary.delete("/:id", authorWorkPolice, Dictionary.deleteDictionary);
  });
  rout.prefix("/media", (media) => {
    media.get("/", authorWorkPolice, Media.getMedias);
    media.get("/:id", authorWorkPolice, Media.getMedia);
    media.post("/",Validator("media"), authorWorkPolice, Media.addMedia);
    media.put("/:id",Validator("media"),  authorWorkPolice, Media.editMedia);
    media.delete("/:id", authorWorkPolice, Media.deleteMedia);
  });
  rout.prefix("/question_answer", (question_answer) => {
    question_answer.get("/", authorWorkPolice, Question_Answer.getQuestion_Answers);
    question_answer.get("/:id", authorWorkPolice, Question_Answer.getQuestion_Answer);
    question_answer.post("/",Validator("question_answer"),  authorWorkPolice, Question_Answer.addQuestion_Answer);
    question_answer.put("/:id",Validator("question_answer"), authorWorkPolice, Question_Answer.editQuestion_Answer);
    question_answer.delete("/:id", authorWorkPolice, Question_Answer.deleteQuestion_Answer);
  });
  rout.prefix("/social", (social) => {
    social.get("/", authorWorkPolice, Social.getSocials);
    social.get("/:id", authorWorkPolice, Social.getSocial);
    social.post("/",Validator("social"), authorWorkPolice, Social.addSocial);
    social.put("/:id",Validator("social"),  authorWorkPolice, Social.editSocial);
    social.delete("/:id", authorWorkPolice, Social.deleteSocial);
  });
  rout.prefix("/synonym", (synonym) => {
    synonym.get("/", authorWorkPolice, Synonym.getSynonyms);
    synonym.get("/:id", authorWorkPolice, Synonym.getSynonym);
    synonym.post("/",Validator("synonym"),  authorWorkPolice, Synonym.addSynonym);
    synonym.put("/:id",Validator("synonym"),  authorWorkPolice, Synonym.editSynonym);
    synonym.delete("/:id", authorWorkPolice, Synonym.deleteSynonym);
  });
  rout.prefix("/tag", (tag) => {
    tag.get("/", authorWorkPolice, Tag.getTags);
    tag.get("/:id", authorWorkPolice, Tag.getTag);
    tag.post("/",Validator("tag"),  authorWorkPolice, Tag.addTag);
    tag.put("/:id",Validator("tag"), authorWorkPolice, Tag.editTag);
    tag.delete("/:id", authorWorkPolice, Tag.deleteTag);
  });
  rout.prefix("/topic", (topic) => {
    topic.get("/", authorWorkPolice, Topic.getTopics);
    topic.get("/:id", authorWorkPolice, Topic.getTopic);
    topic.post("/",Validator("topic"), authorWorkPolice, Topic.addTopic);
    topic.put("/:id", Validator("topic"),authorWorkPolice, Topic.editTopic);
    topic.delete("/:id", authorWorkPolice, Topic.deleteTopic);
  });
  
});

module.exports = router;
