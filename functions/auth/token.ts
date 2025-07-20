export const onRequest = async (context:any) => {
    const { env, request } = context

    const clientId = env.PUBLIC_OAUTH_GITHUB_CLIENT_ID;
    const clientSecret = env.PUBLIC_OAUTH_GITHUB_CLIENT_SECRET;
    const tokenUrl = 'https://github.com/login/oauth/access_token';

    const code = new URL(request.url)?.searchParams.get('code');

    if (!code) return new Response("codeが指定されていません");
    const data = {
        code,
        client_id: clientId,
        client_secret: clientSecret,
    };

    try {
        const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            return new Response("トークンが取得できませんでした: ネットワークエラー");
        }

        const body = await response.json();
        if (body.error) return new Response(`トークンが取得できませんでした: ${body.error} ${body.error_description || ""}`);
        return new Response(`token:${body.access_token}`)
    } catch (err) {
        return new Response(`トークンが取得できませんでした: ${(err as Error)?.message || ""}`);
    }
}