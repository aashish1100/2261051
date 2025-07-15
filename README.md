# URL Shortener Service

A minimal, modular backend service for shortening URLs, tracking usage statistics, and logging all critical events using a custom middleware.

## 👨‍💻 Author
**Aashish Gupta**

## 🛠️ Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Middleware**: Custom Logging via Axios
- **Environment Config**: dotenv

---

## 📦 Features

- Create custom or auto-generated short URLs
- URL expiry support (default 30 mins)
- Redirection to original URL if valid
- Click tracking with referrer & timestamp
- Retrieve analytics/statistics by shortcode
- Logging middleware that logs:
  - Requests
  - Responses
  - Errors to external API

---

## 📐 Architecture & Design

- **Microservice Architecture**: The project is a single-purpose microservice with modular folder structure (`routes`, `controllers`, `models`, `services`, etc.).
- **RESTful APIs**: Consistent and clean REST API design.
- **Custom Logging Middleware**: Logs request-level details using the AffordMed API (token-protected).

---

## 💾 Data Modeling

### ShortUrl Schema
| Field        | Type     | Description                       |
|--------------|----------|-----------------------------------|
| `originalUrl`| String   | Original long URL                 |
| `shortcode`  | String   | Unique shortcode (custom or gen.) |
| `createdAt`  | Date     | Creation timestamp                |
| `expiry`     | Date     | Expiration timestamp              |
| `clicks`     | Number   | Number of redirects               |
| `accessLogs` | Array    | List of referrer + timestamps     |

---

## 🧠 Key Assumptions & Decisions

- Defaults to 30 minutes if no expiry provided
- All shortcodes are globally unique
- External logging token is set through `.env`
- All requests log access with timestamp & optional referrer

---

## 📈 Scalability & Maintainability

- Modular Express route & controller structure
- Scalable MongoDB data model with Mongoose
- Logging is reusable and isolated as middleware
- Environment ready using `.env`, supports Docker containerization

---

## 🔐 Environment Variables

Create a `.env` file at the root of your project:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/urlshortener
LOGGING_API_TOKEN=your_access_token_here
