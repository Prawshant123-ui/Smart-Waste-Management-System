const { body } = require("express-validator");

const createBinValidator = [
  body("latitude").isFloat({ min: -90, max: 90 }).withMessage("Invalid latitude"),
  body("longitude").isFloat({ min: -180, max: 180 }).withMessage("Invalid longitude"),
  body("address").trim().notEmpty().withMessage("Address is required"),
  body("capacity").isInt({ min: 1 }).withMessage("Capacity must be a positive number"),
];

const updateBinValidator = [
  body("latitude").optional().isFloat({ min: -90, max: 90 }),
  body("longitude").optional().isFloat({ min: -180, max: 180 }),
  body("address").optional().trim().notEmpty(),
  body("capacity").optional().isInt({ min: 1 }),
  body("status").optional().isIn(["NORMAL", "FULL", "OVERFLOWING"]),
];

module.exports = { createBinValidator, updateBinValidator };