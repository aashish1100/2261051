const express = require("express");
const router = express.Router();
const ShortUrl = require("../models/ShortUrl");
const { Log } = require("../../Logging Midleware/index");

router.get("/:shortcode", async (req, res) => {
  try {
    const { shortcode } = req.params;
    const shortUrl = await ShortUrl.findOne({ shortcode });

    if (!shortUrl) {
      await Log("warn", "routes/redirectShortcode", `did not find shortcode: ${shortcode}`);
      return res.status(404).json({ error: "no shortcode here" });
    }

    if (new Date() > shortUrl.expiresAt) {
      await Log("warn", "routes/redirectShortcode", `this shortcode is old: ${shortcode}`);
      return res.status(410).json({ error: "link is old" });
    }

    shortUrl.clicks.push({
      timestamp: new Date(),
      referrer: req.get("Referrer") || "from direct",
      geoInfo: req.ip
    });

    await shortUrl.save();

    await Log("info", "routes/redirectShortcode", `sending user: ${shortcode} -> ${shortUrl.originalUrl}`);

    return res.redirect(shortUrl.originalUrl);
  } catch (error) {
    await Log("error", "routes/redirectShortcode", `problem with redirect: ${error.message}`);
    return res.status(500).json({ error: "server has problem" });
  }
});

module.exports = router;