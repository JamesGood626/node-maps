const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// NOTE: Perhaps not all of these will necessarily be required?
const AddressSchema = new Schema({
  street: { type: String, default: "", required: true },
  city: { type: String, default: "", required: true },
  state: { type: String, default: "", required: true },
  zip: { type: String, default: "", required: true }
});

export default AddressSchema;
