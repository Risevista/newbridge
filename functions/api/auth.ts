// Cloudflare Pages Functions: Decap CMS用 GitHub OAuth エンドポイント

export async function onRequest(context: any) {
  const { request, env } = context;
  const url = new URL(request.url);

  const CLIENT_ID = env.GITHUB_CLIENT_ID;
  const CLIENT_SECRET = env.GITHUB_CLIENT_SECRET;
  const REDIRECT_URI = `${url.origin}/api/auth/callback`;

  // 最低限のCORS
  const cors = {
    "Access-Control-Allow-Origin": url.origin,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: cors });
  }

  // /api/auth は Decapが最初に叩く → /loginへ誘導
  if (url.pathname === "/api/auth") {
    const state = cryptoRandomString(24);
    const authUrl =
      `https://github.com/login/oauth/authorize` +
      `?client_id=${encodeURIComponent(CLIENT_ID)}` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      `&scope=${encodeURIComponent("repo")}` +
      `&state=${encodeURIComponent(state)}`;

    const headers = new Headers({
      "Set-Cookie": `decap_oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
    });
    return Response.redirect(authUrl, 302, { headers });
  }

  // GitHubから戻る
  if (url.pathname === "/api/auth/callback") {
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    if (!code) return json({ error: "missing_code" }, 400, cors);

    // state検証（CSRF対策）
    const cookie = request.headers.get("Cookie") || "";
    const savedState = parseCookie(cookie)["decap_oauth_state"];
    if (!savedState || savedState !== state) {
      return json({ error: "invalid_state" }, 400, cors);
    }

    // code -> access_token 交換
    const resp = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    const data = await resp.json(); // { access_token, token_type, scope } など
    // DecapはJSONを期待している。ここで/adminにリダイレクトしないこと！
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json", ...cors },
    });
  }

  return new Response("Not found", { status: 404, headers: cors });
}

/* ---------- helpers ---------- */
function parseCookie(cookie: string): Record<string, string> {
  return Object.fromEntries(
    cookie.split(/; */).filter(Boolean).map(pair => {
      const idx = pair.indexOf("=");
      const k = decodeURIComponent(pair.slice(0, idx).trim());
      const v = decodeURIComponent(pair.slice(idx + 1).trim());
      return [k, v];
    })
  );
}

function cryptoRandomString(len = 24) {
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes))
    .replaceAll("+", "-").replaceAll("/", "_").slice(0, len);
}

function json(obj: any, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}
