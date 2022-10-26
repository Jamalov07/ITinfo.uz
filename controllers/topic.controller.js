const Author = require("../models/Author");
const Topic = require("../models/Topic");
const mongoose = require("mongoose");
const { topicValidation } = require("../validations/topic");

const errorHandler = (res, error) => {
  res.status(500).send(error);
};

const getTopics = async (req, res) => {
  try {
    const allTopic = await Topic.find({});
    res.status(200).send(allTopic);
  } catch (error) {
    errorHandler(res, error);
  }
};

const getTopic = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "invalid id" });
    }
    const topic = await Topic.findOne({ _id: req.params.id });
    if (!topic) {
      return res.status(400).send({ message: "Topic not found" });
    }
    res.status(200).send(topic);
  } catch (error) {
    errorHandler(res, error);
  }
};

const addTopic = async (req, res) => {
  try {
    const { error, value } = topicValidation(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    const {
      author_id,
      topic_title,
      topic_text,
      is_checked,
      is_approwed,
      expert_id,
    } = value;
    if (!mongoose.isValidObjectId(author_id)) {
      return res.status(400).send({ message: "invalid author id" });
    }
    const author = await Author.findOne({ _id: author_id });
    if (!author) {
      return res.status(400).send({ message: "author not found" });
    }
    if (!mongoose.isValidObjectId(author_id)) {
      return res.status(400).send({ message: "invalid expert id" });
    }
    const expert = await Author.findOne({ _id: expert_id });
    if (!expert) {
      return res.status(400).send({ message: "expert not found" });
    }
    const newTopic = await Topic({
      author_id,
      topic_title,
      topic_text,
      is_checked,
      is_approwed,
      expert_id,
    });
    await newTopic.save();
    res.status(200).send({ message: "Topic added" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const editTopic = async (req, res) => {
  try {
    const { error, value } = topicValidation(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    const {
      author_id,
      topic_title,
      topic_text,
      is_checked,
      is_approwed,
      expert_id,
    } = value;
    // const {
    //   author_id,
    //   topic_title,
    //   topic_text,
    //   is_checked,
    //   is_approwed,
    //   expert_id,
    // } = req.body;

    if (!mongoose.isValidObjectId(author_id)) {
      return res.status(400).send({ message: "invalid author id" });
    }
    const author = await Author.findOne({ _id: author_id });
    if (!author) {
      return res.status(400).send({ message: "author not found" });
    }
    if (!mongoose.isValidObjectId(expert_id)) {
      return res.status(400).send({ message: "invalid expert id" });
    }
    const expert = await Author.findOne({ _id: expert_id });
    if (!expert) {
      return res.status(400).send({ message: "expert not found" });
    }
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "invalid id" });
    }
    const topic = await Topic.findOne({ _id: req.params.id });
    if (!topic) {
      return res.status(400).send({ message: "Topic not found" });
    }

    await Topic.updateOne(
      { _id: req.params.id },
      {
        author_id: author_id || topic.author_id,
        topic_title: topic_title || topic.topic_title,
        topic_text: topic_text || topic.topic_text,
        is_checked: is_checked || topic.is_checked,
        is_approwed: is_approwed || topic.is_approwed,
        expert_id: expert_id || topic.expert_id,
      }
    );
    res.status(200).send({ message: "Topic updated" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteTopic = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "invalid id" });
    }
    const topic = await Topic.findOne({ _id: req.params.id });
    if (!topic) {
      return res.status(400).send({ message: "Topic not found" });
    }
    await Topic.deleteOne({ _id: req.params.id });
    res.status(200).send({ message: "Topic deleted" });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  getTopics,
  getTopic,
  addTopic,
  editTopic,
  deleteTopic,
};
