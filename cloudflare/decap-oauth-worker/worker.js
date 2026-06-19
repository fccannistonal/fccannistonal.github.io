const githubAuthorizeUrl = 'https://github.com/login/oauth/authorize';
const githubTokenUrl = 'https://github.com/login/oauth/access_token';

function createResponse(body, init = {}) {
  return new Response(body, {
    ...init,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      ...(init.headers ?? {}),
    },
  });
}

function randomState() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function readCookie(request, name) {
  const cookie = request.headers.get('cookie') ?? '';
  return cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

function callbackHtml(origin, provider, type, payload) {
  const message = `authorization:${provider}:${type}:${JSON.stringify(payload)}`;

  return `<!doctype html>
<html>
  <body>
    <script>
      window.opener && window.opener.postMessage(${JSON.stringify(message)}, ${JSON.stringify(origin)});
      window.close();
    </script>
  </body>
</html>`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const allowedOrigin = env.ALLOWED_ORIGIN || 'https://fccanniston.com';

    if (url.pathname === '/auth') {
      const state = randomState();
      const redirectUrl = new URL(githubAuthorizeUrl);
      redirectUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
      redirectUrl.searchParams.set('redirect_uri', `${url.origin}/callback`);
      redirectUrl.searchParams.set('scope', 'repo');
      redirectUrl.searchParams.set('state', state);

      return new Response(null, {
        status: 302,
        headers: {
          location: redirectUrl.toString(),
          'set-cookie': `oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`,
          'cache-control': 'no-store',
        },
      });
    }

    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      const cookieState = readCookie(request, 'oauth_state');

      if (!code || !state || state !== cookieState) {
        return createResponse(
          callbackHtml(allowedOrigin, 'github', 'error', { error: 'Invalid OAuth state.' })
        );
      }

      const tokenResponse = await fetch(githubTokenUrl, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: `${url.origin}/callback`,
        }),
      });
      const payload = await tokenResponse.json();

      if (!tokenResponse.ok || !payload.access_token) {
        return createResponse(
          callbackHtml(allowedOrigin, 'github', 'error', {
            error: payload.error_description || 'GitHub token exchange failed.',
          })
        );
      }

      return createResponse(
        callbackHtml(allowedOrigin, 'github', 'success', { token: payload.access_token }),
        {
          headers: {
            'set-cookie': 'oauth_state=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0',
          },
        }
      );
    }

    return createResponse('Not found', { status: 404 });
  },
};
