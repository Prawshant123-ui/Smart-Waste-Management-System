
require("dotenv").config();
const bcrypt = require("bcrypt");
const prisma = require("../src/config/prisma");

const seedAdmin = async () => {
  const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_PHONE, ADMIN_NAME } = process.env;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !ADMIN_PHONE) {
    console.error(
      "Missing ADMIN_EMAIL, ADMIN_PASSWORD, or ADMIN_PHONE in .env — aborting."
    );
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      password: hashedPassword,
      phone: ADMIN_PHONE,
      name: ADMIN_NAME || "System Admin",
      role: "ADMIN",
    },
    create: {
      name: ADMIN_NAME || "System Admin",
      email: ADMIN_EMAIL,
      phone: ADMIN_PHONE,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log(`Admin seeded: ${admin.email} (role: ${admin.role})`);
};

seedAdmin()
  .catch((err) => {
    console.error("Failed to seed admin:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());


  module.exports=seedAdmin;