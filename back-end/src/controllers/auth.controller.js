const authService = require("../services/auth.service");

const register = async (req, res) => {
  try {
    const user = await authService.register(req.body.email, req.body.password);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const tokens = await authService.login(req.body.email, req.body.password);
    res.json({ token: tokens.accessToken });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

module.exports = {
  register,
  login
};