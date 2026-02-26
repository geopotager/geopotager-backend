const mongoose = require("mongoose");

const PlotSchema = new mongoose.Schema({
  name: { type: String },
  surface: { type: Number },
  crop: { type: String },
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  width: { type: Number, default: 100 },
  height: { type: Number, default: 50 }
});

const GardenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    name: {
      type: String,
      default: "Mon potager"
    },
    config: {
      type: Object,
      default: {}
    },
    plots: {
      type: [PlotSchema],
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Garden", GardenSchema);