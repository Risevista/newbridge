export async function onRequest(context: any) {
  const { env, request } = context;
  const url = new URL(request.url);

  const clientId = env.GITHUB_CLIENT_ID;              // ← Pages の環境変数名に合わせる
  const clientSecret = env.GITHUB_CLIENT_SECRET;
  const redirectUri = `${url.origin}/api/auth/callback`;

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  if (!code) return new Response("missing code", { status: 400 });

  // CSRF: state 検証
  const cookie = request.headers.get("Cookie") ?? "";
  const savedState = Object.fromEntries(cookie.split(/; */).filter(Boolean).map((p: string)=>{
    const i=p.indexOf("="); return [decodeURIComponent(p.slice(0,i).trim()), decodeURIComponent(p.slice(i+1).trim())];
  }))['decap_oauth_state'];
  if (!savedState || savedState !== state) return new Response("invalid state", { status: 400 });

  // code -> token 交換（GitHub）
  const resp = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code, redirect_uri: redirectUri }),
  });
  const data = await resp.json(); // { access_token, ... }

  // Decap へ postMessage してポップアップを閉じる
  const payload = { token: data.access_token ?? null, provider: "github", ...data };
  const html = `<!doctype html><meta charset="utf-8"><body><script>
    (function () {
      var payload = ${JSON.stringify(payload)};
      try {
        (window.opener || window.parent).postMessage(payload, window.location.origin);
        (window.opener || window.parent).postMessage(payload, '*');
      } catch (e) {}
      window.close();
      setTimeout(function(){ location.replace('/admin/'); }, 800);
    })();
  </script></body>`;
  return new Response(html, { status: 200, headers: { "Content-Type": "text/html" } });
}


