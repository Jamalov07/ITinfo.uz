const Desc_QA = require("../models/Desc_QA");
const mongoose = require("mongoose");
const Description = require("../models/Description");
const Question_Answer = require("../models/Question_Answer");
const { desc_qaValidation } = require("../validations/desc_qa");

const errorHandler = (res, error) => {
  res.status(500).send(error);
};

const getDesc_QAs = async (req, res) => {
  try {
    const allDesc_QA = await Desc_QA.find({});
    res.status(200).send(allDesc_QA);
  } catch (error) {
    errorHandler(res, error);
  }
};

const getDesc_QA = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "invalid id" });
    }
    const desc_QA = await Desc_QA.findOne({ _id: req.params.id });
    if (!desc_QA) {
      return res.status(400).send({ message: "Desc_QA not found" });
    }
    res.status(200).send(desc_QA);
  } catch (error) {
    errorHandler(res, error);
  }
};

const addDesc_QA = async (req, res) => {
  try {
    const { error, value } = desc_qaValidation(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    const { qa_id, desc_id } = value;

    if (!mongoose.isValidObjectId(qa_id)) {
      return res.status(400).send({ message: "invalid qa _ id" });
    }
    if (!mongoose.isValidObjectId(desc_id)) {
      return res.status(400).send({ message: "invalid desc _ id" });
    }
    const qa = await Question_Answer.findOne({ _id: qa_id });
    if (!qa) {
      return res.status(400).send({ message: "quest answ not found" });
    }
    const description = await Description.findOne({ _id: desc_id });
    if (!description) {
      return res.status(400).send({ message: "desc not found" });
    }
    const desc_qeusanw = await Desc_QA.findOne({
      qa_id: qa_id,
      desc_id: desc_id,
    });
    if (desc_qeusanw) {
      return res.status(400).send({ message: "desc_qa already exists" });
    }
    const newDesc_QA = await Desc_QA({
      qa_id,
      desc_id,
    });
    await newDesc_QA.save();
    res.status(200).send({ message: "Desc_QA added" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const editDesc_QA = async (req, res) => {
  try {
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    const { qa_id, desc_id } = value;

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "invalid req id" });
    }
    const desc_QA = await Desc_QA.findOne({ _id: req.params.id });
    if (!desc_QA) {
      return res.status(400).send({ message: "desc_QA not found" });
    }

    // const qa_id = req.body.qa_id || desc_QA.qa_id;
    // const desc_id = req.body.desc_id || desc_QA.desc_id;

    if (!mongoose.isValidObjectId(qa_id)) {
      return res.status(400).send({ message: "invalid qa _ id" });
    }
    if (!mongoose.isValidObjectId(desc_id)) {
      return res.status(400).send({ message: "invalid desc _ id" });
    }
    const qa = await Question_Answer.findOne({ _id: qa_id });
    if (!qa) {
      return res.status(400).send({ message: "quest answ not found" });
    }
    const description = await Description.findOne({ _id: desc_id });
    if (!description) {
      return res.status(400).send({ message: "desc not found" });
    }
    const desc_qeusanw = await Desc_QA.findOne({
      qa_id: qa_id,
      desc_id: desc_id,
    });
    if (desc_qeusanw) {
      return res.status(400).send({ message: "desc_qa already exists" });
    }
    await desc_QA.updateOne(
      { _id: req.params.id },
      {
        qa_id,
        desc_id,
      }
    );
    res.status(200).send({ message: "desc_QA updated" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteDesc_QA = async (req, res) => {
  try {
    const desc_QA = await Desc_QA.findOne({ _id: req.params.id });
    if (!desc_QA) {
      return res.status(400).send({ message: "Desc_QA not found" });
    }
    await Desc_QA.deleteOne({ _id: req.params.id });
    res.status(200).send({ message: "Desc_QA deleted" });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  getDesc_QAs,
  getDesc_QA,
  addDesc_QA,
  editDesc_QA,
  deleteDesc_QA,
};
