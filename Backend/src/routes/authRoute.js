const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/authController");
const { registerValidator, loginValidator } = require("../validators/authValidator");
const validateRequest = require("../validators/validateRequest");
const { loginLimiter } = require("../services/rateLimiter");

router.post("/register", registerValidator, validateRequest, register);
router.post("/login", loginLimiter, loginValidator, validateRequest, login);

module.exports = router;
