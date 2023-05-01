const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

const schema = new mongoose.Schema(
  {
    otpid: Number,
    mobile: {
      type: Number,
      required: true,
      integer: true,
    },
    code: {
      type: Number,
      required: true,
      integer: true,
    },
    category: {
      type: String,
      required: true,
      default: "merchant",
    },
  },
  { timestamps: true }
);

schema.plugin(autoIncrement, { inc_field: "otpid" });

const otpcodes = mongoose.model("otpcodes", schema);

module.exports = otpcodes;
