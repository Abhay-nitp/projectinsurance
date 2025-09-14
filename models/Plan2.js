const mongoose = require("mongoose");

const PlanSchema = new mongoose.Schema({
    name: { type: String, required: true },
    coverage: { type: String, required: true },
    premium: { type: Number, required: true },
    duration: { type: Number, required: true }, // in years
    details: { type: String }
}, { timestamps: true });

const Plan = mongoose.model("Plan", PlanSchema);
module.exports = Plan;
