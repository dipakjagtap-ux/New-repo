
/*
 * SECURITY TEST FIXTURE
 * Contains synthetic dummy credentials only.
 * Never use real credentials in this file.
 */

const testConfig = {
  // Intentionally fake values for authorized secret-scanner testing
  apiKey: "TEST_ONLY_FAKE_API_KEY_1234567890",
  clientSecret: "TEST_ONLY_FAKE_CLIENT_SECRET_ABCDEF",
  password: "TEST_ONLY_FAKE_PASSWORD_NOT_REAL"
};

function runSecretScanFixture() {
  console.log("Hardcoded secret scanner test fixture");
  return testConfig.apiKey.length > 0;
}

module.exports = { testConfig, runSecretScanFixture };
