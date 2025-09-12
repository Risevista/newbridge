export async function onRequest(context: any) {
  const { env, request } = context;
  const url = new URL(request.url);

  const clientId = env.GITHUB_CLIENT_ID as string;
  const clientSecret = env.GITHUB_CLIENT_SECRET as string;
  const redirectUri = `${url.origin}/api/auth/callback`;

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  if (!code) return new Response("missing code", { status: 400 });

  // CSRF: state 検証
  const cookie = request.headers.get("Cookie") ?? "";
  const saved = Object.fromEntries(cookie.split(/; */).filter(Boolean).map(p=>{
    const i=p.indexOf("=");return [decodeURIComponent(p.slice(0,i).trim()), decodeURIComponent(p.slice(i+1).trim())];
  }))["decap_oauth_state"];
  if (!saved || saved !== state) return new Response("invalid state", { status: 400 });

  // code -> access_token
  const resp = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code, redirect_uri: redirectUri }),
  });
  const data = await resp.json(); // { access_token, ... }

  const payload = { token: data.access_token ?? null, provider: "github", ...data };

  // Decap に postMessage してポップアップを閉じる
  const html = `<!doctype html><meta charset="utf-8"><body><script>
    (function(){
      var payload = ${JSON.stringify(payload)};
      try{ (window.opener||window.parent).postMessage(payload, window.location.origin);
           (window.opener||window.parent).postMessage(payload, '*'); }catch(e){}
      window.close(); setTimeout(function(){ location.replace('/admin/'); }, 800);
    })();
  </script></body>`;
  return new Response(html, { status: 200, headers: { "Content-Type": "text/html" } });
}
