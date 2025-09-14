const mongoose = require("mongoose");

const PolicySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  vehicle_id: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
  policy_type: { type: String, enum: ["third-party", "comprehensive"], required: true },
  premium: { type: Number, required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Policy", PolicySchema);
