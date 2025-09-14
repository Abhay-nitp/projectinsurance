// const mongoose = require("mongoose");

// const InsuranceSchema = new mongoose.Schema({
//   vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true }, // Linked vehicle
//   owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Policy owner
//   policyNumber: { type: String, unique: true, required: true },
//   coverageType: { type: String, enum: ["basic", "comprehensive", "premium"], required: true },
//   startDate: { type: Date, required: true },
//   endDate: { type: Date, required: true },
//   status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
//   premiumAmount: { type: Number, required: true },
// }, { timestamps: true });



 const mongoose = require("mongoose");

// const InsuranceSchema = new mongoose.Schema({
//   vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true }, // Linked vehicle
//   owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Policy owner
//   fullName: { type: String, unique: false, required: true },
//   email: { type: String, unique: false, required: true },
//   phone: { type: String, unique: false, required: true },
//   policyNumber: { type: String },
//   coverageType: { type: String, enum: ["basic", "comprehensive", "premium"], required: true },
//   zipCode:{type:String},
//   startDate: { type: Date, required: true },
//   endDate: { type: Date, required: true },
//  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
//   premiumAmount: { type: Number, required: true },
// }, { timestamps: true });
// module.exports = mongoose.model("Insurance", InsuranceSchema);



const InsuranceSchema = new mongoose.Schema({
 // vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  policyNumber: { type: String, required: true, unique: true },
  coverage: { type: String, enum: ["basic", "comprehensive", "premium"], required: true },
  zipCode: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
 // status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
 // premiumAmount: { type: Number, required: true },
  status: { type: String, enum: ["active", "expired", "renewed"], default: "active" },
  renewalDate: { type: Date },
  vehicle:{type:String},
  planId:{type:mongoose.Schema.Types.ObjectId, ref : "Plan2",required:true},
  paymentMethod: { type: String, enum: ["creditCard", "Bank Transfer", "PayPal"], required: true },  // ✅ Added
  vehicleType: { type: String, required: true },  // ✅ Added
  vehicleAge: { type: Number, required: true },  // ✅ Added
  finalQuote: { type: Number, required: true }   // ✅ Added
}, { timestamps: true });

module.exports = mongoose.model("Insurance", InsuranceSchema);
