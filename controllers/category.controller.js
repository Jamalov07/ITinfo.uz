const mongoose = require("mongoose");
const Category = require("../models/Category");
const { categoryValidation } = require("../validations/category");

const errorHandler = (res, error) => {
  res.status(500).send({ message: error.message });
};

const getCategorys = async (req, res) => {
  try {
    const allCategory = await Category.find({});
    res.status(200).send(allCategory);
  } catch (error) {
    errorHandler(res, error);
  }
};

const getCategory = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "invalid id" });
    }
    const category = await Category.findOne({ _id: req.params.id });
    if (!category) {
      return res.status(400).send({ message: "Category not found" });
    }
    res.status(200).send(category);
  } catch (error) {
    errorHandler(res, error);
  }
};

const addCategory = async (req, res) => {
  try {
    const { error } = categoryValidation(req.body);
    if (error) {
      return res.status(400).send({message:error.details[0].message })
    }
    const { category_name } = req.body;
    const parent_category_id = req.body.parent_category_id;
    const newCategory = await Category({
      category_name,
      parent_category_id,
    });
    if (parent_category_id) {
      if (!mongoose.isValidObjectId(parent_category_id)) {
        return res.status(400).send({ message: "invalid id" });
      }
      const parent = await Category.findOne({ _id: parent_category_id });
      if (!parent) {
        return res.status(400).send({ message: "parent not found" });
      }
      await newCategory.save();
      return res.status(200).send({ message: "category added" });
    }
    await newCategory.save();
    res.status(200).send({ message: "category added" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const editCategory = async (req, res) => {
  try {
    const { error } = categoryValidation(req.body);
    if (error) {
      return res.status(400).send({message:error.details[0].message })
    }
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "invalid id" });
    }
    const category = await Category.findOne({ _id: req.params.id });
    if (!category) {
      return res.status(400).send({ message: "category not found" });
    }
    const { category_name, parent_category_id } = req.body;

    if (parent_category_id) {
      if (!mongoose.isValidObjectId(parent_category_id))
        return res.status(400).send({ message: "invalid parent id" });
      const parent = await Category.findOne({ _id: parent_category_id });
      if (!parent) {
        return res.status(400).send({ message: "parent not found" });
      }
    }
    const cate = await Category.findOne({
      category_name: { $regex: category_name, $options: "i" },
    });
    if (cate.id != category.id)
      return res.status(400).send({ message: "category already exists" });
    await Category.updateOne(
      { _id: req.params.id },
      {
        category_name: category_name || category.category_name,
        parent_category_id: parent_category_id || category.parent_category_id,
      }
    );
    res.status(200).send({ message: "category updated" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id });
    if (!category) {
      return res.status(400).send({ message: "category not found" });
    }
    await Category.deleteOne({ _id: req.params.id });
    res.status(200).send({ message: "category deleted" });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  getCategorys,
  getCategory,
  addCategory,
  editCategory,
  deleteCategory,
};
