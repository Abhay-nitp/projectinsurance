require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

const cookieParser = require("cookie-parser");


const app = express();
app.use(cors({
  origin: "http://192.168.172.100:5500", // ✅ Use your frontend URL
  credentials: true,  // ✅ Allow sending cookies with requests
 
}));
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
//app.use(cors());


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));
  
app.use(cookieParser());
// Default Route
app.get("/", (req, res) => {
  res.send("Vehicle Insurance Management System API is running...");
});

const authRoutes = require("./routes/auth");

app.use("/api/auth", authRoutes);
//app.use("/api/auth", authRoutes);

app.use("/api/protected", require("./routes/protected"));

app.use("/api/vehicles", require("./routes/vehicle"));

app.use("/api/insurance", require("./routes/insurance"));
app.use("/api/quote", require("./routes/quote1"));
app.use("/api", require("./routes/claim"));
app.use("/api/claim", require("./routes/claim"));

app.use("/api/policies",require("./routes/policyRoutes"));
app.use("/api",require("./routes/dashboard"));
app.use("/api/plan",require("./routes/plan"));



app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "index.html"));
});




// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
