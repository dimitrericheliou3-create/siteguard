export async function onRequest(context) {
  const response = await context.next();
  const headers = new Headers(response.headers);
  headers.set("X-Content-Type-Options","nosniff");
  headers.set("X-Frame-Options","DENY");
  headers.set("Referrer-Policy","strict-origin-when-cross-origin");
  headers.set("Permissions-Policy","camera=(), microphone=(), geolocation=()");
  headers.set("Strict-Transport-Security","max-age=31536000; includeSubDomains");
  headers.set("Content-Security-Policy","default-src 'self'; script-src 'self' https://www.paypal.com https://www.sandbox.paypal.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://api-m.paypal.com https://api-m.sandbox.paypal.com; frame-src https://www.paypal.com https://www.sandbox.paypal.com; base-uri 'self'; form-action 'self'");
  return new Response(response.body,{status:response.status,statusText:response.statusText,headers});
}