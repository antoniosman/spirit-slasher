/*
 * Spirit Slasher local multiplayer server
 *
 * This is intentionally dependency-free so it can run on the developer's PC
 * during testing. It owns accounts, lobby membership and player decisions;
 * the browser is never trusted to decide another player's outcome.
 */

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { URL } = require("node:url");

const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "db.json");
const PORT = Number(process.env.PORT || 8787);
const HOST = process.env.HOST || "0.0.0.0";
const TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const MAX_BODY_BYTES = 1024 * 1024;
const SESSION_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

const clientsBySession = new Map();

function emptyDb() {
  return { users: {}, tokens: {}, sessions: {} };
}

function ensureDb() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_FILE)) {
    const db = emptyDb();
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf8");
    return db;
  }
  try {
    const parsed = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
    return {
      users: parsed.users || {},
      tokens: parsed.tokens || {},
      sessions: parsed.sessions || {},
    };
  } catch (error) {
    console.error("Could not read server/data/db.json; starting with an empty database.", error.message);
    return emptyDb();
  }
}

let db = ensureDb();

function persistDb() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const temporaryFile = `${DB_FILE}.tmp`;
  const serialized = JSON.stringify(db, null, 2);
  fs.writeFileSync(temporaryFile, serialized, "utf8");
  try {
    fs.renameSync(temporaryFile, DB_FILE);
  } catch (error) {
    // Windows can reject a rename over an existing file. Keep local testing
    // resilient while still preferring the atomic path whenever available.
    if (error.code !== "EEXIST" && error.code !== "EPERM") throw error;
    fs.writeFileSync(DB_FILE, serialized, "utf8");
    fs.rmSync(temporaryFile, { force: true });
  }
}

function now() {
  return new Date().toISOString();
}

function normalizeUsername(value) {
  return String(value || "").trim().toLowerCase();
}

function validUsername(username) {
  return /^[a-z0-9_]{3,24}$/.test(username);
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(String(password), salt, 64).toString("hex");
  return { salt, hash };
}

function passwordMatches(password, user) {
  const candidate = crypto.scryptSync(String(password), user.salt, 64);
  const expected = Buffer.from(user.passwordHash, "hex");
  return candidate.length === expected.length && crypto.timingSafeEqual(candidate, expected);
}

function createToken(username) {
  const token = crypto.randomBytes(32).toString("hex");
  db.tokens[token] = { username, createdAt: Date.now() };
  return token;
}

function pruneTokens() {
  const cutoff = Date.now() - TOKEN_TTL_MS;
  for (const [token, session] of Object.entries(db.tokens)) {
    if (!session.createdAt || session.createdAt < cutoff || !db.users[session.username]) {
      delete db.tokens[token];
    }
  }
}

function bearerToken(request) {
  const authorization = request.headers.authorization || "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : "";
}

function authenticatedUser(request) {
  const token = bearerToken(request);
  const tokenRecord = db.tokens[token];
  if (!tokenRecord) return null;
  if (Date.now() - tokenRecord.createdAt > TOKEN_TTL_MS) {
    delete db.tokens[token];
    persistDb();
    return null;
  }
  return db.users[tokenRecord.username] || null;
}

function sendJson(request, response, status, payload) {
  const body = JSON.stringify(payload);
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...corsHeaders(request),
  });
  response.end(body);
}

function sendError(request, response, status, message, code = "error") {
  sendJson(request, response, status, { error: code, message });
}

