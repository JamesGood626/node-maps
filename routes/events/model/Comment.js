const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  text: { type: String, default: "", required: true },
  user: { type: "ObjectId", ref: "User" },
  createdAt: { type: Date, default: "", required: true },
  updatedAt: { type: Date, default: "", required: true },
  // The rabbit hole gets deeper... will this even work?
  replies: [CommentSchema]
});

export default CommentSchema;
