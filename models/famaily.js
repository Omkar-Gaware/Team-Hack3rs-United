const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FamilySchema = new Schema({
  relation: {
    type: String,
    required: true, // Ensure relation is required
  },
  name: {
    type: String,
    required: true, // Ensure name is required
  },
  phone: {
    type: String,
    required: true, // Ensure phone number is saved
  }
});

const Family = mongoose.model("Family", FamilySchema);
module.exports = Family;