function corsHeaders(request) {
  const requestOrigin = request.headers.origin;
  const configuredOrigin = process.env.ALLOW_ORIGIN || "*";
  const allowOrigin = configuredOrigin === "*" ? "*" : requestOrigin === configuredOrigin ? configuredOrigin : "null";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function parseBody(request) {
  return new Promise((resolve, reject) => {
    let data = "";
    let bytes = 0;
    request.setEncoding("utf8");
    request.on("data", (chunk) => {
      bytes += Buffer.byteLength(chunk);
      if (bytes > MAX_BODY_BYTES) {
        reject(Object.assign(new Error("Request body is too large."), { statusCode: 413 }));
        request.destroy();
        return;
      }
      data += chunk;
    });
    request.on("end", () => {
      if (!data.trim()) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch {
        reject(Object.assign(new Error("Request body must be valid JSON."), { statusCode: 400 }));
      }
    });
    request.on("error", reject);
  });
}

function requireUser(request, response) {
  const user = authenticatedUser(request);
  if (!user) {
    sendError(request, response, 401, "Sign in is required.", "unauthorized");
    return null;
  }
  return user;
}

function generateSessionCode() {
  for (;;) {
    let code = "";
    for (let index = 0; index < 6; index += 1) {
      code += SESSION_CODE_ALPHABET[crypto.randomInt(SESSION_CODE_ALPHABET.length)];
    }
    if (!db.sessions[code]) return code;
  }
}

function findSession(code) {
  const session = db.sessions[String(code || "").toUpperCase()];
  if (session && !session.seed) {
    session.seed = crypto.randomInt(1, 0x7fffffff);
    persistDb();
  }
  return session;
}

function sessionMember(session, username) {
  return session.players.find((player) => player.username === username);
}

function requireMember(request, response, code) {
  const user = requireUser(request, response);
  if (!user) return null;
  const session = findSession(code);
  if (!session) {
    sendError(request, response, 404, "Session not found.", "session_not_found");
    return null;
  }
  if (!sessionMember(session, user.username)) {
    sendError(request, response, 403, "You are not a member of this session.", "not_a_member");
    return null;
  }
  return { user, session };
}

function publicSession(session, viewer) {
  const pending = {};
  for (const [key, decision] of Object.entries(session.pendingDecisions || {})) {
    pending[key] = {
      submittedBy: Object.keys(decision.submissions || {}),
      submittedByMe: Boolean(decision.submissions && decision.submissions[viewer]),
    };
  }
  return {
    code: session.code,
    host: session.host,
    maxPlayers: session.maxPlayers,
    status: session.status,
    seed: session.seed || 0,
    stage: session.stage,
    players: session.players,
    pendingDecisions: pending,
    history: session.history,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
    me: viewer,
  };
}

function broadcast(session, eventName = "session") {
  const clients = clientsBySession.get(session.code);
  if (!clients || !clients.size) return;
  for (const client of clients) {
    try {
      const payload = JSON.stringify({ event: eventName, session: publicSession(session, client.username) });
      client.response.write(`event: ${eventName}\ndata: ${payload}\n\n`);
    } catch {
      clients.delete(client);
    }
  }
}

function updateSession(session) {
  session.updatedAt = now();
  persistDb();
  broadcast(session);
}

function safeStaticPath(urlPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath);
  } catch {
    return null;
  }
  const relative = decoded === "/" ? "index.html" : decoded.replace(/^\/+/, "");
  if (!relative || relative.includes("\0") || relative.split(/[\\/]/).includes("..")) return null;
  if (relative === "server" || relative.startsWith("server/")) return null;
  return path.resolve(ROOT, relative);
}

function serveStatic(request, response, pathname) {
  const filePath = safeStaticPath(pathname);
  if (!filePath || !filePath.startsWith(`${ROOT}${path.sep}`) || !fs.existsSync(filePath)) {
    sendError(request, response, 404, "Not found.", "not_found");
    return;
  }
  let stat;
  try {
    stat = fs.statSync(filePath);
  } catch {
    sendError(request, response, 404, "Not found.", "not_found");
    return;
  }
  if (!stat.isFile()) {
    sendError(request, response, 404, "Not found.", "not_found");
    return;
  }
  const extension = path.extname(filePath).toLowerCase();
  const contentTypes = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".mp3": "audio/mpeg",
    ".mp4": "video/mp4",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".webmanifest": "application/manifest+json; charset=utf-8",
    ".woff2": "font/woff2",
  };
  const isStreamableMedia = extension === ".mp3" || extension === ".mp4";
  const cacheControl = extension === ".html" || extension === ".js" || extension === ".css"
    ? "no-cache"
    : "public, max-age=86400";
  const commonHeaders = {
    "Content-Type": contentTypes[extension] || "application/octet-stream",
    "Cache-Control": cacheControl,
    "Content-Length": stat.size,
    ...(isStreamableMedia ? { "Accept-Ranges": "bytes" } : {}),
    ...corsHeaders(request),
  };
  if (request.method === "HEAD") {
    response.writeHead(200, commonHeaders);
    response.end();
    return;
  }
  const range = request.headers.range;
  if (isStreamableMedia && range) {
    const match = range.match(/^bytes=(\d*)-(\d*)$/);
    if (!match) {
      response.writeHead(416, { ...commonHeaders, "Content-Range": `bytes */${stat.size}` });
      response.end();
      return;
    }
    const start = match[1] ? Number(match[1]) : Math.max(0, stat.size - Number(match[2] || 0));
    const requestedEnd = match[2] ? Number(match[2]) : stat.size - 1;
    const end = Math.min(requestedEnd, stat.size - 1);
    if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || start > end || start >= stat.size) {
      response.writeHead(416, { ...commonHeaders, "Content-Range": `bytes */${stat.size}` });
      response.end();
      return;
    }
    response.writeHead(206, {
      ...commonHeaders,
      "Content-Length": end - start + 1,
      "Content-Range": `bytes ${start}-${end}/${stat.size}`,
    });
    fs.createReadStream(filePath, { start, end }).pipe(response);
    return;
  }
  response.writeHead(200, commonHeaders);
  fs.createReadStream(filePath).pipe(response);
}

