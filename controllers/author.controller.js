const mongoose = require("mongoose");
const Author = require("../models/Author");
const jwt = require("../services/JwtService");
const mailService = require("../services/MailService");
const config = require("config");
const bcrypt = require("bcrypt");
const ApiError = require("../errors/ApiError");

const getAuthors = async (req, res) => {
  try {
    const allAuthor = await Author.find({});
    res.ok(200, allAuthor);
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const getAuthor = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.error(400, { friendlyMsg: "invalid Author id" });
    }
    const author = await Author.findOne({ _id: req.params.id });
    if (!author) {
      return res.error(400, { friendlyMsg: "Author  not found" });
    }
    res.ok(200, author);
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const addAuthor = async (req, res) => {
  try {
    const {
      author_first_name,
      author_last_name,
      author_nick_name,
      author_email,
      author_phone,
      author_password,
      author_info,
      author_position,
      author_photo,
      is_expert,
    } = req.body;
    if (await Author.findOne({ author_nick_name: author_nick_name })) {
      return res.error(400, { friendlyMsg: "nick name already bor" });
    }
    if (await Author.findOne({ author_phone: author_phone })) {
      return res.error(400, { friendlyMsg: "phone already bor" });
    }
    if (await Author.findOne({ author_email: author_email  })) {
      return res.error(400, { friendlyMsg: "email already bor" });
    }
    const authorHashedPassword = bcrypt.hashSync(author_password, 7);

    const newAuthor = await Author({
      author_first_name,
      author_last_name,
      author_nick_name,
      author_email,
      author_phone,
      author_password: authorHashedPassword,
      author_info,
      author_position,
      author_photo,
      is_expert,
    });
    await newAuthor.save();
    await mailService.sendMessage(
      author_email,
      "Sizning so'rov qabul qilindi. Javobimizni kuting"
    );

    const payload = {
      id: newAuthor.id,
      is_active: newAuthor.author_is_active,
    };
    const tokens = jwt.generateTokens(payload);
    newAuthor.author_token = tokens.refreshToken;
    await newAuthor.save();
    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: config.get("refresh_ms"),
      httpOnly: true,
    });

    res.ok(200, { ...tokens, author: payload });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const editAuthor = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.error(400, { friendlyMsg: "invalid Author id" });
    }
    const author = await Author.findOne({ _id: req.params.id });
    if (!author) {
      return res.error(400, { friendlyMsg: "Author not found" });
    }

    const {
      author_first_name,
      author_last_name,
      author_nick_name,
      author_email,
      author_phone,
      author_password,
      author_info,
      author_position,
      author_photo,
      is_expert,
    } = req.body;
    let expert;
    if (is_expert) {
      expert = true;
    } else {
      expert = false;
    }
    const authorHashedPassword = bcrypt.hashSync(author_password, 7);

    await Author.updateOne(
      { _id: req.params.id },
      {
        author_first_name,
        author_last_name,
        author_nick_name,
        author_email,
        author_phone,
        author_password: authorHashedPassword,
        author_info,
        author_position,
        author_photo,
        is_expert,
      }
    );
    res.ok(200, { friendlyMsg: "Author updated" });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const deleteAuthor = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.error(400, { friendlyMsg: "invalid Author id" });
    }
    const author = await Author.findOne({ _id: req.params.id });
    if (!author) {
      return res.error(400, { friendlyMsg: "Author not found" });
    }
    if (req.author.id !== req.params.id) {
      return ApiError.unauthorized(res,{friendlyMsg:"Bunday huquq yo'q sizda"})
    }
    await Author.deleteOne({ _id: req.params.id });
    res.ok(200, { friendlyMsg: "Author deleted" });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const loginAuthor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const author = await Author.findOne({ author_email: email });

    if (!author) {
      return res.error(400, {
        friendlyMsg: "author not found brat biz sizni tanimadik",
      });
    }
    const validPassword = bcrypt.compareSync(password, author.author_password);
    if (!validPassword) {
      return res.error(400, { friendlyMsg: "biz sizni topolmadik" });
    }

    const payload = {
      id: author.id,
      author_is_active: author.author_is_active,
    };
    const tokens = jwt.generateTokens(payload);
    author.author_token = tokens.refreshToken;
    await author.save();
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

const logOutAuthor = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    let author;
    if (!refreshToken) {
      return res.error(400, { friendlyMsg: "token topilmadi" });
    }
    author = await Author.findOneAndUpdate(
      { author_token: refreshToken },
      { author_token: "" },
      { new: true }
    );
    if (!author) {
      return res.error(400, { friendlyMsg: "author not found" });
    }
    res.clearCookie("refreshToken");
    res.ok(200, author);
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const refreshAuthorToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.error(400, { friendlyMsg: "token topilmadi" });
    }
    const authorDataFromDB = await Author.findOne({
      author_token: refreshToken,
    });
    const authorDataFromCookie = await jwt.verifyRefresh(refreshToken);
    if (!authorDataFromCookie || !authorDataFromDB) {
      return res.error(400, { friendlyMsg: "author ro'yhatdan o'tmagan" });
    }
    const author = await Author.findById(authorDataFromCookie.id);
    if (!author) {
      return res.error(400, { friendlyMsg: "id notogri" });
    }
    const payload = {
      id: author.id,
      author_is_active: author.author_is_active,
    };
    const tokens = jwt.generateTokens(payload);
    author.author_token = tokens.refreshToken;
    await author.save();
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
  getAuthors,
  getAuthor,
  addAuthor,
  editAuthor,
  deleteAuthor,
  loginAuthor,
  logOutAuthor,
  refreshAuthorToken,
};
