export async function onRequest(context: any) {
  const { env, request } = context;
  const url = new URL(request.url);
  const clientId = env.GITHUB_CLIENT_ID as string;
  const redirectUri = `${url.origin}/api/auth/callback`;

  const state = random(24);
  const authUrl =
    `https://github.com/login/oauth/authorize` +
    `?client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent("repo")}` +
    `&state=${encodeURIComponent(state)}`;

  return new Response(null, {
    status: 302,
    headers: {
      Location: authUrl,
      "Set-Cookie": `decap_oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
    },
  });
}
function random(len=24){const b=new Uint8Array(len);crypto.getRandomValues(b);return btoa(String.fromCharCode(...b)).replaceAll("+","-").replaceAll("/","_").slice(0,len)}
