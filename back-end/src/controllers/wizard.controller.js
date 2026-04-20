const wizardService = require("../services/wizard.service");

const saveWizard = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const data = req.body;

    const result = await wizardService.saveWizard(req.user.userId, data);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getWizard = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const result = await wizardService.getWizard(req.user.userId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  saveWizard,
  getWizard
};