async function handleApi(request, response, url) {
  const pathname = url.pathname;
  const method = request.method || "GET";

  if (method === "GET" && pathname === "/api/health") {
    sendJson(request, response, 200, { ok: true, service: "spirit-slasher-local", version: "1.0.0", time: now() });
    return;
  }

  if (method === "POST" && pathname === "/api/auth/register") {
    const body = await parseBody(request);
    const username = normalizeUsername(body.username);
    const password = String(body.password || "");
    if (!validUsername(username)) {
      sendError(request, response, 422, "Username must be 3–24 letters, numbers or underscores.", "invalid_username");
      return;
    }
    if (password.length < 8 || password.length > 128) {
      sendError(request, response, 422, "Password must be 8–128 characters.", "invalid_password");
      return;
    }
    if (db.users[username]) {
      sendError(request, response, 409, "That username already exists.", "username_taken");
      return;
    }
    const credentials = hashPassword(password);
    db.users[username] = {
      username,
      salt: credentials.salt,
      passwordHash: credentials.hash,
      createdAt: now(),
    };
    const token = createToken(username);
    persistDb();
    sendJson(request, response, 201, { token, user: { username } });
    return;
  }

  if (method === "POST" && pathname === "/api/auth/login") {
    const body = await parseBody(request);
    const username = normalizeUsername(body.username);
    const password = String(body.password || "");
    const user = db.users[username];
    if (!user || !passwordMatches(password, user)) {
      sendError(request, response, 401, "Invalid username or password.", "invalid_credentials");
      return;
    }
    const token = createToken(username);
    persistDb();
    sendJson(request, response, 200, { token, user: { username } });
    return;
  }

  if (method === "POST" && pathname === "/api/auth/logout") {
    const token = bearerToken(request);
    if (token) delete db.tokens[token];
    persistDb();
    sendJson(request, response, 200, { ok: true });
    return;
  }

  if (method === "GET" && pathname === "/api/me") {
    const user = requireUser(request, response);
    if (!user) return;
    sendJson(request, response, 200, { user: { username: user.username } });
    return;
  }

  if (method === "POST" && pathname === "/api/sessions") {
    const user = requireUser(request, response);
    if (!user) return;
    const body = await parseBody(request);
    const requestedMax = Number(body.maxPlayers || 4);
    const maxPlayers = Number.isInteger(requestedMax) ? Math.min(4, Math.max(2, requestedMax)) : 4;
    const code = generateSessionCode();
    const session = {
      code,
      host: user.username,
      maxPlayers,
      seed: crypto.randomInt(1, 0x7fffffff),
      status: "lobby",
      stage: { movie: 1, scene: "lobby" },
      players: [{ username: user.username, character: null, joinedAt: now() }],
      pendingDecisions: {},
      history: [],
      createdAt: now(),
      updatedAt: now(),
    };
    db.sessions[code] = session;
    persistDb();
    sendJson(request, response, 201, { session: publicSession(session, user.username) });
    return;
  }

  const joinMatch = pathname.match(/^\/api\/sessions\/([A-Za-z0-9]+)\/join$/);
  if (method === "POST" && joinMatch) {
    const user = requireUser(request, response);
    if (!user) return;
    const session = findSession(joinMatch[1]);
    if (!session) return sendError(request, response, 404, "Session not found.", "session_not_found");
    if (session.status !== "lobby") return sendError(request, response, 409, "This game has already started.", "game_started");
    if (sessionMember(session, user.username)) return sendJson(request, response, 200, { session: publicSession(session, user.username) });
    if (session.players.length >= session.maxPlayers) return sendError(request, response, 409, "This session is full.", "session_full");
    session.players.push({ username: user.username, character: null, joinedAt: now() });
    updateSession(session);
    sendJson(request, response, 200, { session: publicSession(session, user.username) });
    return;
  }

  const sessionMatch = pathname.match(/^\/api\/sessions\/([A-Za-z0-9]+)$/);
  if (method === "GET" && sessionMatch) {
    const membership = requireMember(request, response, sessionMatch[1]);
    if (!membership) return;
    sendJson(request, response, 200, { session: publicSession(membership.session, membership.user.username) });
    return;
  }

  const characterMatch = pathname.match(/^\/api\/sessions\/([A-Za-z0-9]+)\/character$/);
  if (method === "POST" && characterMatch) {
    const membership = requireMember(request, response, characterMatch[1]);
    if (!membership) return;
    const { user, session } = membership;
    if (session.status !== "lobby") return sendError(request, response, 409, "Characters are locked after the game starts.", "game_started");
    const body = await parseBody(request);
    const character = String(body.character || "").trim();
    if (!character || character.length > 80) return sendError(request, response, 422, "Choose a valid character.", "invalid_character");
    const takenBy = session.players.find((player) => player.character === character && player.username !== user.username);
    if (takenBy) return sendError(request, response, 409, "That character is already selected.", "character_taken");
    sessionMember(session, user.username).character = character;
    updateSession(session);
    sendJson(request, response, 200, { session: publicSession(session, user.username) });
    return;
  }

  const startMatch = pathname.match(/^\/api\/sessions\/([A-Za-z0-9]+)\/start$/);
  if (method === "POST" && startMatch) {
    const membership = requireMember(request, response, startMatch[1]);
    if (!membership) return;
    const { user, session } = membership;
    if (session.host !== user.username) return sendError(request, response, 403, "Only the host can start the game.", "host_only");
    if (session.status !== "lobby") return sendError(request, response, 409, "This game has already started.", "game_started");
    if (session.players.length < 2) return sendError(request, response, 422, "At least two players are required for Online mode.", "not_enough_players");
    if (session.players.some((player) => !player.character)) return sendError(request, response, 422, "Every player must choose a character.", "missing_character");
    session.status = "playing";
    session.stage = { movie: 1, scene: "opening" };
    updateSession(session);
    sendJson(request, response, 200, { session: publicSession(session, user.username) });
    return;
  }

  const stageMatch = pathname.match(/^\/api\/sessions\/([A-Za-z0-9]+)\/stage$/);
  if (method === "POST" && stageMatch) {
    const membership = requireMember(request, response, stageMatch[1]);
    if (!membership) return;
    const { user, session } = membership;
    if (session.host !== user.username) return sendError(request, response, 403, "Only the host can advance the shared game stage.", "host_only");
    if (session.status !== "playing") return sendError(request, response, 409, "The game is not playing yet.", "game_not_started");
    const body = await parseBody(request);
    const movie = Number(body.movie);
    const scene = String(body.scene || "").trim();
    if (![1, 2, 3].includes(movie) || !scene || scene.length > 80) return sendError(request, response, 422, "Invalid game stage.", "invalid_stage");
    session.stage = { movie, scene };
    updateSession(session);
    sendJson(request, response, 200, { session: publicSession(session, user.username) });
    return;
  }

  const decisionMatch = pathname.match(/^\/api\/sessions\/([A-Za-z0-9]+)\/decisions$/);
  if (method === "POST" && decisionMatch) {
    const membership = requireMember(request, response, decisionMatch[1]);
    if (!membership) return;
    const { user, session } = membership;
    if (session.status !== "playing") return sendError(request, response, 409, "The game has not started.", "game_not_started");
    const body = await parseBody(request);
    const key = String(body.key || "").trim();
    if (!key || key.length > 120) return sendError(request, response, 422, "Decision key is required.", "invalid_decision");
    if (!Object.prototype.hasOwnProperty.call(body, "value")) return sendError(request, response, 422, "Decision value is required.", "invalid_decision");
    const serializedValue = JSON.stringify(body.value);
    if (serializedValue.length > 5000) return sendError(request, response, 422, "Decision value is too large.", "invalid_decision");
    const pending = session.pendingDecisions[key] || { submissions: {}, createdAt: now() };
    pending.submissions[user.username] = body.value;
    session.pendingDecisions[key] = pending;
    const everyoneSubmitted = session.players.every((player) => Object.prototype.hasOwnProperty.call(pending.submissions, player.username));
    if (everyoneSubmitted) {
      const resolved = {
        type: "decision-resolved",
        key,
        choices: pending.submissions,
        stage: session.stage,
        resolvedAt: now(),
      };
      session.history.push(resolved);
      delete session.pendingDecisions[key];
      session.updatedAt = now();
      persistDb();
      broadcast(session, "decision-resolved");
    } else {
      updateSession(session);
    }
    sendJson(request, response, 200, { session: publicSession(session, user.username), resolved: everyoneSubmitted });
    return;
  }

  const leaveMatch = pathname.match(/^\/api\/sessions\/([A-Za-z0-9]+)\/leave$/);
  if (method === "POST" && leaveMatch) {
    const membership = requireMember(request, response, leaveMatch[1]);
    if (!membership) return;
    const { user, session } = membership;
    session.players = session.players.filter((player) => player.username !== user.username);
    if (!session.players.length || session.host === user.username) {
      delete db.sessions[session.code];
      persistDb();
      broadcast(session, "session-closed");
      clientsBySession.delete(session.code);
      sendJson(request, response, 200, { ok: true, closed: true });
      return;
    }
    updateSession(session);
    sendJson(request, response, 200, { ok: true, session: publicSession(session, user.username) });
    return;
  }

  const streamMatch = pathname.match(/^\/api\/sessions\/([A-Za-z0-9]+)\/events$/);
  if (method === "GET" && streamMatch) {
    const membership = requireMember(request, response, streamMatch[1]);
    if (!membership) return;
    const { session, user } = membership;
    response.writeHead(200, {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      ...corsHeaders(request),
    });
    response.write(`event: session\ndata: ${JSON.stringify({ event: "session", session: publicSession(session, user.username) })}\n\n`);
    if (!clientsBySession.has(session.code)) clientsBySession.set(session.code, new Set());
    clientsBySession.get(session.code).add({ response, username: user.username });
    const keepAlive = setInterval(() => response.write(": keep-alive\n\n"), 20000);
    request.on("close", () => {
      clearInterval(keepAlive);
      const clients = clientsBySession.get(session.code);
      if (!clients) return;
      for (const client of clients) {
        if (client.response === response) clients.delete(client);
      }
      if (!clients.size) clientsBySession.delete(session.code);
    });
    return;
  }

  sendError(request, response, 404, "API route not found.", "not_found");
}

