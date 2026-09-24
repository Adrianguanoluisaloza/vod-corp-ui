// Cloudflare Pages (modo avanzado): sirve el frontend estatico y reenvia la API, el video HLS
// y las miniaturas a la maquina virtual de Azure por HTTPS (certificado Let's Encrypt del host nip.io).
//
// Notas de seguridad:
// - Solo se reenvian rutas explicitas. /health y /internal/* NO se exponen por este Worker.
// - El mensaje de error del fetch no se devuelve al cliente (evita filtrar detalles de la infraestructura).
// - Si el origen no responde por HTTPS (certificado vencido o VM apagada), el cliente recibe un 502 generico.
const ORIGIN = 'https://40.70.241.221.nip.io';
const PROXIED_PREFIXES = ['/api/', '/hls/', '/thumbs/'];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (PROXIED_PREFIXES.some((prefix) => url.pathname.startsWith(prefix))) {
      const headers = new Headers(request.headers);
      headers.set('X-Forwarded-Host', url.host);
      headers.set('X-Forwarded-Proto', 'https');

      const backendReq = new Request(`${ORIGIN}${url.pathname}${url.search}`, {
        method: request.method,
        headers,
        body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
        redirect: 'manual',
      });

      try {
        return await fetch(backendReq);
      } catch (err) {
        return new Response(JSON.stringify({ error: 'Servicio no disponible' }), {
          status: 502,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // Archivos estaticos servidos desde el borde de Cloudflare Pages
    return env.ASSETS.fetch(request);
  },
};
