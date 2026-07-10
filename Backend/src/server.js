require("dotenv").config();

const app = require("./app");
const prisma = require("./config/prisma");
const seedAdmin=require('../scripts/seedAdmin')

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log(" Database connected!!");
    await seedAdmin();
    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(" Failed to start server:", error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
};

startServer();
