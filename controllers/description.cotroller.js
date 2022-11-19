const Description = require("../models/Description");
const Category = require("../models/Category");
const mongoose = require("mongoose");
const ApiError = require("../errors/ApiError");

const getDescriptions = async (req, res) => {
  try {
    const allDescription = await Description.find({}).populate({
      path: "category_id",
      select: "category_name -_id",
    });
    res.ok(200, allDescription);
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const getDescription = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.error(400, { friendlyMsg: "invalid dict id" });
    }
    const description = await Description.findOne({ _id: req.params.id });
    if (!description) {
      return res.status(404).send({ friendlyMsg: "Description topilmadi" });
    }
    res.ok(200, description);
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const addDescription = async (req, res) => {
  try {
    const { category_id, description } = req.body;

    if (!mongoose.isValidObjectId(category_id)) {
      return res.error(400, { friendlyMsg: "invalid category id" });
    }
    if (!Category.findById(category_id)) {
      return res.error(400, { friendlyMsg: "category not found" });
    }

    const newDescription = await Description({
      category_id,
      description,
    });
    await newDescription.save();
    res.ok(200, { friendlyMsg: "Description added" });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const editDescription = async (req, res) => {
  try {
    const { category_id, description } = req.body;

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.error(400, { friendlyMsg: "invalid req id" });
    }
    const description1 = await Description.findOne({ _id: req.params.id });
    if (!description1) {
      return res.error(400, { friendlyMsg: "Description not found" });
    }
    if (!mongoose.isValidObjectId(category_id)) {
      return res.error(400, { friendlyMsg: "invalid category id" });
    }
    if (!Category.findById(category_id)) {
      return res.error(400, { friendlyMsg: "category not found" });
    }

    await Description.updateOne(
      { _id: req.params.id },
      {
        category_id,
        description,
      }
    );
    res.ok(200, { friendlyMsg: "description updated" });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const deleteDescription = async (req, res) => {
  try {
    const description = await Description.findOne({ _id: req.params.id });
    if (!description) {
      return res.error(400, { friendlyMsg: "Description not found" });
    }
    await Description.deleteOne({ _id: req.params.id });
    res.ok(200, { friendlyMsg: "Description deleted" });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

module.exports = {
  getDescriptions,
  getDescription,
  addDescription,
  editDescription,
  deleteDescription,
};
