const { Router } = require("express");
const { createViewPath } = require("../helpers/createViewPath");
const Author = require("../models/Author");
const Category = require("../models/Category");
const Description = require("../models/Description");
const Dictionary = require("../models/DIctionary");
const Media = require("../models/Media");
const Synonym = require("../models/Synonym");
const Tag = require("../models/Tag");
const Topic = require("../models/Topic");
const Author_Social = require("../models/Author_Social");
const Social = require("../models/Social");
const router = Router();

router.get("/", (req, res) => {
  res.render(createViewPath("index"), { title: "bosh sahifa" });
});
router.get("/dictionary", async (req, res) => {
  const allDictionary = await Dictionary.find().lean();
  res.render(createViewPath("allDictionary"), {
    title: "dictionary",
    allDictionary,
  });
});


router.get("/dictionary/:id", async (req, res) => {
  const dictionary = await Dictionary.findOne({ _id: req.params.id }).lean();
  const synonym = await Synonym.findOne({ dict_id: dictionary._id }).lean();
  const description = await Description.findOne({
    _id: synonym.desc_id,
  }).lean();
  const media = await Media.findOne({
    target_table_name: "Description",
    target_table_id: description._id,
  }).lean();
  const category = await Category.findOne({
    _id: description.category_id,
  }).lean();
  const tag = await Tag.findOne({ category_id: category._id }).lean();
  const topic = await Topic.findOne({ _id: tag.topic_id }).lean();
  const author = await Author.findOne({ _id: topic.author_id }).lean();
  res.render(createViewPath("getOneDictionary"), {
    title: `About ${dictionary.toLower}`,
    dictionary,
    synonym,
    description,
    category,
    tag,
    topic,
    author,
    media,
  });
});


router.get("/author", async (req, res) => {
  const allAuthors = await Author.find().lean();
  console.log(allAuthors);
  res.render(createViewPath("allAuthors"), { title: "AllAuthors", allAuthors });
});

router.get("/category", async (req, res) => {
  const allCategory = await Category.find().lean();
  res.render(createViewPath("allCategory"), {
    title: "AllCatefory",
    allCategory,
  });
});

router.get("/about", async (req, res) => {
  const allAuthors = await Author.find().lean();
  res.render(createViewPath("About"), { title: "About us", allAuthors });
});

router.get("/author/:id", async (req, res) => {
  const author = await Author.findOne({ _id: req.params.id }).lean();
  const author_social = await Author_Social.find({ author_id: author._id }).lean();
  console.log(author_social);
  console.log(author);
  let socials = [];
  for (let el of author_social) {
    let social = await Social.findOne({ _id: el.social_id }).lean();
    if (social) {
      socials.push(social);
    }
  }
    console.log(socials);
  res.render(createViewPath("getOneAuthor"), {
    title: `About ${author.username}`,
    author_social,
    author,
    socials,
  });
});

module.exports = router;
