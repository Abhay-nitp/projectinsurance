// const express = require("express");
// const router = express.Router();
// const User = require("../models/User");
// const Policy = require("../models/Policy");
// const Vehicle = require("../models/Vehicle");
// const authMiddleware = require("../middleware/auth"); // If using JWT authentication

// // router.get("/user-dashboard", authMiddleware, async (req, res) => {
// //     try {
//         // Get user details
//         const user = await User.findById(req.user.id).select("-password"); // Exclude password
//         if (!user) return res.status(404).json({ message: "User not found" });
//  // Ensure user._id is an ObjectId before querying
//  const userId = new mongoose.Types.ObjectId(user._id);
//         // Get policies linked to the user
//         const policies = await Policy.find({ userId: new mongoose.Types.ObjectId(user._id)});
//         //const policy2 = await User.findById(req.user.id);

//         // Get vehicles linked to the user
//         const vehicles = await Vehicle.find({ userId: new mongoose.Types.ObjectId(user._id) });
        

//         res.json({ user, policies, vehicles });
//     } catch (error) {
//         console.error("Error fetching dashboard data:", error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User");
const Quote1 = require("../models/Quote1");
const Policy = require("../models/Policy");
const Insurance = require("../models/Insurance");
const Vehicle = require("../models/Vehicle");
const Claim = require("../models/Claim");
const authMiddleware = require("../middleware/auth");

router.get("/user-dashboard", authMiddleware, async (req, res) => {
    try {
        // Get user details
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        // Ensure user._id is an ObjectId before querying
        const userId = new mongoose.Types.ObjectId(user._id);
        //const userId = new mongoose.Types.ObjectId(req.user.id);
       // const userId = user._id; // Mongoose already stores _id as ObjectId

        // Ensure user._id is an ObjectId before querying
       // const claimId = new mongoose.Types.ObjectId(policy._id);

         
        // Get policies and vehicles linked to the user
        const policies = await Policy.find({ user_id: userId });
        const insurances = await Insurance.find({ owner: userId });
        const vehicles = await Vehicle.find({ owner: userId });
        // const claim = await Claim.find({ owner: userId });
        //const claims = await Claim.find({ policy_id: { $in: policies.map(p => p._id) } } && {owner: userId} );
        const claims = await Claim.find({ owner:userId} );
        const quotes = await Quote1.find({ userId:userId} );

        // Debugging logs
        // console.log("User:", user);
        // console.log("Policies:", policies);
        // console.log("Vehicles:", vehicles);

        res.json({ user, policies, vehicles ,claims,insurances,quotes});
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.put("/update-profile", authMiddleware, async (req, res) => {
    try {
        const { name, email ,phone} = req.body;
        
        // Validate input
        if (!name || !email) {
            return res.status(400).json({ message: "Name and email are required" });
        }

        // Update user profile
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { name, email ,phone},
            { new: true, runValidators: true } // Return updated user & validate fields
        ).select("-password"); // Exclude password from response

        if (!updatedUser) return res.status(404).json({ message: "User not found" });

        res.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});



const Plan = require("../models/Plan2");

// Get dashboard statistics
router.get("/dashboard/stats", async (req, res) => {
    try {
        const totalPolicies = await Insurance.countDocuments();
        const activeClaims = await Claim.countDocuments({ status: "Pending" });
        const pendingPolicies = await Insurance.countDocuments({ status: "pending" });

        const policyrejected = await Insurance.countDocuments({ status: "rejected" });

        const totalVehicles = await Vehicle.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalPlans = await Plan.countDocuments();

        const totalPolicyAmount = await Insurance.aggregate([
            { $group: { _id: null, totalAmount: { $sum: "$finalQuote" } } }
        ]);
        const totalAmountClaimed = await Claim.aggregate([
            { $group: { _id: null, totalClaimed: { $sum: "$claim_amount" } } }
        ]);

        res.json({
            totalPolicies,
            activeClaims,
            pendingPolicies,
            totalVehicles,
            totalUsers,
            totalPlans,
            policyrejected,
            totalPolicyAmount: totalPolicyAmount[0]?.totalAmount || 0,
            totalAmountClaimed: totalAmountClaimed[0]?.totalClaimed || 0
        });
    } catch (error) {
        res.status(500).json({ error: "Error fetching dashboard data" });
    }
});






// Route: Get Month-Wise Policy Issuance for Current Year
router.get('/insurance-trend', async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();

        const insuranceData = await Insurance.aggregate([
            {
                $match: { createdAt: { $gte: new Date(`${currentYear}-01-01`), $lt: new Date(`${currentYear + 1}-01-01`) } }
            },
            {
                $group: {
                    _id: { month: { $month: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.month": 1 } } // Ensure months are sorted correctly
        ]);

        // Convert numeric month values to labels (e.g., 1 -> "Jan", 2 -> "Feb")
        const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const formattedData = insuranceData.map(entry => ({
            month: monthLabels[entry._id.month - 1], // Convert month number to string
            count: entry.count
        }));

        res.json(formattedData);
    } catch (error) {
        res.status(500).json({ error: "Error fetching insurance trend data" });
    }
});



module.exports = router;
