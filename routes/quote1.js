const express = require("express");
const router = express.Router();
const Quote = require("../models/Quote1");
const authMiddleware = require("../middleware/auth"); // If using JWT authentication
// @route   POST /api/quote
// @desc    Save quote request & return estimated price
router.post("/", authMiddleware,async (req, res) => {
    try {
        const {vehicleType, vehicleAge, coverageType, zipCode, finalQuote ,plate ,planid } = req.body;
        if (!vehicleType || !vehicleAge || !coverageType || !zipCode || !finalQuote  ||!plate ||!planid) {
            return res.status(400).json({ message: "All fields are required." });
        }
        // Base price logic
        // let basePrice = 0;
        // if (vehicleType === "car") basePrice = 500;
        // else if (vehicleType === "bike") basePrice = 300;
        // else if (vehicleType === "truck") basePrice = 700;

        // let ageFactor = vehicleAge < 3 ? 0.9 : 1.2;
        // let coverageFactor = coverage === "basic" ? 1 : coverage === "standard" ? 1.5 : 2;
        // let finalQuote = basePrice * ageFactor * coverageFactor;

        // Save quote in DB
        const newQuote = new Quote({
            userId : req.user.id,
            vehicleType,
            vehicleAge,
            coverageType,
            zipCode,
            plate,
            planid,
            finalQuote
        });
        await newQuote.save();

        res.json({ estimatedPrice: finalQuote, message: "Quote saved successfully!" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// router.get("/", async (req, res) => {
//     try {
//         const quotes = await Quote.findById(req.user.id);
//         res.json(quotes);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching quotes", error: error.message });
//     }
// });

router.get("/:userId", async (req, res) => {
    try {
        const quoteId = req.query.quoteId;
        const policy = await Quote.findOne({ quoteId })
        .sort({ createdAt: -1 })
        .limit(1);
        
        if (!policy) {
            return res.status(404).json({ message: "Policy not found" });
        }
        res.json(policy);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

router.get("quote/:userId", async (req, res) => {
    try {
        
        const policy = await Quote.findOne({ userId:req.user.id })
        .sort({ createdAt: -1 })
        .limit(1);
        
        if (!policy) {
            return res.status(404).json({ message: "Policy not found" });
        }
        res.json(policy);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});





router.delete("/:id", async (req, res) => {
    try {
        const deletedQuote = await Quote.findByIdAndDelete(req.params.id);
        if (!deletedQuote) {
            return res.status(404).json({ message: "Quote not found" });
        }
        res.json({ message: "Quote deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete quote" });
    }
});

module.exports = router;
