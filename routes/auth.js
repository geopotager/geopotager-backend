const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const GardenCenter = require("../models/GardenCenter");

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { email, password, registrationCode } = req.body;

    if (!email || !password || !registrationCode) {
      return res.status(400).json({ message: "Champs manquants" });
    }

    // 1️⃣ Vérifier code jardinerie
    const gardenCenter = await GardenCenter.findOne({
      registrationCode,
      isActive: true,
    });

    if (!gardenCenter) {
      return res.status(400).json({ message: "Code invalide" });
    }

    // 2️⃣ Vérifier email unique
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Utilisateur déjà existant" });
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Créer user lié à la jardinerie
    const user = new User({
      email,
      password: hashedPassword,
      gardenCenter: gardenCenter._id,
    });

    await user.save();

    // 5️⃣ Générer JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;