// Use require for CommonJS
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  use: {
    baseURL: process.env.BASE_URL || 'https://ukfieldservice.com',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
  // Configure output directory with timestamps for unique naming
  outputDir: './test-results',
  reporter: [
    ['json', { outputFile: 'test-results.json' }],
    ['line']
  ],
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome']
      },
    },
  ],
});