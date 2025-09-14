const express = require("express");
const router = express.Router();
const Plan = require("../models/Plan2");

// Add a new plan
router.post("/add", async (req, res) => {
    try {
        const { name, coverage, premium, duration, details } = req.body;

        if (!name || !coverage || !premium || !duration) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newPlan = new Plan({ name, coverage, premium, duration, details });
        await newPlan.save();

        res.status(201).json({ message: "Plan added successfully", plan: newPlan });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

// Get all insurance plans
router.get("/plans", async (req, res) => {
    try {
        const plans = await Plan.find();
        res.json(plans);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

// Get a single plan by ID
router.get("/plans/:id", async (req, res) => {
    try {
        const plan = await Plan.findById(req.params.id);
        if (!plan) return res.status(404).json({ message: "Plan not found" });
        res.json(plan);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

router.delete('/plans/:id', async (req, res) => {
    try {
        const deletedPlan = await Plan.findByIdAndDelete(req.params.id);
        if (!deletedPlan) {
            return res.status(404).json({ message: 'Plan not found' });
        }
        res.json({ message: 'Plan deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete plan' });
    }
});

// router.put("/plans/:id", async (req, res) => {
//     const { id } = req.params;
//     const { name, coverage, premium, duration } = req.body;

//     try {
//         const updatedPlan = await Plan.findByIdAndUpdate(
//             id,
//             { name, coverage, premium, duration },
//             { new: true } // Return updated plan
//         );

//         if (!updatedPlan) {
//             return res.status(404).json({ error: "Plan not found" });
//         }

//         res.json(updatedPlan);
//     } catch (error) {
//         console.error("Error updating plan:", error);
//         res.status(500).json({ error: "Server error" });
//     }
// });

router.put('/plans/:id', async (req, res) => {
    try {
        const updatedPlan = await Plan.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedPlan) {
            return res.status(404).json({ message: 'Plan not found' });
        }
        res.json(updatedPlan);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update plan' });
    }
});

module.exports = router;
