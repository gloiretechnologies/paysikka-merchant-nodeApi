const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

const RechargeSchema = mongoose.Schema({
  rechargeid: Number,
  circleCode: {
    type: String,
    required: true,
  },
  operatorCode: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: Number,
    required: false,
  },
  mobileNumber: {
    type: Number,
    required: true,
    min: 10,
  },
  type: {
    type: String,
    required: true,
  },
});
RechargeSchema.plugin(autoIncrement, { inc_field: "rechargeid" });
const Recharge = mongoose.model("Recharge", RechargeSchema);
module.exports = Recharge;
