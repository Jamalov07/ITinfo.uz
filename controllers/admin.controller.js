const Admin = require("../models/Admin");
const { adminValidation } = require("../validations/admin");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { phoneValidator, emailValidator } = require("../validations/author");

const errorHandler = (res, error) => {
  res.status(500).send({ message: error });
};

const getAdmins = async (req, res) => {
  try {
    const allAdmin = await Admin.find({});
    res.status(200).send(allAdmin);
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAdmin = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "invalid Admin id" });
    }
    const admin = await Admin.findOne({ _id: req.params.id });
    if (!admin) {
      return res.status(400).send({ message: "Admin  not found" });
    }
    res.status(200).send(admin);
  } catch (error) {
    errorHandler(res, error);
  }
};

const addAdmin = async (req, res) => {
  try {
    const { error, value } = adminValidation(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    const {
      admin_name,
      admin_email,
      admin_password,
      admin_is_active,
      admin_is_creator,
    } = value;

    const adminHashedPassword = bcrypt.hashSync(admin_password, 7);

    const newAdmin = await Admin({
      admin_name,
      admin_email,
      admin_password: adminHashedPassword,
      admin_is_active,
      admin_is_creator,
    });
    await newAdmin.save();
    res.status(200).send({ message: "Admin added" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const editAdmin = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "invalid Admin id" });
    }
    const admin = await Admin.findOne({ _id: req.params.id });
    if (!admin) {
      return res.status(400).send({ message: "Admin not found" });
    }
    const { error, value } = adminValidation(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    const {
      admin_name,
      admin_email,
      admin_password,
      admin_is_active,
      admin_is_creator,
    } = value;
    const adminHashedPassword = bcrypt.hashSync(admin_password, 7);
    await Admin.updateOne(
      { _id: req.params.id },
      {
        admin_name,
        admin_email,
        admin_password: adminHashedPassword,
        admin_is_active,
        admin_is_creator,
      }
    );
    res.status(200).send({ message: "Admin updated" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteAdmin = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "invalid Admin id" });
    }
    const admin = await Admin.findOne({ _id: req.params.id });
    if (!admin) {
      return res.status(400).send({ message: "Admin not found" });
    }
    await Admin.deleteOne({ _id: req.params.id });
    res.status(200).send({ message: "Admin deleted" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { admin_email, admin_password } = req.body;
    const { error } = emailValidator({ admin_email });
    if (error) {
      return res.status(400).send({ message: error.details[0].message })
    }
    const admin = await Admin.findOne({ admin_email: admin_email });

    if (!admin) {
      return res
        .status(400)
        .send({ message: "Admin not found brat biz sizni tanimadik" });
    }
    const validPassword = bcrypt.compareSync(
      admin_password,
      admin.admin_password
    );
    if (!validPassword) {
      return res.status(400).send({ message: "biz sizni topolmadik" });
    }
    res.status(200).send({ message: `Hush kelibsiz ${admin.admin_name}` });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  getAdmins,
  getAdmin,
  addAdmin,
  editAdmin,
  deleteAdmin,
  loginAdmin,
};
