const express = require("express");
const cors = require("cors");
const { runTest } = require("./runTests");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/run-tests", async (req, res) => {
  const { tests } = req.body; // e.g. ["login.spec.js"]
  const results = [];

  for (let t of tests) {
    const result = await runTest(t);
    results.push(result);
  }

  res.json(results);
});

app.listen(4000, () => console.log("✅ Backend running on http://localhost:4000"));