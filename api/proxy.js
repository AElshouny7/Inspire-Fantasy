export default async function handler(req, res) {
  const backendURL =
    "https://script.google.com/macros/s/AKfycbwy6U1JzUiukosZWpUl6eVathT4G6zqbMo9WZBbHyp-kZIZJdgFifNf-8mXX7_J0QXlFA/exec";

  try {
    const response = await fetch(backendURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ status: "error", message: "Proxy request failed." });
  }
}
