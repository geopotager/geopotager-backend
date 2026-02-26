const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const gardenRoutes = require("./routes/garden");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/gardens", gardenRoutes);

app.get("/", (req, res) => {
  res.send("BACKEND ACTUEL TEST 🔥");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected 🗄️"))
  .catch((err) => console.error("MongoDB error:", err));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});