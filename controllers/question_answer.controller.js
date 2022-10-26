const Author = require("../models/Author");
const Question_Answer = require("../models/Question_Answer");
const mongoose = require("mongoose");
const { question_answerValidation } = require("../validations/question_answer");

const errorHandler = (res, error) => {
  res.status(500).send(error);
};

const getQuestion_Answers = async (req, res) => {
  try {
    const allQuestion_Answer = await Question_Answer.find({});
    res.status(200).send(allQuestion_Answer);
  } catch (error) {
    errorHandler(res, error);
  }
};

const getQuestion_Answer = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "invalid Question_Answer id" });
    }
    const question_Answer = await Question_Answer.findOne({
      _id: req.params.id,
    });
    if (!question_Answer) {
      return res.status(400).send({ message: "Question_Answer topilmadi" });
    }
    res.status(200).send(question_Answer);
  } catch (error) {
    errorHandler(res, error);
  }
};

const addQuestion_Answer = async (req, res) => {
  try {
    const { error, value } = question_answerValidation(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    const { question, answer, is_checked, expert_id } = value;
    if (!mongoose.isValidObjectId(expert_id)) {
      return res.status(400).send({ message: "invalid expert id" });
    }
    const expert = await Author.findOne({ _id: expert_id });
    if (!expert) {
      return res.status(400).send({ message: "expert not found" });
    }
    const newQuestion_Answer = await Question_Answer({
      question,
      answer,
      is_checked,
      expert_id,
    });
    await newQuestion_Answer.save();
    res.status(200).send({ message: "Question_Answer added" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const editQuestion_Answer = async (req, res) => {
  try {
    const { error, value } = question_answerValidation(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    const { question, answer, is_checked, expert_id } = value;
    // const { question, answer, is_checked, expert_id } = req.body;
    if (expert_id) {
      if (!mongoose.isValidObjectId(expert_id)) {
        return res.status(400).send({ message: "invalid expert id" });
      }
      const expert = await Author.findOne({ _id: expert_id });
      if (!expert) {
        return res.status(400).send({ message: "expert not found" });
      }
    }
    const question_Answer = await Question_Answer.findOne({
      _id: req.params.id,
    });
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "invalid req id" });
    }
    if (!question_Answer) {
      return res.status(404).send({ message: "Question_Answer not found" });
    }
    await Question_Answer.updateOne(
      { _id: req.params.id },
      {
        question: question || question_Answer.question,
        answer: answer || question_Answer.answer,
        is_checked: is_checked || question_Answer.is_checked,
        expert_id: expert_id || question_Answer.expert_id,
      }
    );
    res.status(200).send({ message: "Question_Answer updated" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteQuestion_Answer = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "invalid req id" });
    }
    const question_Answer = await Question_Answer.findOne({
      _id: req.params.id,
    });
    if (!question_Answer) {
      return res.status(400).send({ message: "Question_Answer not found" });
    }
    await Question_Answer.deleteOne({ _id: req.params.id });
    res.status(200).send({ message: "Question_Answer deleted" });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  getQuestion_Answers,
  getQuestion_Answer,
  addQuestion_Answer,
  editQuestion_Answer,
  deleteQuestion_Answer,
};
