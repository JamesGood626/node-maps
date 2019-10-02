const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AddressSchema = require("./Address");
const { CommentSchema } = require("./Comment");

// NOTE: Dates must be updated like so in order to be
// successfully persisted:
// var Assignment = mongoose.model('Assignment', { dueDate: Date });
// Assignment.findOne(function (err, doc) {
//   doc.dueDate.setMonth(3);
//   doc.save(callback); // THIS DOES NOT SAVE YOUR CHANGE

//   doc.markModified('dueDate');
//   doc.save(callback); // works
// })

// Example populating referenced Model
// const bookSchema = new Schema({
//   title: 'String',
//   author: { type: 'ObjectId', ref: 'Person' }
// });
// const Book = mongoose.model('Book', bookSchema);

// // By default, Mongoose will add `author` to the below `select()`.
// await Book.find().select('title').populate('author');

// // In other words, the below query is equivalent to the above
// await Book.find().select('title author').populate('author');

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  }
});

const EventSchema = new Schema({
  name: { type: String, default: "", required: true },
  address: AddressSchema,
  location: {
    type: pointSchema,
    required: true
  },
  // latitude: { type: Number, default: "", required: true },
  // longitude: { type: Number, default: "", required: true },
  comments: [CommentSchema],
  // tags <- reference Tag or were we running w/ [Tags]
  user: { type: "ObjectId", ref: "User" },
  eventDate: { type: Date, default: "", required: true },
  createdAt: { type: Date, default: "", required: true },
  updatedAt: { type: Date, default: "", required: true }
});

module.exports = mongoose.model("event", EventSchema);
