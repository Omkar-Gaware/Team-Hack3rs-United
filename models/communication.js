const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const communication = new Schema({
    name: {
      type: String,
      required: true, // Ensure name is required
    },
    phone: {
      type: String,
      required: true, // Ensure phone number is saved
    }
  });

  const commu = mongoose.model("commu", communication);
  module.exports = commu;