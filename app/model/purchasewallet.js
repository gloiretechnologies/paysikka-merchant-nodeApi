const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

const schema = new mongoose.Schema(
  {
    purchasewalletid: Number,
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

schema.plugin(autoIncrement, { inc_field: "purchasewalletid" });

const purchasewallet = mongoose.model("merchant_purchase_wallet", schema);

module.exports = purchasewallet;
