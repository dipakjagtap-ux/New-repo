// 1. Hardcoded Secret
const API_TOKEN = "ghp_TEST_ONLY_NOT_A_REAL_TOKEN_1234567890";

// 2. Command Injection
const { exec } = require("child_process");

function lookupUser(username) {
  exec("echo " + username, (error, stdout) => {
    if (error) console.error(error);
    console.log(stdout);
  });
}

// 3. SQL Injection
function findAccount(db, email) {
  const query = "SELECT * FROM accounts WHERE email = '" + email + "'";
  return db.query(query);
}

// 4. Cross-Site Scripting (XSS)
function renderProfile(userInput) {
  return "<div>Welcome " + userInput + "</div>";
}

// 5. Weak Cryptography (MD5)
const crypto = require("crypto");

function hashPassword(password) {
  return crypto.createHash("md5").update(password).digest("hex");
}

// 6. Insecure TLS Configuration
const https = require("https");

function makeRequest(options) {
  return https.request({
    ...options,
    rejectUnauthorized: false
  });
}

module.exports = {
  API_TOKEN,
  lookupUser,
  findAccount,
  renderProfile,
  hashPassword,
  makeRequest
};
