const bcrypt = require("bcrypt");
const { prisma } = require("../prisma");
const {
  generateAccessToken,
  generateRefreshToken
} = require("../utils/jwt");

const register = async (email, password) => {
  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, password: hashed }
  });

  return user;
};

const login = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new Error("User not found");
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    throw new Error("Invalid credentials");
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken }
  });

  return { accessToken, refreshToken };
};

module.exports = {
  register,
  login
};