const User = require("../models/User");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { emailValidator } = require("../validations/author");
const { userValidation } = require("../validations/user");

const errorHandler = (res, error) => {
  res.status(500).send({ message: error });
};

const getUsers = async (req, res) => {
  try {
    const allUser = await User.find({});
    res.status(200).send(allUser);
  } catch (error) {
    errorHandler(res, error);
  }
};

const getUser = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "invalid User id" });
    }
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(400).send({ message: "User  not found" });
    }
    res.status(200).send(user);
  } catch (error) {
    errorHandler(res, error);
  }
};

const addUser = async (req, res) => {
  try {
    const { error, value } = userValidation(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    const { user_name, user_email, user_password, user_info, user_photo } =
      value;

    const UserHashedPassword = bcrypt.hashSync(user_password, 7);

    const newUser = await User({
      user_name,
      user_email,
      user_password: UserHashedPassword,
      user_info,
      user_photo,
    });
    await newUser.save();
    res.status(200).send({ message: "User added" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const editUser = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "invalid User id" });
    }
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(400).send({ message: "User not found" });
    }
    const { error, value } = userValidation(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    const { user_name, user_email, user_password, user_info, user_photo } =
      value;
    const UserHashedPassword = bcrypt.hashSync(user_password, 7);
    await User.updateOne(
      { _id: req.params.id },
      {
        user_name,
        user_email,
        user_password: UserHashedPassword,
        user_info,
        user_photo,
      }
    );
    res.status(200).send({ message: "User updated" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteUser = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "invalid User id" });
    }
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(400).send({ message: "User not found" });
    }
    await User.deleteOne({ _id: req.params.id });
    res.status(200).send({ message: "User deleted" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const loginUser = async (req, res) => {
  try {
    const { user_email, user_password } = req.body;
    const { error } = emailValidator({ login:user_email });
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    const user = await User.findOne({ user_email: user_email });

    if (!user) {
      return res
        .status(400)
        .send({ message: "User not found brat biz sizni tanimadik" });
    }
    const validPassword = bcrypt.compareSync(user_password, user.user_password);
    if (!validPassword) {
      return res.status(400).send({ message: "biz sizni topolmadik" });
    }
    res.status(200).send({ message: `Hush kelibsiz ${user.user_name}` });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  getUsers,
  getUser,
  addUser,
  editUser,
  deleteUser,
  loginUser,
};
