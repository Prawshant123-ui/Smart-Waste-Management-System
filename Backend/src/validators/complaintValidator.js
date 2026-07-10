const { body } = require("express-validator");

const createComplaintValidator = [
  body("binId").optional().isUUID().withMessage("Invalid bin ID"),
  body("description").optional().trim().isLength({ max: 500 }),
];

module.exports = { createComplaintValidator };