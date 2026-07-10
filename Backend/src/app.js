const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoute");
const userRoutes = require("./routes/userRoute");
const binRoutes = require("./routes/binRoute");
const complaintRoutes = require("./routes/complaintRoute");
const vehicleRoutes = require("./routes/vehicleRoute");
const collectionRoutes = require("./routes/collectionRoute");
const dashboardRoutes = require("./routes/dashboardRoute");
const { apiLimiter } = require("./services/rateLimiter");

const app = express();
app.use(helmet());


app.use(cors({ origin: "http://localhost:8080" }));

app.use(express.json());
app.use(morgan("dev"));
app.use(apiLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bins", binRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

module.exports = app;
