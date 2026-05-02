import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GET, POST } from '../../../../src/routes/api/mcp/+server';

function request(body: unknown, token = 'test-mcp-token') {
  return new Request('http://localhost:5173/api/mcp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/event-stream',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });
}

describe('/api/mcp', () => {
  beforeEach(() => {
    vi.stubEnv('MCP_BEARER_TOKEN', 'test-mcp-token');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('rejects requests when MCP_BEARER_TOKEN is not configured', async () => {
    vi.stubEnv('MCP_BEARER_TOKEN', '');

    const response = await GET({
      request: new Request('http://localhost:5173/api/mcp', { method: 'GET' })
    } as any);

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({
      error: expect.stringContaining('MCP is not configured')
    });
  });

  it('rejects requests with an invalid bearer token', async () => {
    const response = await POST({
      request: request({ jsonrpc: '2.0', id: 1, method: 'tools/list' }, 'wrong-token')
    } as any);

    expect(response.status).toBe(401);
  });

  it('advertises all astrology tools and the MCP app UI resource', async () => {
    const response = await POST({
      request: request({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/list'
      })
    } as any);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.result.tools.map((tool: any) => tool.name)).toEqual(
      expect.arrayContaining([
        'calculate_birth_chart',
        'calculate_transits',
        'calculate_synastry',
        'calculate_daily_horoscope'
      ])
    );
    expect(data.result.tools[0]._meta).toMatchObject({
      ui: { resourceUri: 'ui://astrology-suite/app.html' }
    });
  });

  it('serves the app UI resource as an MCP app HTML resource', async () => {
    const response = await POST({
      request: request({
        jsonrpc: '2.0',
        id: 2,
        method: 'resources/read',
        params: {
          uri: 'ui://astrology-suite/app.html'
        }
      })
    } as any);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.result.contents[0]).toMatchObject({
      uri: 'ui://astrology-suite/app.html',
      mimeType: 'text/html;profile=mcp-app'
    });
    expect(data.result.contents[0].text).toContain('OsztrOlogy MCP App');
  });
});
