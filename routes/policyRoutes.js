const express = require("express");
const router = express.Router();
const Insurance = require("../models/Insurance");
const Policy = require("../models/Policy");

// ✅ Fetch all policies from MongoDB
router.get("/", async (req, res) => {
    try {
        const insurances = await Insurance.find();
        //const policies = await Policy.find().populate("user_id vehicle_id");

        //const allPolicies = [...insurances, ...policies];

        res.json(insurances);
    } catch (error) {
        res.status(500).json({ error: "Error fetching policies", details: error.message });
    }
});


// Update policy by ID
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const updatedPolicy = await Insurance.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedPolicy) {
            return res.status(404).json({ message: "Policy not found" });
        }

        res.json(updatedPolicy);
    } catch (error) {
        console.error("Error updating policy:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// module.exports = router;

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Received delete request for policy ID:", id); // ✅ Debugging log

        // if (!mongoose.Types.ObjectId.isValid(id)) {
        //     console.log("Invalid ObjectId:", id); // ✅ Debugging log
        //     return res.status(400).json({ message: "Invalid policy ID" });
        // }

        const deletedPolicy = await Insurance.findByIdAndDelete(id);
        if (!deletedPolicy) {
            console.log("Policy not found:", id); // ✅ Debugging log
            return res.status(404).json({ message: "Policy not found" });
        }

        console.log("Policy deleted successfully:", deletedPolicy); // ✅ Debugging log
        res.json({ success: true, message: "Policy deleted successfully", data: deletedPolicy });
    } catch (error) {
        console.error("Error deleting policy:", error); // ✅ Log full error
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
