const Synonym = require("../models/Synonym");
const mongoose = require("mongoose");
const Description = require("../models/Description");
const Dictionary = require("../models/DIctionary");
const { synonymValidation } = require("../validations/synonym");

const errorHandler = (res, error) => {
  res.status(500).send(error);
};

const getSynonyms = async (req, res) => {
  try {
    const allSynonym = await Synonym.find({});
    res.status(200).send(allSynonym);
  } catch (error) {
    errorHandler(res, error);
  }
};

const getSynonym = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "invalid id" });
    }
    const synonym = await Synonym.findOne({ _id: req.params.id });
    if (!synonym) {
      return res.status(400).send({ message: "Synonym not found" });
    }
    res.status(200).send(synonym);
  } catch (error) {
    errorHandler(res, error);
  }
};

const addSynonym = async (req, res) => {
  try {
    const { error, value } = synonymValidation(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    const { desc_id, dict_id } = value;

    if (!mongoose.isValidObjectId(desc_id)) {
      return res.status(400).send({ message: "invalid desc id" });
    }
    const description = await Description.findOne({ _id: desc_id });
    if (!description) {
      return res.status(400).send({ message: "description not found" });
    }
    if (!mongoose.isValidObjectId(dict_id)) {
      return res.status(400).send({ message: "invalid Dictionary id" });
    }
    const dictionary = await Dictionary.findOne({ _id: dict_id });
    if (!dictionary) {
      return res.status(400).send({ message: "Dictionary not found" });
    }
    const synonym1 = await Synonym.findOne({
      desc_id: desc_id,
      dict_id: dict_id,
    });
    if (synonym1) {
      res.status(400).send({ message: "synonym already exists" });
    }
    const newSynonym = await Synonym({
      desc_id,
      dict_id,
    });
    await newSynonym.save();
    res.status(200).send({ message: "Synonym added" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const editSynonym = async (req, res) => {
  try {
    const { error, value } = synonymValidation(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    const { desc_id, dict_id } = value;

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "invalid req id" });
    }
    const synonym = await Synonym.findOne({ _id: req.params.id });
    if (!synonym) {
      return res.status(400).send({ message: "synonym not found" });
    }

    // const desc_id = req.body.desc_id || synonym.desc_id;
    // const dict_id = req.body.dict_id || synonym.dict_id;

    if (!mongoose.isValidObjectId(desc_id)) {
      return res.status(400).send({ message: "invalid desc _ id" });
    }
    if (!mongoose.isValidObjectId(dict_id)) {
      return res.status(400).send({ message: "invalid Dictionary _ id" });
    }
    const description = await Description.findOne({ _id: desc_id });
    if (!description) {
      return res.status(400).send({ message: "description not found" });
    }
    const dictionary = await Dictionary.findOne({ _id: dict_id });
    if (!dictionary) {
      return res.status(400).send({ message: "Dictionary not found" });
    }

    const synonym1 = await Synonym.findOne({
      desc_id: desc_id,
      dict_id: dict_id,
    });
    if (synonym1) {
      res.status(400).send({ message: "synonym already exists" });
    }
    console.log("aaa");
    await Synonym.updateOne(
      { _id: req.params.id },
      {
        desc_id,
        dict_id,
      }
    );
    res.status(200).send({ message: "synonym updated" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteSynonym = async (req, res) => {
  try {
    const synonym = await Synonym.findOne({ _id: req.params.id });
    if (!synonym) {
      return res.status(400).send({ message: "Synonym not found" });
    }
    await Synonym.deleteOne({ _id: req.params.id });
    res.status(200).send({ message: "Synonym deleted" });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  getSynonyms,
  getSynonym,
  addSynonym,
  editSynonym,
  deleteSynonym,
};
