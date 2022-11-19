const User = require("../models/User");
const Admin = require("../models/Admin");
const Author = require("../models/Author");
const ApiError = require("../errors/ApiError");
const bcrypt = require("bcryptjs");
const generatePassword = require("generate-password");
const mailService = require("../services/MailService");

const ForgotPassAndSendNew = async (req, res) => {
  try {
    const email = req.body.email;

    const password = generatePassword.generate({
      length: 10,
      numbers: true,
      symbols: false,
    });
    console.log(password);

    const UserHashedPassword = bcrypt.hashSync(password, 7);

    if (req.baseUrl == "/user/forgot") {
      const user = await User.findOne({ user_email: email });
      if (!user) {
        return res.error(400, { friendlyMsg: "user not found" });
      }
      user.user_password = UserHashedPassword;
      await user.save();
    }
    if (req.baseUrl == "/author/forgot") {
      const author = await Author.findOne({ author_email: email });
      if (!author) {
        return res.error(400, { friendlyMsg: "author not found" });
      }
      author.author_email = UserHashedPassword;
      await author.save();
    }
    if (req.baseUrl == "/admin/forgot") {
      const admin = await Admin.findOne({ admin_email: email });
      if (!admin) {
        return res.error(400, { friendlyMsg: "admin not found" });
      }
      admin.admin_password = UserHashedPassword;
      await admin.save();
    }
    await mailService.sendNewPassword(email, password);

    res.ok(200, "Yangi password gmail manzilingizga yuborildi");
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};



module.exports = {
  ForgotPassAndSendNew,
};
