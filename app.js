const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = express();
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/books", require("./routes/books"));
app.use("/api/users", require("./routes/users"));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.status ? err.message : "Internal server error",
  });
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required");
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => app.listen(PORT, () => console.log(`Library API listening on port ${PORT}`)))
    .catch((error) => {
      console.error("Database connection failed:", error.message);
      process.exit(1);
    });
}

module.exports = app;
