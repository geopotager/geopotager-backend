const mongoose = require("mongoose");

const PlotSchema = new mongoose.Schema({
  _id: { type: String },

  name: { type: String },
  surface: { type: Number },
  crop: { type: String },

  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },

  width: { type: Number, default: 100 },
  height: { type: Number, default: 50 },

  rotation: { type: Number, default: 0 },
  opacity: { type: Number, default: 0.8 },

  color: {
    type: String,
    default: "#A3D977"
  },

  type: { type: String, default: "culture" },
  shape: { type: String, default: "rect" },

  exposure: { type: String, default: "Soleil" },

  plantedCultureId: { type: String, default: null },
  selectedVariety: { type: String, default: null },

  rowOrientation: { type: String, default: "horizontal" },

  subPlots: {
    type: Array,
    default: []
  }
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