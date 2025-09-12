// Cloudflare Pages Functions: Decap CMS 用 GitHub OAuth

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

  // 入口: /api/auth -> GitHub 認可へ（state を Cookie に保存）
  if (url.pathname === "/api/auth") {
    const state = cryptoRandomString(24);
    const authUrl =
      `https://github.com/login/oauth/authorize` +
      `?client_id=${encodeURIComponent(CLIENT_ID)}` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      `&scope=${encodeURIComponent("repo")}` +
      `&state=${encodeURIComponent(state)}`;

    const headers = new Headers({
      "Location": authUrl,
      "Set-Cookie": `decap_oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
    });
    return new Response(null, { status: 302, headers });
  }

  // コールバック: /api/auth/callback -> token 取得して親ウィンドウへ postMessage
  if (url.pathname === "/api/auth/callback") {
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    if (!code) return json({ error: "missing_code" }, 400, cors);

    // CSRF: state 検証
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

    const data = await resp.json(); // { access_token, token_type, scope, ... }

    // Decap が受け取りやすい形に整形して postMessage
    const payload = {
      token: data.access_token || null,
      provider: "github",
      ...data,
    };

    const html = `<!doctype html><meta charset="utf-8"><body><script>
      (function () {
        var payload = ${JSON.stringify(payload)};
        try {
          (window.opener || window.parent).postMessage(payload, window.location.origin);
          (window.opener || window.parent).postMessage(payload, '*'); // 念のため
        } catch (e) {}
        window.close();
        setTimeout(function(){ location.replace('/admin/'); }, 800);
      })();
    </script></body>`;

    return new Response(html, { status: 200, headers: { "Content-Type": "text/html", ...cors } });
  }

  return new Response("Not found", { status: 404, headers: cors });
}

/* helpers */
function parseCookie(cookie: string): Record<string, string> {
  return Object.fromEntries(
    cookie.split(/; */).filter(Boolean).map(pair => {
      const i = pair.indexOf("=");
      const k = decodeURIComponent(pair.slice(0, i).trim());
      const v = decodeURIComponent(pair.slice(i + 1).trim());
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
