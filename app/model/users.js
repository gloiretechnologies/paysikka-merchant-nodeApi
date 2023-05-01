const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

const schema = new mongoose.Schema(
  {
    merchantid: Number,
    merchantname: {
      type: String,
      required: true,
    },
    merchantemail: {
      type: String,
      required: true,
    },
    merchantnumber: {
      type: Number,
      required: true,
      integer: true,
    },
    merchantlogo: {
      type: String,
    },
    businessname: {
      type: String,
      required: true,
    },
    merchantpan: {
      type: String,
      required: true,
    },
    merchantaadhar: {
      type: String,
      required: true,
    },
    merchantimage: {
      type: String,
    },
    merchantwhatsappnumber: {
      type: Number,
      required: true,
      integer: true,
    },
    gstnumber: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    upiid: {
      type: String,
    },
    Qrcode: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "SM",
      required: true,
    },
    smid: {
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

schema.plugin(autoIncrement, { inc_field: "merchantid" });
const users = mongoose.model("merchant_users", schema);

module.exports = users;
