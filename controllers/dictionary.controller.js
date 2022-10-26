const Dictionary = require("../models/DIctionary");
const mongoose = require("mongoose");
const { dictionaryValidation } = require("../validations/dictionary");
const errorHandler = (res, error) => {
  res.status(500).send({message:"Serverda hatolik"});
};

const getDictionarys = async (req, res) => {
  try {
    const allDictionary = await Dictionary.find({});
    res.status(200).send(allDictionary);
  } catch (error) {
    errorHandler(res, error);
  }
};

const getDictionary = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "invalid id" });
    }
    const dictionary = await Dictionary.findOne({ _id: req.params.id });
    if (!dictionary) {
      return res.status(400).send({ message: "Dictionary topilmadi" });
    }
    res.status(200).send(dictionary);
  } catch (error) {
    errorHandler(res, error);
  }
};

const addDictionary = async (req, res) => {
  try {
    const { error,value} = dictionaryValidation(req.body);
    if (error) {
      return res.status(400).send({message:error.details[0].message })
    }

    const { term,letter } = value;
    const toLower = term.toLowerCase();
    // const letter = toLower[0];
    const dict = await Dictionary.findOne({ toLower: toLower });
    if (dict) {
      return res.status(400).send({ message: "termin already exists" });
    }
    const newDictionary = Dictionary({
      term,
      letter,
      toLower,
    });
    await newDictionary.save();
    res.status(200).send({ message: "Dictionary qo'shildi" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const editDictionary = async (req, res) => {
  try {
    const { error,value} = dictionaryValidation(req.body);
    if (error) {
      return res.status(400).send({message:error.details[0].message })
    }

    const { term,letter } = value;
    // let { term } = req.body;
    const toLower = term.toLowerCase();
    // const letter = toLower[0];
    const dict = await Dictionary.findOne({ toLower: toLower });
    if (dict && dict.id != req.params.id) {
      return res.status(400).send({ message: "termin already exists" });
    }
    const dictionary = await Dictionary.findOne({ _id: req.params.id });
    if (!dictionary) {
      return res.status(404).send({ message: "dictionary topilmadi" });
    }
    await Dictionary.updateOne(
      { _id: req.params.id },
      {
        term: term || dictionary.term,
        letter: letter || dictionary.letter,
        toLower: toLower || dictionary.toLower,
      }
    );
    res.status(200).send({ message: "dictionary o'zgartirildi" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteDictionary = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "invalid req id" });
    }
    const dictionary = await Dictionary.findOne({ _id: req.params.id });
    if (!dictionary) {
      return res.status(400).send({ message: "Dictionary topilmadi" });
    }
    await Dictionary.deleteOne({ _id: req.params.id });
    res.status(200).send({ message: "Dictionary o'chirildi" });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  getDictionarys,
  getDictionary,
  addDictionary,
  editDictionary,
  deleteDictionary,
};
