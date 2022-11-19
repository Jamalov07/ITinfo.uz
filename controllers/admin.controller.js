const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const config = require("config");
const jwt = require("../services/JwtService");
const ApiError = require("../errors/ApiError");
const mailService = require("../services/MailService");
const getAdmins = async (req, res) => {
  try {
    const allAdmin = await Admin.find({});
    res.ok(200, allAdmin);
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const getAdmin = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.error(400, { friendlyMsg: "invalid Admin id" });
    }
    const admin = await Admin.findOne({ _id: req.params.id });
    if (!admin) {
      return res.error(400, { friendlyMsg: "Admin  not found" });
    }
    res.ok(200, admin);
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const addAdmin = async (req, res) => {
  try {
    const {
      admin_name,
      admin_email,
      admin_password,
    } = req.body;
    const adminHashedPassword = bcrypt.hashSync(admin_password, 7);
    const newAdmin = await Admin({
      admin_name,
      admin_email,
      admin_password: adminHashedPassword,
    });
    await newAdmin.save();
    await mailService.sendMessage(
      admin_email,
      "Sizning so'rov qabul qilindi. Javobimizni kuting"
    );

    const payload = {
      id: newAdmin.id,
      is_active: newAdmin.admin_is_active,
    };
    const tokens = jwt.generateTokens(payload);
    newAdmin.admin_token = tokens.refreshToken;
    await newAdmin.save();
    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: config.get("refresh_ms"),
      httpOnly: true,
    });
    res.ok(200, { ...tokens, admin: payload });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const editAdmin = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.error(400, { friendlyMsg: "invalid Admin id" });
    }
    const admin = await Admin.findOne({ _id: req.params.id });
    if (!admin) {
      return res.error(400, { friendlyMsg: "Admin not found" });
    }
    const {
      admin_name,
      admin_email,
      admin_password,
      admin_is_active,
      admin_is_creator,
    } = req.body;
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
    res.ok(200, { message: "Admin updated" });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.error(400, { friendlyMsg: "invalid Admin id" });
    }
    const admin = await Admin.findOne({ _id: req.params.id });
    if (!admin) {
      return res.error(400, { friendlyMsg: "Admin not found" });
    }
    await Admin.deleteOne({ _id: req.params.id });
    res.error(400, { friendlyMsg: "Admin deleted" });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ admin_email: email });

    if (!admin) {
      return res.error(400, {
        friendlyMsg: "Admin not found brat biz sizni tanimadik",
      });
    }
    const validPassword = bcrypt.compareSync(password, admin.admin_password);
    if (!validPassword) {
      return res.error(400, { friendlyMsg: "biz sizni topolmadik" });
    }

    const payload = {
      id: admin.id,
      admin_is_active: admin.admin_is_active,
      admin_is_creator: admin.admin_is_creator,
    };
    const tokens = jwt.generateTokens(payload);
    admin.admin_token = tokens.refreshToken;
    await admin.save();
    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: config.get("refresh_ms"),
      httpOnly: true,
    });

    res.ok(200, tokens);
  } catch (err) {
    res.error(400, { friendlyMsg: err.message });
  }
};

const logOutAdmin = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    let admin;
    if (!refreshToken) {
      return res.error(400, { friendlyMsg: "token topilmadi" });
    }
    admin = await Admin.findOneAndUpdate(
      { admin_token: refreshToken },
      { admin_token: "" },
      { new: true }
    );
    if (!admin) {
      return res.error(400, { friendlyMsg: "admin not found" });
    }
    res.clearCookie("refreshToken");
    res.ok(200, admin);
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const refreshAdminToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.error(400, { friendlyMsg: "token topilmadi" });
    }
    const adminDataFromDB = await Admin.findOne({ admin_token: refreshToken });
    const adminDataFromCookie = await jwt.verifyRefresh(refreshToken);
    if (!adminDataFromCookie || !adminDataFromDB) {
      return res.error(400, { friendlyMsg: "admin ro'yhatdan o'tmagan" });
    }
    const admin = await Admin.findById(adminDataFromCookie.id);
    if (!admin) {
      return res.error(400, { friendlyMsg: "id notogri" });
    }
    const payload = {
      id: admin.id,
      admin_is_active: admin.admin_is_active,
      admin_is_creator: admin.admin_is_creator,
    };
    const tokens = jwt.generateTokens(payload);
    admin.admin_token = tokens.refreshToken;
    await admin.save();
    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: config.get("refresh_ms"),
      httpOnly: true,
    });

    res.ok(200, tokens);
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

module.exports = {
  getAdmins,
  getAdmin,
  addAdmin,
  editAdmin,
  deleteAdmin,
  loginAdmin,
  logOutAdmin,
  refreshAdminToken,
};
