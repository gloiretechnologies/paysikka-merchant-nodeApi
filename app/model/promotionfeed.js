const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

const schema = mongoose.Schema(
  {
    promotionfeedid: Number,
    merchantid: {
      type: Number,
      required: true,
    },
    promotionid: {
      type: Number,
      required: true,
    },
    packageid: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

schema.plugin(autoIncrement, { inc_field: "promotionfeedid" });
const promotiofeed = mongoose.model("promotionfeeds", schema);
module.exports = promotiofeed;