const server = http.createServer(async (request, response) => {
  if ((request.method || "GET") === "OPTIONS") {
    response.writeHead(204, corsHeaders(request));
    response.end();
    return;
  }
  let url;
  try {
    url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
  } catch {
    sendError(request, response, 400, "Invalid URL.", "invalid_url");
    return;
  }
  try {
    pruneTokens();
    if (url.pathname.startsWith("/api/")) {
      await handleApi(request, response, url);
      return;
    }
    if (request.method === "GET" || request.method === "HEAD") {
      serveStatic(request, response, url.pathname);
      return;
    }
    sendError(request, response, 405, "Method not allowed.", "method_not_allowed");
  } catch (error) {
    console.error("Request failed:", error);
    if (!response.headersSent) sendError(request, response, error.statusCode || 500, error.statusCode ? error.message : "Unexpected server error.", "server_error");
    else response.destroy();
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Spirit Slasher local server listening on http://localhost:${PORT}`);
  console.log("For another device on the same Wi-Fi, use this PC's LAN IPv4 address with the same port.");
  console.log("Set ALLOW_ORIGIN to restrict browser origins; use HTTPS/tunnel before exposing this outside your LAN.");
});

process.on("SIGINT", () => {
  for (const clients of clientsBySession.values()) {
    for (const client of clients) client.response.end();
  }
  server.close(() => process.exit(0));
});
