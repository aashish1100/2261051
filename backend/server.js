require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const loggerMiddleware = require("./middleware/logger");
const shortUrlRoutes = require("./routes/shortUrlRoutes");
const { Log } = require("../Logging Midleware/index");

const app = express();
const PORT = process.env.PORT || 5000;
const DB_URL = process.env.MONGO_URI;

console.log('starting up now', DB_URL);

mongoose.connect(DB_URL)
  .then(() => console.log("it is working"))
  .catch(err => console.log("error",err.message));

app.use(express.json());
// app.use(loggerMiddleware);
app.use("/shorturls", shortUrlRoutes);
app.get("/:shortcode", require("./routes/redirectShortcode"));

app.listen(PORT, () => {
  Log("info", "controller", `server is run on http://localhost:${PORT}`);
});