const express = require("express");
const authMiddleware = require("../middleware/auth");
const Insurance = require("../models/Insurance");
const Vehicle = require("../models/Vehicle");

const router = express.Router();

// Function to generate a unique policy number
const generatePolicyNumber = () => "POL" + Math.floor(100000 + Math.random() * 900000);


// // Create a new policy
// router.post("/create", async (req, res) => {
//     try {
//         const policy = new Insurance(req.body);
//         await policy.save();
//         res.status(201).json({ message: "Policy created successfully", policy });
//     } catch (error) {
//         res.status(500).json({ message: "Error saving policy", error });
//     }
// });

// module.exports = router;

// @route   POST /api/insurance
// @desc    Buy insurance for a vehicle (Customer only)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { fullName, email, paymentMethod, phone, coverage, finalQuote, vehicleAge, vehicleType, zipCode,vehicle,planId, } = req.body;
    const startDate = new Date(); // Current date as the policy start date
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1); // Set expiration to 1 year from now
    
    // Create insurance policy
    const insurance = new Insurance({
      fullName,
      email,
      phone,
      owner: req.user.id,
      planId,
      policyNumber: generatePolicyNumber(),
      coverage,
      vehicleType,
      vehicleAge,
      paymentMethod,
      finalQuote,
      zipCode,
      vehicle,
      startDate,
      endDate
    });

    await insurance.save();
    res.status(201).json({ message: "Insurance request submitted", insurance });

  } catch (error) {
    console.error("Error:", error);  //Log the error for debugging
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});


// @route   GET /api/insurance
// @desc    Get all insurance policies (Only for logged-in users)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const insurances = await Insurance.find({ owner: req.user.id }); // Fetch only user's insurance
    res.json(insurances);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});



router.get("/latest", authMiddleware,async (req, res) => {
  try {
      const latestPolicy = await Insurance.findOne({owner: req.user.id})
      .sort({ createdAt: -1 })
      .limit(1);; // Get the latest policy
      if (!latestPolicy) {
          return res.status(404).json({ message: "No policies found" });
      }
      res.json(latestPolicy);
  } catch (error) {
      res.status(500).json({ message: "Server Error", error });
  }
});


// @route   PUT /api/insurance/:id/approve
// @desc    Approve an insurance policy (Admin only)
router.put("/:id/approve", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

    const insurance = await Insurance.findById(req.params.id);
    if (!insurance) return res.status(404).json({ message: "Insurance not found" });

    insurance.status = "approved";
    await insurance.save();
    res.json({ message: "Insurance approved", insurance });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// @route   PUT /api/insurance/:id/reject
// @desc    Reject an insurance policy (Admin only)
router.put("/:id/reject", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

    const insurance = await Insurance.findById(req.params.id);
    if (!insurance) return res.status(404).json({ message: "Insurance not found" });

    insurance.status = "rejected";
    await insurance.save();
    res.json({ message: "Insurance rejected", insurance });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// @route   DELETE /api/insurance/:id
// @desc    Delete an insurance policy (Admin only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

    const insurance = await Insurance.findById(req.params.id);
    if (!insurance) return res.status(404).json({ message: "Insurance not found" });

    await insurance.deleteOne();
    res.json({ message: "Insurance deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});



const Policy = require("../models/Policy"); // Ensure Policy model exists

// GET policy details for logged-in user
router.get("/policy/:userId", async (req, res) => {
    try {
        const policy = await Policy.findOne({ userId: req.params.userId });
        if (!policy) {
            return res.status(404).json({ message: "Policy not found" });
        }
        res.json(policy);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Middleware to check and update expired policies
async function updateExpiredPolicies() {
  const today = new Date();

  try {
      await Policy.updateMany(
          { endDate: { $lt: today }, status: { $ne: "Expired" } },
          { $set: { status: "Expired" } }
      );
  } catch (error) {
      console.error("Error updating expired policies:", error);
  }
}

//module.exports = router;


// // Create a new policy
// router.post("/create", async (req, res) => {
//     try {
//         const policy = new Insurance(req.body);
//         await policy.save();
//         res.status(201).json({ message: "Policy created successfully", policy });
//     } catch (error) {
//         res.status(500).json({ message: "Error saving policy", error });
//     }
// });

// module.exports = router;

// Renew an expired policy
// router.put("/insurance/renew/:policyId", async (req, res) => {
//   try {
//       const policy = await Insurance.findById(req.params.policyNumber);
//       if (!policy) {
//           return res.status(404).json({ message: "Policy not found" });
//       }

//       // Check if policy is expired
//       const currentDate = new Date();
//       if (policy.expirationDate > currentDate) {
//           return res.status(400).json({ message: "Policy is still active. Cannot renew now." });
//       }

//       // Extend expiration date by 1 year (or any duration)
//       const newExpirationDate = new Date();
//       newExpirationDate.setFullYear(newExpirationDate.getFullYear() + 1);

//       policy.expirationDate = newExpirationDate;
//       policy.status = "renewed";
//       policy.renewalDate = currentDate;

//       await policy.save();
//       res.json({ message: "Policy renewed successfully", updatedPolicy: policy });
//   } catch (error) {
//       console.error("Error renewing policy:", error);
//       res.status(500).json({ message: "Internal Server Error", error: error.message });
//   }
// });

router.put("/renew/:id", authMiddleware, async (req, res) => {
  try {
      const insurance = await Insurance.findById(req.params.id);

      if (!insurance) {
          return res.status(404).json({ message: "Insurance not found" });
      }

      if (insurance.owner.toString() !== req.user.id) {
          return res.status(403).json({ message: "Unauthorized to renew this insurance" });
      }

      // Update policy start & end dates
      insurance.status = "renewed";
      insurance.renewalDate = new Date();
      insurance.startDate = new Date();
      insurance.endDate = new Date();
      insurance.endDate.setFullYear(insurance.endDate.getFullYear() + 1);

      await insurance.save();
      res.status(200).json({ message: "Insurance renewed successfully", insurance });
  } catch (error) {
      console.error("Error renewing insurance:", error);
      res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
