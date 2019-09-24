const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// TODO: Why do we get this error message when unique: true is set as an option?
// DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
const UserSchema = new Schema({
  email: { type: String, default: "", required: true }, // unique: true
  username: { type: String, default: "", required: true }, // unique: true
  passwordHash: { type: String, default: "", required: true }
});

module.exports = mongoose.model("user", UserSchema);
