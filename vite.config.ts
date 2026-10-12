import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { handleNewsApiRequest } from './src/server/serpApiHandler.ts'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'civiclens-news-api',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url && req.url.startsWith('/api/news')) {
              try {
                await handleNewsApiRequest(req, res, env.SERPAPI_API_KEY);
              } catch (err) {
                console.error('[API Middleware] Error handling news request:', err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Internal server error in news API' }));
              }
              return;
            }
            next();
          });
        },
        configurePreviewServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url && req.url.startsWith('/api/news')) {
              try {
                await handleNewsApiRequest(req, res, env.SERPAPI_API_KEY);
              } catch (err) {
                console.error('[API Preview Middleware] Error handling news request:', err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Internal server error in news API' }));
              }
              return;
            }
            next();
          });
        },
      },
    ],
  };
});
