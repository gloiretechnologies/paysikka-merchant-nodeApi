const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

const schema = new mongoose.Schema(
  {
    collectedwalletid: Number,
    merchantid: {
      type: Number,
      required: true,
      integer: true,
    },
    points: {
      type: Number,
      required: true,
      integer: true,
    },
  },
  { timestamps: true }
);

schema.plugin(autoIncrement, { inc_field: "collectedwalletid" });

const collectedwallet = mongoose.model("merchant_collected_wallets", schema);

module.exports = collectedwallet;
