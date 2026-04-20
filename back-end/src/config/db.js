const { prisma } = require("../prisma");

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("✅ PostgreSQL connected via Prisma");
  } catch (err) {
    console.error("❌ DB connection error:", err);
    process.exit(1);
  }
};

module.exports = { connectDB };