export async function onRequest(context: any) {
  const { env, request } = context;
  const url = new URL(request.url);

  const clientId = env.GITHUB_CLIENT_ID;              // ← Pages の環境変数名に合わせる
  const redirectUri = `${url.origin}/api/auth/callback`;

  const state = cryptoRandomString(24);
  const authUrl =
    `https://github.com/login/oauth/authorize` +
    `?client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent("public_repo")}` +
    `&state=${encodeURIComponent(state)}`;

  const headers = new Headers({
    "Location": authUrl,
    "Set-Cookie": `decap_oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
  });
  return new Response(null, { status: 302, headers });
}

function cryptoRandomString(len = 24) {
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes)).replaceAll("+", "-").replaceAll("/", "_").slice(0, len);
}
