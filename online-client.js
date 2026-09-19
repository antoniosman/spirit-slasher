/* Browser adapter for the local/LAN Online backend. */
window.SpiritOnline = (() => {
  const TOKEN_KEY = "spirit-slasher-online-token-v1";
  const SERVER_KEY = "spirit-slasher-online-server-v1";
  // GitHub Pages is the static client; the named Cloudflare hostname is the
  // public account/lobby origin. A user can still override it in the lobby
  // or by setting window.SPIRIT_ONLINE_SERVER_URL before this adapter loads.
  const PUBLIC_SERVER_URL = "https://slasher.spirituniverse.gr";
  let activeController = null;
  let pollTimer = null;

  function defaultServerUrl() {
    const isGithubPages = location.hostname.endsWith("github.io");
    const isLocalServer = ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname) && location.port === "8787";
    if (isLocalServer || (!isGithubPages && location.origin !== "null")) return location.origin;
    if (isGithubPages) return window.SPIRIT_ONLINE_SERVER_URL || PUBLIC_SERVER_URL;
    return PUBLIC_SERVER_URL;
  }

  function getServerUrl() {
    const stored = (localStorage.getItem(SERVER_KEY) || "").trim();
    // Quick Tunnel URLs are ephemeral. Do not keep sending accounts to an old
    // trycloudflare.com origin after the project moves to its named hostname.
    if (/trycloudflare\.com$/i.test(stored)) localStorage.removeItem(SERVER_KEY);
    return ((/trycloudflare\.com$/i.test(stored) ? "" : stored) || defaultServerUrl()).replace(/\/+$/, "");
  }

  function setServerUrl(value) {
    const normalized = String(value || "").trim().replace(/\/+$/, "");
    if (!normalized) localStorage.removeItem(SERVER_KEY);
    else localStorage.setItem(SERVER_KEY, normalized);
    return getServerUrl();
  }

  function getToken() { return localStorage.getItem(TOKEN_KEY) || ""; }
  function setToken(token) { token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY); }

  async function request(path, options = {}) {
    const headers = { ...(options.headers || {}) };
    if (options.body && !headers["Content-Type"]) headers["Content-Type"] = "application/json";
    if (getToken()) headers.Authorization = `Bearer ${getToken()}`;
    let response;
    try {
      response = await fetch(`${getServerUrl()}${path}`, { ...options, headers });
    } catch {
      throw new Error("Δεν έγινε σύνδεση με τον server. Έλεγξε το Server URL και ότι τρέχει το npm run server.");
    }
    const contentType = response.headers.get("content-type") || "";
    const payload = contentType.includes("application/json") ? await response.json() : await response.text();
    if (!response.ok) {
      const error = new Error(payload?.message || "Ο server απέρριψε το αίτημα.");
      error.status = response.status;
      error.code = payload?.code;
      error.session = payload?.session;
      throw error;
    }
    return payload;
  }

  async function authenticate(path, username, password) {
    const result = await request(path, { method: "POST", body: JSON.stringify({ username, password }) });
    setToken(result.token);
    return result;
  }

  function stopWatching() {
    activeController?.abort();
    activeController = null;
    if (pollTimer) clearInterval(pollTimer);
    pollTimer = null;
  }

  function startPolling(code, onSession, onError, intervalMs = 10000) {
    if (pollTimer) clearInterval(pollTimer);
    const poll = async () => {
      try {
        const result = await request(`/api/sessions/${encodeURIComponent(code)}`);
        if (result.session) onSession(result.session);
      } catch (error) {
        onError?.(error);
      }
    };
    poll();
    pollTimer = setInterval(poll, Math.max(1000, Number(intervalMs) || 10000));
  }

  async function watchSession(code, onSession, onError) {
    stopWatching();
    const controller = new AbortController();
    activeController = controller;
    try {
      const response = await fetch(`${getServerUrl()}/api/sessions/${encodeURIComponent(code)}/events`, {
        headers: { Authorization: `Bearer ${getToken()}` },
        signal: controller.signal,
      });
      if (!response.ok || !response.body) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.message || "Δεν άνοιξε το live session stream.");
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (!controller.signal.aborted) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const chunks = buffer.split("\n\n");
        buffer = chunks.pop() || "";
        for (const chunk of chunks) {
          const data = chunk.split("\n").find(line => line.startsWith("data: "))?.slice(6);
          if (!data) continue;
          const event = JSON.parse(data);
          if (event.session) onSession(event.session);
        }
      }
    } catch (error) {
      if (!controller.signal.aborted) onError?.(error);
    } finally {
      if (activeController === controller) activeController = null;
    }
  }

  return {
    getServerUrl,
    setServerUrl,
    getToken,
    setToken,
    register: (username, password) => authenticate("/api/auth/register", username, password),
    login: (username, password) => authenticate("/api/auth/login", username, password),
    logout: async () => { await request("/api/auth/logout", { method: "POST" }).catch(() => {}); setToken(""); },
    createSession: maxPlayers => request("/api/sessions", { method: "POST", body: JSON.stringify({ maxPlayers }) }),
    joinSession: code => request(`/api/sessions/${encodeURIComponent(code)}/join`, { method: "POST" }),
    getSession: code => request(`/api/sessions/${encodeURIComponent(code)}`),
    setCharacter: (code, character) => request(`/api/sessions/${encodeURIComponent(code)}/character`, { method: "POST", body: JSON.stringify({ character }) }),
    startSession: code => request(`/api/sessions/${encodeURIComponent(code)}/start`, { method: "POST" }),
    updateStage: (code, movie, scene) => request(`/api/sessions/${encodeURIComponent(code)}/stage`, { method: "POST", body: JSON.stringify({ movie, scene }) }),
    updateSceneState: (code, movie, stage, scene, decisionKey = "") => request(`/api/sessions/${encodeURIComponent(code)}/scene-state`, { method: "POST", body: JSON.stringify({ movie, stage, scene, decisionKey }) }),
    sendDecision: (code, key, value) => request(`/api/sessions/${encodeURIComponent(code)}/decisions`, { method: "POST", body: JSON.stringify({ key, value }) }),
    sendChat: (code, text) => request(`/api/sessions/${encodeURIComponent(code)}/chat`, { method: "POST", body: JSON.stringify({ text }) }),
    stopWatching,
    startPolling,
    watchSession,
  };
})();
