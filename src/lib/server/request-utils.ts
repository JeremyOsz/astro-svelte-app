export function getClientIp(request: Request): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();

  const xrip = request.headers.get('x-real-ip');
  if (xrip) return xrip.trim();

  return 'unknown';
}
