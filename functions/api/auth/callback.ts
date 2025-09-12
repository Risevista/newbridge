export async function onRequest(context: any) {
  const { env, request } = context;
  const url = new URL(request.url);

  const clientId = env.GITHUB_CLIENT_ID;              // ← Pages の環境変数名に合わせる
  const clientSecret = env.GITHUB_CLIENT_SECRET;
  const redirectUri = `${url.origin}/api/auth/callback`;

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  if (!code) {
    const html = `<!doctype html><meta charset="utf-8"><body><script>
      (function () {
        var payload = { error: 'missing_code', message: 'OAuth code is missing', provider: 'github' };
        try { (window.opener || window.parent).postMessage(payload, window.location.origin); } catch (e) {}
        try { localStorage.setItem('netlifycms-github-token', ''); } catch (e) {}
        try { window.close(); } catch (e) {}
        setTimeout(function(){ location.replace('/admin/'); }, 800);
      })();
    </script><p>認証コードが見つかりませんでした。</p></body>`;
    return new Response(html, { status: 400, headers: { "Content-Type": "text/html", "X-Frame-Options": "DENY", "X-Content-Type-Options": "nosniff" } });
  }

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

  if (!resp.ok || !data.access_token) {
    const message = data.error_description || data.error || `token exchange failed (${resp.status})`;
    const html = `<!doctype html><meta charset="utf-8"><body><script>
      (function () {
        var payload = ${JSON.stringify({ error: 'token_exchange_failed', message: String(message), provider: 'github' })};
        try { (window.opener || window.parent).postMessage(payload, window.location.origin); } catch (e) {}
        try { localStorage.setItem('netlifycms-github-token', ''); } catch (e) {}
        try { window.close(); } catch (e) {}
        setTimeout(function(){ location.replace('/admin/'); }, 1200);
      })();
    </script><p>トークンの取得に失敗しました。</p></body>`;
    return new Response(html, { status: 400, headers: { "Content-Type": "text/html", "X-Frame-Options": "DENY", "X-Content-Type-Options": "nosniff" } });
  }

  // Decap へ postMessage してポップアップを閉じる
  const payload = { token: data.access_token ?? null, provider: "github" };
  const html = `<!doctype html><meta charset="utf-8"><body><script>
    (function () {
      var payload = ${JSON.stringify(payload)};
      try { (window.opener || window.parent).postMessage(payload, window.location.origin); } catch (e) {}
      try { localStorage.setItem('netlifycms-github-token', ${JSON.stringify(String(data.access_token || ''))}); } catch (e) {}
      try { window.close(); } catch (e) {}
      setTimeout(function(){ location.replace('/admin/'); }, 800);
    })();
  </script><p>認証が完了しました。このウィンドウは自動的に閉じられます。</p></body>`;
  return new Response(html, { status: 200, headers: { "Content-Type": "text/html", "X-Frame-Options": "DENY", "X-Content-Type-Options": "nosniff" } });
}


