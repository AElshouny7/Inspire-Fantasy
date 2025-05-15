// dev-proxy.js
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;
const GAS_URL =
  "https://script.google.com/macros/s/AKfycbwy6U1JzUiukosZWpUl6eVathT4G6zqbMo9WZBbHyp-kZIZJdgFifNf-8mXX7_J0QXlFA/exec";

app.post("/proxy", async (req, res) => {
  try {
    const response = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ status: "error", message: "Proxy request failed." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Local proxy running on http://localhost:${PORT}/proxy`);
});
