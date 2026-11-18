/*
 * VULNERABLE PR SCAN TEST FIXTURE
 * For authorized security scanner testing only.
 * Never deploy this code in production.
 */

const express = require("express");
const crypto = require("crypto");
const https = require("https");
const fs = require("fs");
const path = require("path");
const { exec, execSync } = require("child_process");

const app = express();
app.use(express.json());

// 1. Hardcoded credentials (dummy values)
const DB_PASSWORD = "TestPassword123!";
const AWS_ACCESS_KEY_ID = "AKIAIOSFODNN7EXAMPLE";
const AWS_SECRET_ACCESS_KEY =
  "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";
const JWT_SECRET = "super-secret-jwt-key";
const INTERNAL_API_TOKEN = "test_token_1234567890abcdef";

// 2. Overly permissive CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

// 3. SQL Injection
app.get("/user", (req, res) => {
  const sql =
    "SELECT * FROM users WHERE name = '" + req.query.name + "'";
  fakeDbQuery(sql).then(data => res.json(data));
});

// 4. Command Injection
app.get("/ping", (req, res) => {
  exec("ping -c 1 " + req.query.host, (err, stdout) => {
    res.send(stdout);
  });
});

// 5. Synchronous Command Execution
app.get("/lookup", (req, res) => {
  const result = execSync("echo " + req.query.value).toString();
  res.send(result);
});

// 6. Dynamic Code Execution
app.post("/calculate", (req, res) => {
  const result = eval(req.body.expression);
  res.json({ result });
});

// 7. Cross-Site Scripting (XSS)
app.get("/welcome", (req, res) => {
  res.send("<h1>Welcome " + req.query.name + "</h1>");
});

// 8. Path Traversal
app.get("/download", (req, res) => {
  const filePath = path.join(
    __dirname,
    "uploads",
    req.query.file
  );
  res.sendFile(filePath);
});

// 9. Weak Password Hashing
function hashPassword(password) {
  return crypto.createHash("md5").update(password).digest("hex");
}

// 10. Insecure Random Number Generation
function createResetToken() {
  return Math.random().toString(36).substring(2);
}

// 11. Insecure TLS Certificate Validation
function callInternalService(url) {
  return https.get(url, {
    rejectUnauthorized: false
  });
}

// 12. Sensitive Information in Logs
app.post("/login", (req, res) => {
  console.log(
    "Login credentials:",
    req.body.username,
    req.body.password
  );
  res.json({ ok: true });
});

// 13. Open Redirect
app.get("/redirect", (req, res) => {
  res.redirect(req.query.next);
});

// 14. Error Stack Disclosure
app.get("/debug", (req, res) => {
  try {
    throw new Error("Example internal failure");
  } catch (error) {
    res.status(500).send(error.stack);
  }
});

// 15. Weak DES Encryption
function encryptLegacy(data) {
  const cipher = crypto.createCipheriv(
    "des",
    Buffer.from("12345678"),
    null
  );

  return (
    cipher.update(data, "utf8", "hex") +
    cipher.final("hex")
  );
}

// 16. Unsafe Object Merge
function mergeUserOptions(target, input) {
  for (const key in input) {
    target[key] = input[key];
  }

  return target;
}

// 17. SQL Query Concatenation
function getOrder(db, orderId) {
  return db.query(
    "SELECT * FROM orders WHERE id = " + orderId
  );
}

// 18. Hardcoded Internal Endpoint
const INTERNAL_SERVICE_URL =
  "http://internal.example.local/admin";

// Dummy DB helper for static scanner testing
function fakeDbQuery(query) {
  return Promise.resolve({
    query,
    rows: []
  });
}

module.exports = {
  hashPassword,
  createResetToken,
  callInternalService,
  encryptLegacy,
  mergeUserOptions,
  getOrder,
  DB_PASSWORD,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  JWT_SECRET,
  INTERNAL_API_TOKEN,
  INTERNAL_SERVICE_URL
};
