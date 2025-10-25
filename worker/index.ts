interface Env {
  ENVIRONMENT: string;
  // Add your environment bindings here
  // MY_KV: KVNamespace;
}

export interface ExecutionContext {
  waitUntil(promise: Promise<any>): void;
  passThroughOnException(): void;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      // Basic router based on request method and URL
      const url = new URL(request.url);
      
      // Handle different routes here
      if (url.pathname === '/api/health') {
        return new Response(JSON.stringify({ status: 'ok' }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Default 404 response
      return new Response('Not Found', { status: 404 });
      
    } catch (error) {
      // Error handling
      console.error('Worker error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  },
};