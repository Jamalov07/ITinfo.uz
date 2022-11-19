const User = require("../models/User");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("../services/JwtService");
const config = require("config");
const ApiError = require("../errors/ApiError");
const uuid = require("uuid");
const mailService = require("../services/MailService");
const generatePassword = require("generate-password");

const getUsers = async (req, res) => {
  try {
    const allUser = await User.find({});
    res.ok(200, allUser);
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const getUser = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.error(400, { friendlyMsg: "invalid User id" });
    }
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.error(400, { friendlyMsg: "User  not found" });
    }
    res.ok(200, user);
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const addUser = async (req, res) => {
  try {
    const { user_name, user_email, user_password, user_info, user_photo } =
      req.body;
    const UserHashedPassword = bcrypt.hashSync(user_password, 7);
    const user_activation_link = uuid.v4();

    const newUser = await User({
      user_name,
      user_email,
      user_password: UserHashedPassword,
      user_info,
      user_photo,
      user_activation_link,
    });
    await newUser.save();
    await mailService.sendActivationMail(
      user_email,
      `${config.get("api_url")}/user/activate/${user_activation_link}`
    );
    const payload = {
      id: newUser.id,
      is_active: newUser.user_is_active,
    };
    const tokens = jwt.generateTokens(payload);
    newUser.user_token = tokens.refreshToken;
    await newUser.save();
    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: config.get("refresh_ms"),
      httpOnly: true,
    });

    res.ok(200, { ...tokens, user: payload });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const editUser = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.error(400, { friendlyMsg: "invalid User id" });
    }
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.error(400, { friendlyMsg: "User not found" });
    }

    const {
      user_name,
      user_email,
      user_password,
      user_info,
      user_photo,
      user_is_active,
    } = req.body;
    const UserHashedPassword = bcrypt.hashSync(user_password, 7);
    await User.updateOne(
      { _id: req.params.id },
      {
        user_name,
        user_email,
        user_password: UserHashedPassword,
        user_info,
        user_photo,
        user_is_active,
      }
    );
    res.ok(200, { friendlyMsg: "User updated" });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.error(400, { friendlyMsg: "invalid User id" });
    }
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.error(400, { friendlyMsg: "User not found" });
    }
    await User.deleteOne({ _id: req.params.id });
    res.ok(200, { friendlyMsg: "User deleted" });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ user_email: email });

    if (!user) {
      return res
        .status(400)
        .send({ friendlyMsg: "User not found brat biz sizni tanimadik" });
    }
    const validPassword = bcrypt.compareSync(password, user.user_password);
    if (!validPassword) {
      return res.error(400, { friendlyMsg: "biz sizni topolmadik" });
    }
    const payload = {
      id: user.id,
      is_active: user.user_is_active,
    };
    const tokens = jwt.generateTokens(payload);
    user.user_token = tokens.refreshToken;
    await user.save();
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

const logOutUser = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    let user;
    if (!refreshToken) {
      return res.error(400, { friendlyMsg: "token topilmadi" });
    }
    user = await User.findOneAndUpdate(
      { user_token: refreshToken },
      { user_token: "" },
      { new: true }
    );
    if (!user) {
      return res.error(400, { friendlyMsg: "user not found" });
    }
    res.clearCookie("refreshToken");
    res.ok(200, user);
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const refreshUserToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.error(400, { friendlyMsg: "token topilmadi" });
    }
    const userDataFromDB = await User.findOne({ user_token: refreshToken });
    const userDataFromCookie = await jwt.verifyRefresh(refreshToken);
    if (!userDataFromCookie || !userDataFromDB) {
      return res.error(400, { friendlyMsg: "user ro'yhatdan o'tmagan" });
    }
    const user = await User.findById(userDataFromCookie.id);
    if (!user) {
      return res.error(400, { friendlyMsg: "id notogri" });
    }
    const payload = {
      id: user.id,
      is_active: user.user_is_active,
    };
    const tokens = jwt.generateTokens(payload);
    user.user_token = tokens.refreshToken;
    await user.save();
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

const userActivation = async (req, res) => {
  try {
    const link = req.params.link;
    const user = await User.findOne({ user_activation_link: link });
    if (!user) {
      return res.error(400, { friendlyMsg: "invalid link" });
    }
    if (user.user_is_active) {
      return res.error(400, { friendlyMsg: "user allaqachon active bo'lgan" });
    }
    user.user_is_active = true;
    await user.save();
    res.ok(200, "user activated");
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};


module.exports = {
  getUsers,
  getUser,
  addUser,
  editUser,
  deleteUser,
  loginUser,
  logOutUser,
  refreshUserToken,
  userActivation,
}
