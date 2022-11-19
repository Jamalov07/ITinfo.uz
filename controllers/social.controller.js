const Social = require("../models/Social");
const mongoose = require("mongoose");
const ApiError = require("../errors/ApiError");

const getSocials = async (req, res) => {
  try {
    const allSocial = await Social.find({});
    res.ok(200, allSocial);
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const getSocial = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.error(400, { friendlyMsg: "invalid id" });
    }
    const social = await Social.findOne({ _id: req.params.id });
    if (!social) {
      return res.error(400, { friendlyMsg: "Social not found" });
    }
    res.ok(200, social);
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const addSocial = async (req, res) => {
  try {
    const { social_name, social_icon_file } = req.body;
    const social = await Social.findOne({ social_name: social_name });
    if (social) {
      return res.error(400, { friendlyMsg: "social already exists" });
    }
    const newSocial = Social({
      social_name,
      social_icon_file,
    });
    await newSocial.save();
    res.ok(200, { friendlyMsg: "Social added" });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const editSocial = async (req, res) => {
  try {
    const { social_name, social_icon_file } = req.body;
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.error(400, { friendlyMsg: "invalid id" });
    }
    const social = await Social.findOne({ _id: req.params.id });
    if (!social) {
      return res.error(400, { friendlyMsg: "Social not found" });
    }
    const soci = await Social.findOne({ social_name: social_name });
    if (soci && soci.id != req.params.id) {
      return res.error(400, { friendlyMsg: "social already exists" });
    }
    await Social.updateOne(
      { _id: req.params.id },
      {
        social_name: social_name || social.social_name,
        social_icon_file: social_icon_file || social.social_icon_file,
      }
    );
    res.ok(200, { friendlyMsg: "Social updated" });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const deleteSocial = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.error(400, { friendlyMsg: "invalid id" });
    }
    const social = await Social.findOne({ _id: req.params.id });
    if (!social) {
      return res.error(400, { friendlyMsg: "Social topilmadi" });
    }
    await Social.deleteOne({ _id: req.params.id });
    res.ok(200, { friendlyMsg: "Social o'chirildi" });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

module.exports = {
  getSocials,
  getSocial,
  addSocial,
  editSocial,
  deleteSocial,
};
