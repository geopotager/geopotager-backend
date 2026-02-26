const mongoose = require("mongoose");

const GardenCenterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    registrationCode: {
      type: String,
      required: true,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GardenCenter", GardenCenterSchema);