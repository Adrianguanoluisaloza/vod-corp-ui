export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Proxy API, HLS, Thumbs and Health requests to the Azure VM backend via hostname
    if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/hls/') || url.pathname.startsWith('/thumbs/') || url.pathname === '/health') {
      const backendUrl = `http://40.70.241.221.nip.io${url.pathname}${url.search}`;

      const headers = new Headers(request.headers);
      headers.set('X-Forwarded-Host', url.host);
      headers.set('X-Forwarded-Proto', url.protocol.replace(':', ''));

      const backendReq = new Request(backendUrl, {
        method: request.method,
        headers: headers,
        body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
        redirect: 'manual'
      });

      try {
        const response = await fetch(backendReq);
        return response;
      } catch (err) {
        return new Response(JSON.stringify({ error: 'Backend unreachable', details: err.message }), {
          status: 502,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Static assets are served directly from Cloudflare Pages Edge
    return env.ASSETS.fetch(request);
  }
};
