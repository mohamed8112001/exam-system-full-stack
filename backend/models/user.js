const { Schema, model } = require("mongoose");

const bcrypt = require("bcrypt");
const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 100,
    },
    password_hash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["student", "admin"],
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (this.isModified("password_hash")) {
    const salt = await bcrypt.genSalt(10);
    this.password_hash = await bcrypt.hash(this.password_hash, salt);
  }
  next();
});

module.exports = model("User", UserSchema);
