const mongoose = require("mongoose");

const ClaimSchema = new mongoose.Schema({
  policy_id: { type: mongoose.Schema.Types.ObjectId, ref: "Insurance", required: true },
   owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  claim_reason: { type: String, required: true },
  claim_amount: { type: Number, required: true },
  claim_status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  documents: { type: String, required: true }, // Store document URL
}, { timestamps: true });

module.exports = mongoose.model("Claim", ClaimSchema);
