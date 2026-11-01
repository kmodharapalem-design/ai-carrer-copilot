/**
 * Local Development Server for AI Career Copilot
 * Zero external dependencies (uses Node.js native http, fs, path).
 * Emulates Vercel Serverless Function routing for /api/analyze.
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import analyzeHandler from './api/analyze.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;

// Simple .env parser to avoid third-party dependencies
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const lines = content.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

loadEnv();

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // Emulate Vercel Serverless API Route: /api/analyze
  if (pathname === '/api/analyze') {
    // Collect body
    let bodyData = '';
    req.on('data', chunk => {
      bodyData += chunk;
    });

    req.on('end', async () => {
      // Mock Express/Vercel helper methods on res
      const vercelReq = {
        method: req.method,
        headers: req.headers,
        body: bodyData ? (() => { try { return JSON.parse(bodyData); } catch { return bodyData; } })() : {}
      };

      const vercelRes = {
        statusCode: 200,
        headers: {},
        setHeader(k, v) {
          res.setHeader(k, v);
          return this;
        },
        status(code) {
          this.statusCode = code;
          return this;
        },
        json(data) {
          res.writeHead(this.statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify(data, null, 2));
        },
        end(data) {
          res.writeHead(this.statusCode);
          res.end(data);
        }
      };

      try {
        await analyzeHandler(vercelReq, vercelRes);
      } catch (err) {
        console.error('Unhandled API Handler Error:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Server Error', message: err.message }));
      }
    });
    return;
  }

  // Static File Serving
  let filePath = pathname === '/' ? path.join(__dirname, 'index.html') : path.join(__dirname, pathname);

  // Security: prevent directory traversal
  const safePath = path.normalize(filePath);
  if (!safePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(safePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(safePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    const readStream = fs.createReadStream(safePath);
    readStream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(` 🚀 AI Career Copilot local dev server running!`);
  console.log(` 🌐 Open: http://localhost:${PORT}`);
  console.log(` 🔑 GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? 'Configured ✅' : 'NOT FOUND ⚠️ (add to .env)'}`);
  console.log(`======================================================\n`);
});
