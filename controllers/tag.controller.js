const Category = require("../models/Category");
const Tag = require("../models/Tag");
const Topic = require("../models/Topic");
const mongoose = require("mongoose");
const { tagValidation } = require("../validations/tag");

const errorHandler = (res, error) => {
  res.status(500).send(error);
};

const getTags = async (req, res) => {
  try {
    const allTag = await Tag.find({});
    res.status(200).send(allTag);
  } catch (error) {
    errorHandler(res, error);
  }
};

const getTag = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "invalid id" });
    }
    const tag = await Tag.findOne({ _id: req.params.id });
    if (!tag) {
      return res.status(400).send({ message: "Tag not found" });
    }
    res.status(200).send(tag);
  } catch (error) {
    errorHandler(res, error);
  }
};

const addTag = async (req, res) => {
  try {
    const { error, value } = tagValidation(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    const { topic_id, category_id } = value;
    const newTag = Tag({
      topic_id,
      category_id,
    });
    if (!mongoose.isValidObjectId(topic_id)) {
      return res.status(400).send({ message: "invalid topic id" });
    }
    const topic = await Topic.findOne({ _id: topic_id });
    if (!topic) {
      return res.status(400).send({ message: "author not found" });
    }
    if (!mongoose.isValidObjectId(category_id)) {
      return res.status(400).send({ message: "invalid category id" });
    }
    const category = await Category.findOne({ _id: category_id });
    if (!category) {
      return res.status(400).send({ message: "category not found" });
    }
    const tag = await Tag.findOne({
      topic_id: topic_id,
      category_id: category_id,
    });
    if (tag) {
      return res.status(400).send({ message: "tag already exists" });
    }
    await newTag.save();
    res.status(200).send({ message: "Tag added" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const editTag = async (req, res) => {
  try {
    const { error, value } = tagValidation(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    const { topic_id, category_id } = value;
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "invalid id" });
    }
    const tag = await Tag.findOne({ _id: req.params.id });
    if (!tag) {
      return res.status(400).send({ message: "Tag not found" });
    }
    // const topic_id = req.body.topic_id || tag.topic_id;
    // const category_id = req.body.category_id || tag.category_id;
    if (!mongoose.isValidObjectId(topic_id)) {
      return res.status(400).send({ message: "invalid topic id" });
    }
    const topic = await Topic.findOne({ _id: topic_id });
    if (!topic) {
      return res.status(400).send({ message: "author not found" });
    }

    if (!mongoose.isValidObjectId(category_id)) {
      return res.status(400).send({ message: "invalid category id" });
    }
    const category = await Category.findOne({ _id: category_id });
    if (!category) {
      return res.status(400).send({ message: "category not found" });
    }
    const tag2 = await Tag.findOne({
      topic_id: topic_id,
      category_id: category_id,
    });
    if (tag2) {
      return res.status(400).send({ message: "tag already exists" });
    }
    await Tag.updateOne(
      { _id: req.params.id },
      {
        topic_id: topic_id || tag.topic_id,
        category_id: category_id || tag.category_id,
      }
    );
    res.status(200).send({ message: "Tag updated" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteTag = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "invalid id" });
    }
    const tag = await Tag.findOne({ _id: req.params.id });
    if (!tag) {
      return res.status(400).send({ message: "Tag not found" });
    }
    await Tag.deleteOne({ _id: req.params.id });
    res.status(200).send({ message: "Tag deleted" });
  } catch (error) {
    errorHandler(res, error);
  }
};
module.exports = {
  getTags,
  getTag,
  addTag,
  editTag,
  deleteTag,
};
