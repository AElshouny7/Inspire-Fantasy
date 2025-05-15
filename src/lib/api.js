const BACKEND_URL =
  "https://script.google.com/macros/s/AKfycbwy6U1JzUiukosZWpUl6eVathT4G6zqbMo9WZBbHyp-kZIZJdgFifNf-8mXX7_J0QXlFA/exec";

export async function callBackend(action, payload = {}) {
  const formData = new URLSearchParams();
  formData.append("action", action);
  formData.append("data", JSON.stringify(payload)); // only one param `data`

  const res = await fetch(BACKEND_URL, {
    method: "POST",
    body: formData, // NOT JSON.stringify
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return res.json();
}
