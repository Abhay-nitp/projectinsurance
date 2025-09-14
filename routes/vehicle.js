const express = require("express");
const authMiddleware = require("../middleware/auth");
const Vehicle = require("../models/Vehicle");

const router = express.Router();

// @route   POST /api/vehicles
// @desc    Add a vehicle (Customer Only)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { plateNumber, model, make, year } = req.body;

    // Check if vehicle already exists
    let existingVehicle = await Vehicle.findOne({ plateNumber });
    if (existingVehicle) return res.status(400).json({ message: "Vehicle already exists" });

    // Create new vehicle
    const newVehicle = new Vehicle({ 
      owner: req.user.id, 
      plateNumber, 
      model, 
      make, 
      year 
    });

    await newVehicle.save();
    res.status(201).json({ message: "Vehicle added successfully", vehicle: newVehicle });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Fetch plate numbers for the logged-in user
router.get("/plate-numbers", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from JWT token
        const vehicles = await Vehicle.find({ owner: userId });

        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

router.get("/",  async (req, res) => {
  try {
     
      const vehicle = await Vehicle.find();

      if (!vehicle) {
          return res.status(404).json({ error: "Vehicle not found" });
      }

      res.json(vehicle);
  } catch (error) {
      console.error("Error fetching vehicle details:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get("/details/:plateNumber",  async (req, res) => {
    try {
        const plateNumber = req.params.plateNumber;
        const vehicle = await Vehicle.findOne({ plateNumber });

        if (!vehicle) {
            return res.status(404).json({ error: "Vehicle not found" });
        }

        res.json(vehicle);
    } catch (error) {
        console.error("Error fetching vehicle details:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.get("/details/:plateNumber", async (req, res) => {
    try {
        const plateNumber = req.params.plateNumber;
        const vehicle = await Vehicle.findOne({ plateNumber });

        if (!vehicle) {
            return res.status(404).json({ error: "Vehicle not found" });
        }

        res.json(vehicle);
    } catch (error) {
        console.error("Error fetching vehicle details:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/details/:plateNumber", async (req, res) => {
  try {
      const plateNumber = req.params.plateNumber;
      const vehicle = await Vehicle.findOne({ plateNumber });

      if (!vehicle) {
          return res.status(404).json({ error: "Vehicle not found" });
      }

      res.json(vehicle);
  } catch (error) {
      console.error("Error fetching vehicle details:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});



// ✅ Check if a vehicle is registered for the logged-in user
router.get("/is-registered", authMiddleware, async (req, res) => {
  try {
      const userId = req.user.id; // Extracted from JWT token
      const vehicle = await Vehicle.findOne({ owner: userId });

      if (vehicle) {
          return res.status(200).json({ registered: true, vehicle });
      } else {
          return res.status(200).json({ registered: false });
      }
      
  } catch (error) {
      console.error("Error checking vehicle registration:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

// @route   GET /api/vehicles
// @desc    Fetch all vehicles (Admin Only)
router.get("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const vehicles = await Vehicle.find().populate("owner", "name email phone");
    res.json(vehicles);

  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// @route   GET /api/vehicles/:id
// @desc    Fetch a specific vehicle
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate("owner", "name email phone");
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    // Only owner or admin can access
    if (vehicle.owner._id.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// @route   PUT /api/vehicles/:id
// @desc    Update a vehicle (Only owner)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    // Only owner can update
    if (vehicle.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { plateNumber, model, make, year } = req.body;
    vehicle.plateNumber = plateNumber || vehicle.plateNumber;
    vehicle.model = model || vehicle.model;
    vehicle.make = make || vehicle.make;
    vehicle.year = year || vehicle.year;

    await vehicle.save();
    res.json({ message: "Vehicle updated successfully", vehicle });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// @route   DELETE /api/vehicles/:id
// @desc    Delete a vehicle (Only owner)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    // Only owner can delete
    if (vehicle.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    await vehicle.deleteOne();
    res.json({ message: "Vehicle deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});








module.exports = router;
