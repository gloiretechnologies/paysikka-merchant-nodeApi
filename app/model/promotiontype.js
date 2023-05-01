const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

const schema = new mongoose.Schema(
  {
    promotionid: Number,
    promotiontype: {
      type: String,
      required: true,
    },
    status: {
      type: Number,
      default: 1,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

schema.plugin(autoIncrement, { inc_field: "promotionid" });
const promotiontype = mongoose.model("promotiontype", schema);

module.exports = promotiontype;
