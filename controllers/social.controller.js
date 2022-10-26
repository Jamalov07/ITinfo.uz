const Social = require("../models/Social");
const mongoose = require("mongoose");
const { socialvalidation } = require("../validations/social");
const errorHandler = (res, error) => {
  res.status(500).send(error);
};

const getSocials = async (req, res) => {
  try {
    const allSocial = await Social.find({});
    res.status(200).send(allSocial);
  } catch (error) {
    errorHandler(res, error);
  }
};

const getSocial = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "invalid id" });
    }
    const social = await Social.findOne({ _id: req.params.id });
    if (!social) {
      return res.status(400).send({ message: "Social not found" });
    }
    res.status(200).send(social);
  } catch (error) {
    errorHandler(res, error);
  }
};

const addSocial = async (req, res) => {
  try {
    const { error, value } = socialvalidation(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].meaage });
    }

    const { social_name, social_icon_file } = value;
    const social = await Social.findOne({ social_name: social_name });
    if (social) {
      return res.status(400).send({ message: "social already exists" });
    }
    const newSocial = Social({
      social_name,
      social_icon_file,
    });
    await newSocial.save();
    res.status(200).send({ message: "Social added" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const editSocial = async (req, res) => {
  try {
    const { error, value } = socialvalidation(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].meaage });
    }

    const { social_name, social_icon_file } = value;
    // const { social_name, social_icon_file } = req.body;
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "invalid id" });
    }
    const social = await Social.findOne({ _id: req.params.id });
    if (!social) {
      return res.status(400).send({ message: "Social not found" });
    }
    const soci = await Social.findOne({ social_name: social_name });
    if (soci && soci.id != req.params.id) {
      return res.status(400).send({ message: "social already exists" });
    }
    await Social.updateOne(
      { _id: req.params.id },
      {
        social_name: social_name || social.social_name,
        social_icon_file: social_icon_file || social.social_icon_file,
      }
    );
    res.status(200).send({ message: "Social updated" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteSocial = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "invalid id" });
    }
    const social = await Social.findOne({ _id: req.params.id });
    if (!social) {
      return res.status(400).send({ message: "Social topilmadi" });
    }
    await Social.deleteOne({ _id: req.params.id });
    res.status(200).send({ message: "Social o'chirildi" });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  getSocials,
  getSocial,
  addSocial,
  editSocial,
  deleteSocial,
};
