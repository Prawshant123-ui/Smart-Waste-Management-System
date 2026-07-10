const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoute");
const userRoutes = require("./routes/userRoute");
const { apiLimiter } = require("./services/rateLimiter");

const app = express();
app.use(helmet());


app.use(cors({ origin: "http://localhost:8080" }));

app.use(express.json());
app.use(morgan("dev"));
app.use(apiLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

module.exports = app;
