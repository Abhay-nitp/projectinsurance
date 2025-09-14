// const express = require("express");
// const Razorpay = require("razorpay");
// const dotenv = require("dotenv");
// dotenv.config();

// const router = express.Router();

// // Initialize Razorpay instance
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// // @route   POST /api/payment
// // @desc    Create an order for insurance payment
// router.post("/", async (req, res) => {
//   try {
//     const { amount, currency } = req.body;

//     // Razorpay accepts amount in paise (INR * 100)
//     const paymentOrder = await razorpay.orders.create({
//       amount: amount * 100, // Convert INR to paise
//       currency: currency || "INR",
//       receipt: `receipt_${Math.random() * 1000}`,
//       payment_capture: 1, // Auto capture payment
//     });

//     res.json({ orderId: paymentOrder.id, amount: paymentOrder.amount, currency: paymentOrder.currency });

//   } catch (error) {
//     res.status(500).json({ message: "Payment Error", error });
//   }
// });

// // @route   POST /api/payment/verify
// // @desc    Verify payment signature (optional, for security)
// router.post("/verify", async (req, res) => {
//   const crypto = require("crypto");
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

//   const generatedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//     .update(razorpay_order_id + "|" + razorpay_payment_id)
//     .digest("hex");

//   if (generatedSignature === razorpay_signature) {
//     res.json({ message: "Payment verified successfully" });
//   } else {
//     res.status(400).json({ message: "Invalid payment signature" });
//   }
// });


// const express = require("express");
// const Razorpay = require("razorpay");
// const router = express.Router();

// const razorpay = new Razorpay({
//     key_id: "your_razorpay_key_id",
//     key_secret: "your_razorpay_key_secret"
// });

// // 🔹 Create Order
// router.post("/", async (req, res) => {
//     const { amount, currency } = req.body;

//     try {
//         const order = await razorpay.orders.create({
//             amount: amount * 100, // Convert to paisa
//             currency: currency,
//             receipt: "receipt_" + Math.random()
//         });

//         res.json({ orderId: order.id, amount: order.amount, currency: order.currency });
//     } catch (err) {
//         res.status(500).json({ message: "Payment error" });
//     }
// });



// module.exports = router;
