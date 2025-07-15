const express = require("express");
const ShortUrl = require("../models/ShortUrl");
const { Log } = require("../../Logging Midleware/index");
const validUrl = require("valid-url");
const crypto = require("crypto");

const router = express.Router();

const generateShortcode = () => crypto.randomBytes(3).toString("hex");

router.post("/", async (req, res) => {
  try {
    const { url, validity = 30, shortcode } = req.body;

    if (!validUrl.isUri(url)) {
      await Log("warn", "routes/shortUrlRoutes", "get bad url.");
      return res.status(400).json({ error: "url is not good" });
    }

    let code = shortcode || generateShortcode();
    const existing = await ShortUrl.findOne({ shortcode: code });

    if (existing) {
      await Log("error", "routes/shortUrlRoutes", `this shortcode already here: ${code}`);
      return res.status(409).json({ error: "shortcode is already there" });
    }

    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + validity * 60000);

    const shortUrl = await ShortUrl.create({
      originalUrl: url,
      shortcode: code,
      createdAt,
      expiresAt
    });

    await Log("info", "routes/shortUrlRoutes", `made a short url: ${code}`);

    return res.status(201).json({
      shortLink: `http://localhost:${process.env.PORT || 5000}/${code}`,
      expiry: expiresAt.toISOString()
    });
  } catch (error) {
    await Log("error", "routes/shortUrlRoutes", `problem when making short url: ${error.message}`);
    res.status(500).json({ error: "server has problem" });
  }
});

router.get("/stats/:shortcode", async (req, res) => {
  try {
    const { shortcode } = req.params;
    const shortUrl = await ShortUrl.findOne({ shortcode });

    if (!shortUrl) {
      await Log("warn", "routes/shortUrlRoutes", `user ask for stats for shortcode that is not here: ${shortcode}`);
      return res.status(404).json({ error: "can not find shortcode" });
    }

    return res.status(200).json({
      originalUrl: shortUrl.originalUrl,
      createdAt: shortUrl.createdAt,
      expiresAt: shortUrl.expiresAt,
      totalClicks: shortUrl.clicks.length,
      clicks: shortUrl.clicks
    });
  } catch (error) {
    await Log("error", "routes/shortUrlRoutes", `problem getting stats: ${error.message}`);
    res.status(500).json({ error: "server has problem" });
  }
});

module.exports = router;