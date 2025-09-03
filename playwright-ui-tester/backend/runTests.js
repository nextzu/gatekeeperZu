const { spawn } = require("child_process");

function runTest(testFile) {
  return new Promise((resolve) => {
    const process = spawn("npx", ["playwright", "test", testFile]);

    let output = "";
    process.stdout.on("data", (data) => (output += data.toString()));
    process.stderr.on("data", (data) => (output += data.toString()));

    process.on("close", (code) => {
      resolve({
        file: testFile,
        passed: code === 0,
        log: output,
      });
    });
  });
}

module.exports = { runTest };