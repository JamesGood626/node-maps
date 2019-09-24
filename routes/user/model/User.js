const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: { type: String, default: "", required: true, unique: true },
  username: { type: String, default: "", required: true, unique: true },
  passwordHash: { type: String, default: "", required: true }
});

module.exports = mongoose.model("user", UserSchema);
