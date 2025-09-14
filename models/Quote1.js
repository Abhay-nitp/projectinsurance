const mongoose = require("mongoose");

//const mongoose = require("mongoose");

const QuoteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vehicleType: { type: String, required: true },
    vehicleAge: { type: Number, required: true },
    coverageType: { type: String, required: true },
    zipCode: { type: String, required: true },
    finalQuote: { type: Number, required: true },
    plate:{type:String,required:true},
    planid: { type: mongoose.Schema.Types.ObjectId, ref: "Plan2", required: true },

    createdAt: { type: Date, default: Date.now }
});

//module.exports = mongoose.model("Quote", QuoteSchema);


module.exports = mongoose.model("Quote", QuoteSchema);
