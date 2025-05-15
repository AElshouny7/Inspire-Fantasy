export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ status: "error", message: "Only POST allowed" });
  }

  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbwy6U1JzUiukosZWpUl6eVathT4G6zqbMo9WZBbHyp-kZIZJdgFifNf-8mXX7_J0QXlFA/exec",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      }
    );

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
}
