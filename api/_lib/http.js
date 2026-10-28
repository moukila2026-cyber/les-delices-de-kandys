'use strict';

const crypto = require('crypto');

function json(res, status, data, extraHeaders) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  Object.entries(extraHeaders || {}).forEach(([key, value]) => res.setHeader(key, value));
  res.end(JSON.stringify(data));
}

function ok(res, data) {
  return json(res, 200, data);
}

function fail(res, status, message, code) {
  return json(res, status, { error: message, code: code || null });
}

async function body(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 8_000_000) req.destroy();
    });
    req.on('end', () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

function id(prefix = '') {
  return `${prefix}${Date.now().toString(36)}${crypto.randomBytes(4).toString('hex')}`;
}

function now() {
  return new Date().toISOString();
}

function clean(value, max = 500) {
  return String(value === undefined || value === null ? '' : value).trim().slice(0, max);
}

function email(value) {
  const mail = clean(value, 160).toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail) ? mail : null;
}

/** Journal d'activité : qui a fait quoi, quand. */
async function log(actor, action, target, details) {
  const db = require('./db');
  try {
    await db.insert('logs', {
      id: id('log_'),
      actor_id: actor ? String(actor.id) : 'public',
      actor_email: actor ? actor.email : 'visiteur',
      actor_role: actor ? actor.role : 'public',
      action,
      target: target || '',
      details: details || '',
      created_at: now(),
    });
  } catch (error) {
    console.error('Journal indisponible', error);
  }
}

module.exports = { json, ok, fail, body, id, now, clean, email, log };
