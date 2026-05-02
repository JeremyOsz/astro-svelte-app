import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { createAstrologyMcpServer } from '$lib/server/mcp/astrology-tools';

function unauthorized(message = 'Unauthorized') {
  return new Response(JSON.stringify({ error: message }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' }
  });
}

function unavailable(message: string) {
  return new Response(JSON.stringify({ error: message }), {
    status: 503,
    headers: { 'Content-Type': 'application/json' }
  });
}

function checkBearerToken(request: Request): Response | null {
  const expectedToken = (env.MCP_BEARER_TOKEN || process.env.MCP_BEARER_TOKEN)?.trim();
  if (!expectedToken) {
    return unavailable('MCP is not configured. Set MCP_BEARER_TOKEN in your environment.');
  }

  const authHeader = request.headers.get('authorization') || '';
  if (authHeader !== `Bearer ${expectedToken}`) {
    return unauthorized();
  }

  return null;
}

async function handleMcpRequest(request: Request): Promise<Response> {
  const authError = checkBearerToken(request);
  if (authError) return authError;

  const server = createAstrologyMcpServer();
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true
  });

  await server.connect(transport);
  return transport.handleRequest(request);
}

export const GET: RequestHandler = async ({ request }) => handleMcpRequest(request);
export const POST: RequestHandler = async ({ request }) => handleMcpRequest(request);
export const DELETE: RequestHandler = async ({ request }) => handleMcpRequest(request);

export const OPTIONS: RequestHandler = async () =>
  new Response(null, {
    status: 204,
    headers: {
      Allow: 'GET,POST,DELETE,OPTIONS'
    }
  });
