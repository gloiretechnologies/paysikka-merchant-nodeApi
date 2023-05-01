const mongoose = require("mongoose");

const TransactionSchema = mongoose.Schema({
  userid: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  grams: {
    type: Number,
    required: false,
  },
  transactionid: {
    type: String,
    required: false,
  },
  points: {
    type: Number,
    required: true,
  },
  rec_upi: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  mupi: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  vpa: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("transactions", TransactionSchema);
