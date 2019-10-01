const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentReplySchema = new Schema({
  text: { type: String, default: "", required: true },
  user: { type: "ObjectId", ref: "User" },
  createdAt: { type: Date, default: "", required: true },
  updatedAt: { type: Date, default: "", required: true }
});

const CommentSchema = new Schema({
  text: { type: String, default: "", required: true },
  user: { type: "ObjectId", ref: "User" },
  createdAt: { type: Date, default: "", required: true },
  updatedAt: { type: Date, default: "", required: true },
  replies: [CommentReplySchema]
});

module.exports = {
  CommentSchema,
  Comment: mongoose.model("comment", CommentSchema)
}
