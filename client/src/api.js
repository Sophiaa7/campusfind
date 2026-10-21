async function request(path, options = {}) {
  const res = await fetch("/api" + path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export const api = {
  getStats: () => request("/stats"),
  reportLost: (body) => request("/lost", { method: "POST", body: JSON.stringify(body) }),
  reportFound: (body) => request("/found", { method: "POST", body: JSON.stringify(body) }),
  getMatches: () => request("/matches"),
  loadDemo: () => request("/demo", { method: "POST" }),
  recover: (matchId) => request("/recover", { method: "POST", body: JSON.stringify({ matchId }) }),
};