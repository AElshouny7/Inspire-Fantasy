const isLocalhost =
  typeof window !== "undefined" && window.location.hostname === "localhost";

const BACKEND_URL = isLocalhost
  ? "http://localhost:3001/proxy" // Local proxy
  : "/api/proxy"; // Vercel proxy for production

export async function callBackend(action, payload = {}) {
  try {
    const res = await fetch(BACKEND_URL, {
      method: "POST",
      body: JSON.stringify({ action, ...payload }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await res.json();
  } catch (err) {
    console.error("API call failed:", err);
    return { status: "error", message: "Network or parsing error." };
  }
}
