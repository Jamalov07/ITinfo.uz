const mongoose = require("mongoose");
const Author = require("../models/Author");
const {
  authorValidation,
  phoneValidator,
  emailValidator,
} = require("../validations/author");
const bcrypt = require("bcrypt");

const errorHandler = (res, error) => {
  res.status(500).send(error);
};

const getAuthors = async (req, res) => {
  try {
    const allAuthor = await Author.find({});
    res.status(200).send(allAuthor);
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAuthor = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "invalid Author id" });
    }
    const author = await Author.findOne({ _id: req.params.id });
    if (!author) {
      return res.status(400).send({ message: "Author  not found" });
    }
    res.status(200).send(author);
  } catch (error) {
    errorHandler(res, error);
  }
};

const addAuthor = async (req, res) => {
  try {
    const { error, value } = authorValidation(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
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
    } = value;

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
    res.status(200).send({ message: "Author added" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const editAuthor = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "invalid Author id" });
    }
    const author = await Author.findOne({ _id: req.params.id });
    if (!author) {
      return res.status(400).send({ message: "Author not found" });
    }
    const { error, value } = authorValidation(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
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
    } = value;
    let expert;
    if (is_expert) {
      expert = true;
    } else {
      expert = false;
    }
    await Author.updateOne(
      { _id: req.params.id },
      {
        author_first_name: author_first_name || author.author_first_name,
        author_last_name: author_last_name || author.author_last_name,
        author_nick_name: author_nick_name || author.author_nick_name,
        author_email: author_email || author.author_email,
        author_phone: author_phone || author.author_phone,
        author_password: author_password || author.author_password,
        author_info: author_info || author.author_info,
        author_position: author_position || author.author_position,
        author_photo: author_photo || author.author_photo,
        is_expert: expert,
      }
    );
    res.status(200).send({ message: "Author updated" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteAuthor = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "invalid Author id" });
    }
    const author = await Author.findOne({ _id: req.params.id });
    if (!author) {
      return res.status(400).send({ message: "Author not found" });
    }
    await Author.deleteOne({ _id: req.params.id });
    res.status(200).send({ message: "Author deleted" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const loginAuthor = async (req, res) => {
  try {
    const { login, password } = req.body;
    let author;
    const { error } = phoneValidator({ login });
    if (error) {
      const { error } = emailValidator({ login });
      if (error) {
        author = await Author.findOne({ author_nick_name: login });
      } else {
        author = await Author.findOne({ author_email: login });
      }
    } else {
      author = await Author.findOne({ author_phone: login });
    }

    if (!author) {
      return res
        .status(400)
        .send({ message: "author not found brat biz sizni tanimadik" });
    }
    const validPassword = bcrypt.compareSync(password, author.author_password);
    if (!validPassword) {
      return res.status(400).send({ message: "biz sizni topolmadik" });
    }
    res
      .status(200)
      .send({ message: `Hush kelibsiz ${author.author_first_name}` });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  getAuthors,
  getAuthor,
  addAuthor,
  editAuthor,
  deleteAuthor,
  loginAuthor,
};
