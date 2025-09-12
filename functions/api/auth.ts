// Cloudflare Pages Functions での認証エンドポイント
// Decap CMS用のGitHub OAuth認証

export async function onRequest(context: any) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  // GitHub OAuth の処理
  if (url.pathname === '/api/auth') {
    const clientId = env.GITHUB_CLIENT_ID;
    const redirectUri = `${url.origin}/api/auth/callback`;
    
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo`;
    
    return Response.redirect(authUrl);
  }
  
  if (url.pathname === '/api/auth/callback') {
    const code = url.searchParams.get('code');
    if (!code) {
      return new Response('Authorization code not found', { status: 400 });
    }
    
    // GitHub OAuth トークン取得
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code: code,
      }),
    });
    
    const tokenData = await tokenResponse.json();
    
    if (tokenData.access_token) {
      // Decap CMS用の認証レスポンス
      const authResponse = {
        access_token: tokenData.access_token,
        token_type: 'bearer',
        scope: 'repo'
      };
      
      return new Response(JSON.stringify(authResponse), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }
    
    return new Response('Authentication failed', { status: 400 });
  }
  
  // OPTIONS リクエストの処理（CORS用）
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }
  
  return new Response('Not found', { status: 404 });
}
