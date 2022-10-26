const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    user_name: {
      type: String,
      required: true,
    },
    user_email: {
      type: String,
        required: true,
      lowercase:true
    },
    user_password: {
      type: String,
      required: true,
    },
    user_info: {
      type:String,
      required: true,
    },
    user_photo: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = model("User", userSchema);
