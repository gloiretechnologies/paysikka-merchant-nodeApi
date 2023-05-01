const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

const schema = mongoose.Schema(
  {
    packageid: Number,
    promotionid: {
      type: Number,
      required: true,
    },
    validity: {
      type: Number,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    include1: {
      type: Number,
    },
    include2: {
      type: Number,
    },
    include3: {
      type: Number,
    },
    status: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

schema.plugin(autoIncrement, { inc_field: "packageid" });
const promotionpackage = mongoose.model("promotionpackages", schema);
module.exports = promotionpackage;
