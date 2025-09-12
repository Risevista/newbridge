// functions/api/auth/callback.ts
export async function onRequest(context: any) {
  const { env, request } = context;
  const url = new URL(request.url);

  const code = url.searchParams.get("code");
  if (!code) return html("error", { error: "missing_code" }, 400);

  const client_id = env.GITHUB_CLIENT_ID as string;
  const client_secret = env.GITHUB_CLIENT_SECRET as string;
  if (!client_id || !client_secret) {
    return html("error", { error: "missing_env" }, 500);
  }

  // GitHubでトークン交換
  const r = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id,
      client_secret,
      code,
      redirect_uri: `${url.origin}/api/auth/callback`,
    }),
  });
  const data = (await r.json()) as any;
  if (!r.ok || data.error || !data.access_token) {
    return html("error", data, 401);
  }

  // --- 親ウィンドウへ結果を返す（文字列プロトコル） ---
  return html("success", { token: data.access_token, provider: "github" }, 200);
}

/** 親→子のmessage受信後、親origin宛てに結果をpostMessage */
function html(status: "success" | "error", payload: any, code = 200) {
  const script = `
    (function () {
      function sendTo(openerOrigin) {
        var msg = 'authorization:github:${status}:' + JSON.stringify(${JSON.stringify(payload)});
        if (window.opener && typeof window.opener.postMessage === 'function') {
          window.opener.postMessage(msg, openerOrigin);
        }
        // 親が受け取れたら自動で閉じられるケースが多いですが、
        // 念のため少し待ってから閉じます。
        setTimeout(function(){ window.close(); }, 50);
      }
      // 親が最初にpostMessageしてくるのを待って origin を確定
      function receive(e){ try { sendTo(e.origin); } finally { window.removeEventListener('message', receive); } }
      window.addEventListener('message', receive, false);
      // 合図（親に origin を投げさせる）
      if (window.opener) window.opener.postMessage('authorizing:github', '*');
    })();
  `;
  return new Response(`<!doctype html><meta charset="utf-8"><script>${script}</script>`, {
    status: code,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
