const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

const schema = new mongoose.Schema(
  {
    merchantbankdetailsid: Number,
    merchantid: Number,
    accountnumber: {
      type: Number,
      required: true,
      integer: true,
    },
    confirmaccountnumber: {
      type: Number,
      required: true,
      integer: true,
    },
    bankname: {
      type: String,
      required: true,
    },
    ifsccode: {
      type: String,
      required: true,
    },
    primary: {
      type: Number,
      default: 0,
      integer: true,
    },
    status: {
      type: Number,
      default: 1,
      integer: true,
    },
  },
  { timestamps: true }
);

schema.plugin(autoIncrement, { inc_field: "merchantbankdetailsid" });

const merchantBankDetails = mongoose.model("merchant_bank_details", schema);

module.exports = merchantBankDetails;
