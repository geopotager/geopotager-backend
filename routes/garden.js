const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Garden = require("../models/Garden");
const auth = require("../middleware/auth");

// POST /api/gardens
router.post("/", auth, async (req, res) => {
  try {
    const { name, location, surface } = req.body;

    const garden = new Garden({
      name,
      location,
      surface,
      user: req.user.userId,
    });

    await garden.save();

    res.status(201).json(garden);
  } catch (error) {
    console.error("ERREUR GARDEN :", error); // on garde juste ça pour log serveur
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// GET /api/gardens
router.get("/", auth, async (req, res) => {
  try {
    const gardens = await Garden.find({
      user: req.user.userId,
    }).sort({ createdAt: -1 });

    res.json(gardens);
  } catch (error) {
    console.error("ERREUR GET GARDENS :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// GET /api/gardens/:id
router.get("/:id", auth, async (req, res) => {
  try {
    // 1️⃣ Vérifier si l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const garden = await Garden.findById(req.params.id);

    // 2️⃣ Vérifier existence
    if (!garden) {
      return res.status(404).json({ message: "Jardin introuvable" });
    }

    // 3️⃣ Vérifier propriété
    if (garden.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Accès interdit" });
    }

    // 4️⃣ OK
    res.json(garden);

  } catch (error) {
    console.error("ERREUR GET GARDEN BY ID :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// PUT /api/gardens/:id
router.put("/:id", auth, async (req, res) => {
  try {
    // 1️⃣ Vérifier ID valide
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const garden = await Garden.findById(req.params.id);

    // 2️⃣ Vérifier existence
    if (!garden) {
      return res.status(404).json({ message: "Jardin introuvable" });
    }

    // 3️⃣ Vérifier propriété
    if (garden.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Accès interdit" });
    }

    // 4️⃣ Mise à jour des champs autorisés
    const { name, location, surface, plots } = req.body;

    if (name !== undefined) garden.name = name;
    if (location !== undefined) garden.location = location;
    if (surface !== undefined) garden.surface = surface;
    if (plots !== undefined) garden.plots = plots;

    await garden.save();

    res.json(garden);

  } catch (error) {
    console.error("ERREUR PUT GARDEN :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// DELETE /api/gardens/:id
router.delete("/:id", auth, async (req, res) => {
  try {
    // 1️⃣ Vérifier ID valide
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const garden = await Garden.findById(req.params.id);

    // 2️⃣ Vérifier existence
    if (!garden) {
      return res.status(404).json({ message: "Jardin introuvable" });
    }

    // 3️⃣ Vérifier propriété
    if (garden.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Accès interdit" });
    }

    // 4️⃣ Suppression
    await garden.deleteOne();

    // 5️⃣ Réponse REST clean
    res.status(204).send();

  } catch (error) {
    console.error("ERREUR DELETE GARDEN :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// POST /api/gardens/:id/plots
router.post("/:id/plots", auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const garden = await Garden.findById(req.params.id);

    if (!garden) {
      return res.status(404).json({ message: "Jardin introuvable" });
    }

    if (garden.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Accès interdit" });
    }

    const { name, surface, crop } = req.body;

    const newPlot = {
      _id: new mongoose.Types.ObjectId(),
      name,
      surface,
      crop,
    };

    garden.plots.push(newPlot);

    await garden.save();

    res.status(201).json(garden);

  } catch (error) {
    console.error("ERREUR ADD PLOT :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// GET /api/gardens/:id/plots
router.get("/:id/plots", auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const garden = await Garden.findById(req.params.id);

    if (!garden) {
      return res.status(404).json({ message: "Jardin introuvable" });
    }

    if (garden.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Accès interdit" });
    }

    res.json(garden.plots);

  } catch (error) {
    console.error("ERREUR GET PLOTS :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// DELETE /api/gardens/:gardenId/plots/:plotId
router.delete("/:gardenId/plots/:plotId", auth, async (req, res) => {
  try {
    const { gardenId, plotId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(gardenId)) {
      return res.status(400).json({ message: "ID garden invalide" });
    }

    const garden = await Garden.findById(gardenId);

    if (!garden) {
      return res.status(404).json({ message: "Jardin introuvable" });
    }

    if (garden.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Accès interdit" });
    }

    garden.plots = garden.plots.filter(
      (plot) => plot._id.toString() !== plotId
    );

    await garden.save();

    res.status(204).send();

  } catch (error) {
    console.error("ERREUR DELETE PLOT :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// PUT /api/gardens/:gardenId/plots/:plotId
router.put("/:gardenId/plots/:plotId", auth, async (req, res) => {
  try {
    const { gardenId, plotId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(gardenId)) {
      return res.status(400).json({ message: "ID garden invalide" });
    }

    const garden = await Garden.findById(gardenId);

    if (!garden) {
      return res.status(404).json({ message: "Jardin introuvable" });
    }

    if (garden.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Accès interdit" });
    }

    const plot = garden.plots.id(plotId);

    if (!plot) {
      return res.status(404).json({ message: "Plot introuvable" });
    }

    const { name, surface, crop } = req.body;

    if (name !== undefined) plot.name = name;
    if (surface !== undefined) plot.surface = surface;
    if (crop !== undefined) plot.crop = crop;

    await garden.save();

    res.json(plot);

  } catch (error) {
    console.error("ERREUR UPDATE PLOT :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;