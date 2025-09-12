export const onRequest = async (context:any) => {
    const { env, request } = context;
    const code = new URL(request.url).searchParams.get("code");
    if (!code) return new Response(JSON.stringify({ error:"missing code" }), { status:400 });
  
    const resp = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });
    const data = await resp.json();
    return new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } });
  };
  