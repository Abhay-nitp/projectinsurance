// const mongoose = require("mongoose");

// const VehicleSchema = new mongoose.Schema({
//   user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   type: { type: String, required: true },
//   model: { type: String, required: true },
//   year: { type: Number, required: true },
//   registration_no: { type: String, unique: true, required: true },
// }, { timestamps: true });

// module.exports = mongoose.model("Vehicle", VehicleSchema);


const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Owner reference
  plateNumber: { type: String, unique: true, required: true },
  model: { type: String, required: true },
  make: { type: String, required: true },
  year: { type: Number, required: true },
  insuranceStatus: { type: String, enum: ["active", "expired", "pending"], default: "pending" },
}, { timestamps: true });

module.exports = mongoose.model("Vehicle", VehicleSchema);
