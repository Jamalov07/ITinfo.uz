const Description = require("../models/Description");
const Category = require("../models/Category");
const Dictionary = require("../models/DIctionary");
const mongoose = require("mongoose");
const { descriptionValidation } = require("../validations/description");

const errorHandler = (res, error) => {
  res.status(500).send(error);
};

const getDescriptions = async (req, res) => {
  try {
    const allDescription = await Description.find({}).populate({
      path: "category_id",
      select: "category_name -_id",
    });
    res.status(200).send(allDescription);
  } catch (error) {
    errorHandler(res, error);
  }
};

const getDescription = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "invalid dict id" });
    }
    const description = await Description.findOne({ _id: req.params.id });
    if (!description) {
      return res.status(404).send({ message: "Description topilmadi" });
    }
    res.status(200).send(description);
  } catch (error) {
    errorHandler(res, error);
  }
};

const addDescription = async (req, res) => {
  try {
    const { error, value } = descriptionValidation(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    const { category_id, description } = value;

    if (!mongoose.isValidObjectId(category_id)) {
      return res.status(400).send({ message: "invalid category id" });
    }
    if (!Category.findById(category_id)) {
      return res.status(400).send({ message: "category not found" });
    }

    const newDescription = await Description({
      category_id,
      description,
    });
    await newDescription.save();
    res.status(200).send({ message: "Description added" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const editDescription = async (req, res) => {
  try {
    const { error, value } = descriptionValidation(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    const { category_id, description } = value;

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "invalid req id" });
    }
    const description1 = await Description.findOne({ _id: req.params.id });
    if (!description1) {
      return res.status(400).send({ message: "Description not found" });
    }

    // const category_id = req.body.category_id || description1.category_id;
    console.log(category_id);
    // const description = req.body.description || description1.description;
    console.log(description);

    if (!mongoose.isValidObjectId(category_id)) {
      return res.status(400).send({ message: "invalid category id" });
    }
    if (!Category.findById(category_id)) {
      return res.status(400).send({ message: "category not found" });
    }

    await Description.updateOne(
      { _id: req.params.id },
      {
        category_id,
        description,
      }
    );
    res.status(200).send({ message: "description updated" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteDescription = async (req, res) => {
  try {
    const description = await Description.findOne({ _id: req.params.id });
    if (!description) {
      return res.status(400).send({ message: "Description not found" });
    }
    await Description.deleteOne({ _id: req.params.id });
    res.status(200).send({ message: "Description deleted" });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  getDescriptions,
  getDescription,
  addDescription,
  editDescription,
  deleteDescription,
};
