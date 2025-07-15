const axios = require('axios');

const LOG_API_ENDPOINT = 'http://20.244.56.144/evaluation-service/logs';

const getAuthToken = () => {
  return process.env.LOGGING_API_TOKEN;
};

const allowedLevels = ["debug", "info", "warn", "error", "fatal"];
const allowedPackages = [
  "cache", "controller", "cron_job", "db", "domain",
  "handler", "repository", "route", "service"
];

async function Log(level, pkg, message) {
  try {
    level = level.toLowerCase();
    pkg = pkg.toLowerCase();

    if (!allowedLevels.includes(level)) {
      throw new Error(`this log level '${level}' is not right. it must be one of these ${allowedLevels.join(", ")}`);
    }

    if (!allowedPackages.includes(pkg)) {
      throw new Error(`this package name '${pkg}' is not right. it must be one of these ${allowedPackages.join(", ")}`);
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`,
    };

    const payload = {
      stack: 'backend',
      level,
      package: pkg,
      message,
    };

    console.log("log api url",LOG_API_ENDPOINT)
    console.log("payload data",payload)
    console.log("headers data",headers)
    
    const response = await axios.post(LOG_API_ENDPOINT, payload, { headers });

    if (response.status === 200) {
      console.log(`ok log sended. this is id: ${response.data.logID}`);
    } else {
      console.warn("server did not accept the log. status:", response.status);
    }

  } catch (error) {
    console.error('problem, can not send log.', {
      level,
      package: pkg,
      message,
      the_error: error?.message || error
    });
  }
}

module.exports = { Log };