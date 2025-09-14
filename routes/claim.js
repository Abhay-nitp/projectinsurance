const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Claim = require('../models/Claim');  // Import the Claim model
const Policy = require('../models/Policy');  // Import the Policy model

const authMiddleware = require("../middleware/auth");
const Insurance = require('../models/Insurance');

router.post('/',authMiddleware, async (req, res) => {
    try {
        const { policy_id, claim_reason, claim_amount, claim_status, documents } = req.body;
        console.log("Received policy_id:", policy_id);

        // Convert policy_id to ObjectId
        if (!mongoose.Types.ObjectId.isValid(policy_id)) {
            return res.status(400).json({ message: 'Invalid policy_id format',received_body: user_id });
        }

        // Check if the policy_id exists in the Policy collection
       const policy = await Insurance.findById(policy_id);
       // const policy = await Policy.findById(user_id);
        if (!policy) {
            return res.status(404).json({ message: 'Policy not found' });
        }

        // Create a new Claim document
        const newClaim = new Claim({
            policy_id:  new mongoose.Types.ObjectId(policy_id),  // Use the converted ObjectId
            owner:req.user.id,
            claim_reason,
            claim_amount,
            claim_status,
            documents
        });

        await newClaim.save();  // Save the claim to the database
        
        res.status(201).json({ message: 'Claim submitted successfully', claim: newClaim });
    } catch (error) {
        console.error("Error submitting claim:", error);
        res.status(500).json({ message: 'Error submitting claim', error: error.message });
    }
});
// Get all claims (Admin only)
router.get("/", authMiddleware, async (req, res) => {
    try {
        const claims = await Claim.find();
        res.json(claims);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});
// // Update claim status (Admin only)
// router.put("/admin/claims/:id", authMiddleware, async (req, res) => {
//     try {
//         const { status } = req.body;
//         const claim = await Claim.findById(req.params.id);

//         if (!claim) {
//             return res.status(404).json({ message: "Claim not found" });
//         }

//         claim.status = status;
//         await claim.save();

//         res.json({ message: "Claim updated successfully", claim });
//     } catch (error) {
//         res.status(500).json({ message: "Server Error", error });
//     }
// });

router.put("/admin/claims/:id", async (req, res) => {
    try {
        // Find the claim first
        const claim = await Claim.findById(req.params.id);
        if (!claim) {
            return res.status(404).json({ message: "Claim not found" });
        }

        // Update only claim_status (Keep existing owner)
        claim.claim_status = req.body.claim_status;
        await claim.save();

        res.json({ message: "Claim status updated successfully" });
    } catch (error) {
        console.error("Error updating claim:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

module.exports = router;  // Export the router to use in server.js
