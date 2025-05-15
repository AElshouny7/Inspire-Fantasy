const BACKEND_URL =
  "https://script.google.com/macros/s/AKfycbwy6U1JzUiukosZWpUl6eVathT4G6zqbMo9WZBbHyp-kZIZJdgFifNf-8mXX7_J0QXlFA/exec";

export async function callBackend(action, payload = {}) {
  const res = await fetch(BACKEND_URL, {
    method: "POST",
    body: JSON.stringify({ action, ...payload }),
    headers: { "Content-Type": "application/json" },
  });

  return res.json();
}
