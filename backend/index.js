import http from 'node:http';
import { httpServerHandler } from 'cloudflare:node';
import app from './server.js';

const server = http.createServer(app);
const handler = httpServerHandler(server);

export default {
  async fetch(request, env, ctx) {
    if (env) {
      for (const key in env) {
        process.env[key] = env[key];
      }
    }
    return handler.fetch(request, env, ctx);
  }
};
