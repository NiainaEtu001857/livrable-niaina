const express = require("express");
const { saveWizard , getWizard } = require("../controllers/wizard.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", authMiddleware, saveWizard);
router.get("/", authMiddleware, getWizard);

module.exports = router;