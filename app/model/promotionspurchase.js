const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

const schema = mongoose.Schema(
  {
    promotionpurchaseid: Number,
    merchantid: {
      type: Number,
      required: true,
    },
    paymentid: {
      type: Number,
      required: true,
    },
    packageid: {
      type: Number,
      required: true,
    },
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
    status: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

schema.plugin(autoIncrement, { inc_field: "promotionpurchaseid" });
const promotionpurchases = mongoose.model("promotionspurchases", schema);
module.exports = promotionpurchases;
