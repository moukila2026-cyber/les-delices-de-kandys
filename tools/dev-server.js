#!/usr/bin/env node
'use strict';

/**
 * Serveur de développement local : site statique + fonctions de /api.
 * Usage : node tools/dev-server.js [port]
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

/* Mode test : base PostgreSQL en mémoire (pg-mem), utile sans instance Neon.
   Le schéma est créé par api/_lib/db.js au premier appel, comme en production. */
if (process.env.KANDYS_TEST_PG_MEM) {
  const { newDb } = require(process.env.KANDYS_TEST_PG_MEM);
  const memory = newDb({ autoCreateForeignKeyIndices: true });
  const { Client } = memory.adapters.createPg();
  const client = new Client();
  client.connect().then(() => {
    require('../api/_lib/db').__setRunnerForTests(async (text, params) => (await client.query(text, params)).rows);
    console.log('Base de test en mémoire (pg-mem) connectée');
  }).catch((error) => console.error('pg-mem indisponible', error));
}

const ROOT = path.resolve(__dirname, '..');
const PORT = Number(process.argv[2] || process.env.PORT || 8080);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.ttf': 'font/ttf',
  '.ico': 'image/x-icon',
};

function serveStatic(req, res) {
  const url = new URL(req.url, 'http://localhost');
  let pathname = decodeURIComponent(url.pathname);
  if (pathname.endsWith('/')) pathname += 'index.html';
  const file = path.join(ROOT, pathname);

  if (!file.startsWith(ROOT)) {
    res.statusCode = 403;
    return res.end('Interdit');
  }

  fs.stat(file, (error, stats) => {
    if (error || !stats.isFile()) {
      const fallback = path.join(ROOT, 'index.html');
      res.statusCode = error ? 404 : 404;
      if (error && !path.extname(pathname)) {
        return fs.createReadStream(fallback).pipe(res);
      }
      return res.end('Introuvable');
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-store');
    fs.createReadStream(file).pipe(res);
  });
}

async function routeApi(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const relative = url.pathname.replace(/^\/api\/?/, '').replace(/\/$/, '');
  if (!relative) {
    res.statusCode = 404;
    return res.end(JSON.stringify({ error: 'Route inconnue' }));
  }
  const target = path.join(ROOT, 'api', `${relative}.js`);
  if (!target.startsWith(path.join(ROOT, 'api')) || !fs.existsSync(target)) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: `Route /api/${relative} introuvable` }));
  }
  try {
    delete require.cache[require.resolve(target)];
    const handler = require(target);
    await handler(req, res);
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: error.message }));
    }
  }
}

http.createServer((req, res) => {
  if (req.url.startsWith('/api/')) return routeApi(req, res);
  return serveStatic(req, res);
}).listen(PORT, '0.0.0.0', () => {
  console.log(`Kandys — serveur local sur http://0.0.0.0:${PORT}`);
  console.log(`Dashboard : http://0.0.0.0:${PORT}/admin/`);
});
