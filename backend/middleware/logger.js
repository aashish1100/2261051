const { Log } = require("../../Logging Midleware/");

const loggerMiddleware = async (req, res, next) => {
  const start = Date.now();

  res.on("finish", async () => {
    const duration = Date.now() - start;
    const msg = `METHOD=${req.method} URL=${req.originalUrl} STATUS=${res.statusCode} TIME=${duration}ms`;
    await Log("info", "middleware/logger", msg);
  });

  next();
};

module.exports = loggerMiddleware;
