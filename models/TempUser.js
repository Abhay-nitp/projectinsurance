const mongoose = require("mongoose");

const TempUserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    phone: String,
    password: String,
    createdAt: { type: Date, default: Date.now, expires: 3600 } // Auto-delete after 1 hour
});

module.exports = mongoose.model("TempUser", TempUserSchema);
