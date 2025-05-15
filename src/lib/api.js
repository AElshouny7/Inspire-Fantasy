const BACKEND_URL = "/api/proxy"; // NEW

export async function callBackend(action, payload = {}) {
  const res = await fetch(BACKEND_URL, {
    method: "POST",
    body: JSON.stringify({ action, ...payload }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res.json();
}
