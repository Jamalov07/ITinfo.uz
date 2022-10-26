const mongoose = require("mongoose");
const Media = require("../models/Media");
const Question_Answer = require("../models/Question_Answer");
const Description = require("../models/Description");
const Topic = require("../models/Topic");
const { mediaValidation } = require("../validations/media");

const errorHandler = (res, error) => {
  res.status(500).send({ message: error.message });
};

const getMedias = async (req, res) => {
  try {
    const allMedias = await Media.find({});
    res.status(200).send(allMedias);
  } catch (error) {
    errorHandler(res, error);
  }
};

const getMedia = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "invalid req id" });
    }
    const media = await Media.findOne({ _id: req.params.id });
    if (!media) {
      return res.status(400).send({ message: "media not found" });
    }
    res.status(200).send(media);
  } catch (error) {
    errorHandler(res, error);
  }
};

const addMedia = async (req, res) => {
  try {
    const { error, value } = mediaValidation(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    const { media_name, media_file, target_table_name, target_table_id } =
      value;
    if (
      target_table_name != "Topic" &&
      target_table_name != "Description" &&
      target_table_name != "Question_Answer"
    ) {
      return res.status(400).send({ message: "invalid target table name" });
    }
    if (!mongoose.isValidObjectId(target_table_id)) {
      return res.status(400).send({ message: "invalid target table id" });
    }
    if (target_table_name == "Topic") {
      const topic = await Topic.findOne({ _id: target_table_id });
      if (!topic) {
        return res.status(400).send({ message: "topic not found" });
      }
    }
    if (target_table_name == "Description") {
      const description = await Description.findOne({ _id: target_table_id });
      if (!description) {
        return res.status(400).send({ message: "description not found" });
      }
    }
    if (target_table_name == "Question_Answer") {
      const question_answer = await Question_Answer.findOne({
        _id: target_table_id,
      });
      if (!question_answer) {
        return res.status(400).send({ message: "question_answer not found" });
      }
    }
    const oldmedia = await Media.findOne({
      target_table_name: target_table_name,
      target_table_id: target_table_id,
    });
    if (oldmedia) {
      return res.status(400).send({ message: "media already exists" });
    }
    const newMedia = Media({
      media_name,
      media_file,
      target_table_name,
      target_table_id,
    });
    await newMedia.save();
    res.status(200).send({ message: "media added" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const editMedia = async (req, res) => {
  try {
    const { error, value } = mediaValidation(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    const { media_name, media_file, target_table_name, target_table_id } =
      value;
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "invalid req id" });
    }
    const media = await Media.findOne({ _id: req.params.id });
    if (!media) {
      return res.status(400).send({ message: "media not found" });
    }

    // const media_name = req.body.media_name || media.media_name;
    // const media_file = req.body.media_file || media.media_file;
    // const target_table_name =
      // req.body.target_table_name || media.target_table_name;
    // const target_table_id = req.body.target_table_id || media.target_table_id;

    if (
      target_table_name != "Topic" &&
      target_table_name != "Description" &&
      target_table_name != "Question_Answer"
    ) {
      return res.status(400).send({ message: "invalid target table name" });
    }

    if (!mongoose.isValidObjectId(target_table_id)) {
      return res.status(400).send({ message: "invalid target table id" });
    }
    if (target_table_name == "Topic") {
      const topic = await Topic.findOne({ _id: target_table_id });
      if (!topic) {
        return res.status(400).send({ message: "topic not found" });
      }

      if (target_table_name == "Description") {
        const description = await Description.findOne({ _id: target_table_id });
        if (!description) {
          return res.status(400).send({ message: "Description not found" });
        }
      }
      if (target_table_name == "Question_Answer") {
        const question_answer = await Question_Answer.findOne({
          _id: target_table_id,
        });
        if (!question_answer) {
          return res.status(400).send({ message: "question_answer not found" });
        }
      }
    }
    const media1 = await Media.findOne({
      target_table_name: target_table_name,
      target_table_id: target_table_id,
    });
    if (media1 && media1.id != req.params.id) {
      return res.status(400).send({ message: "media already exists" });
    }
    await Media.updateOne(
      { _id: req.params.id },
      {
        media_name,
        media_file,
        target_table_name,
        target_table_id,
      }
    );
    res.status(200).send({ message: "Media updated" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteMedia = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "invalid req id" });
    }
    const media = await Media.findOne({ _id: req.params.id });
    if (!media) {
      return res.status(400).send({ message: "media not found" });
    }
    await Media.deleteOne({ _id: req.params.id });
    res.status(200).send({ message: "media deleted" });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  getMedias,
  getMedia,
  addMedia,
  editMedia,
  deleteMedia,
};
