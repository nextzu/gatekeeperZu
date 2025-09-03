import { useState } from "react";

function App() {
  const [tests, setTests] = useState([
    { name: "login.spec.js", selected: false, result: null, log: "" },
    { name: "addjob.spec.js", selected: false, result: null, log: "" },
  ]);

  const runTests = async () => {
    const toRun = tests.filter((t) => t.selected).map((t) => t.name);
    const response = await fetch("http://localhost:4000/run-tests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tests: toRun }),
    });
    const results = await response.json();

    setTests((prev) =>
      prev.map((t) => {
        const r = results.find((r) => r.file === t.name);
        return r ? { ...t, result: r.passed, log: r.log } : t;
      })
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">UES Tester</h1>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={runTests}
      >
        Run Selected
      </button>

      <table className="table-auto w-full border">
        <thead>
          <tr>
            <th className="border px-2">Run</th>
            <th className="border px-2">Test Name</th>
            <th className="border px-2">Pass/Fail</th>
            <th className="border px-2">Detail</th>
          </tr>
        </thead>
        <tbody>
          {tests.map((t, i) => (
            <tr key={i} className="border">
              <td className="text-center">
                <input
                  type="checkbox"
                  checked={t.selected}
                  onChange={(e) =>
                    setTests((prev) =>
                      prev.map((x, j) =>
                        j === i ? { ...x, selected: e.target.checked } : x
                      )
                    )
                  }
                />
              </td>
              <td className="px-2">{t.name}</td>
              <td className="text-center">
                {t.result === null ? "" : t.result ? "✅" : "❌"}
              </td>
              <td className="px-2">
                {!t.result && t.log ? (
                  <details>
                    <summary className="cursor-pointer text-blue-600">
                      View
                    </summary>
                    <pre className="text-sm text-red-600 whitespace-pre-wrap">
                      {t.log}
                    </pre>
                  </details>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
