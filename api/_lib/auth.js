'use strict';

const crypto = require('crypto');

const SECRET = process.env.SESSION_SECRET || 'dev-secret-kandys-change-me';
const COOKIE = 'kandys_session';
const MAX_AGE = 60 * 60 * 8; // 8 heures
const MAX_AGENTS = 3;

/* -------------------------------------------------------------- mots de passe */

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(String(password), salt, 64).toString('hex');
  return `scrypt$${salt}$${hash}`;
}

function verifyPassword(password, stored) {
  if (!stored || typeof stored !== 'string') return false;
  const [algo, salt, hash] = stored.split('$');
  if (algo !== 'scrypt' || !salt || !hash) return false;
  const candidate = crypto.scryptSync(String(password), salt, 64);
  const expected = Buffer.from(hash, 'hex');
  if (candidate.length !== expected.length) return false;
  return crypto.timingSafeEqual(candidate, expected);
}

/* ------------------------------------------------------------------ jetons */

function b64url(input) {
  return Buffer.from(input).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromB64url(input) {
  return Buffer.from(String(input).replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
}

function sign(payload) {
  const body = b64url(JSON.stringify(payload));
  const sig = crypto.createHmac('sha256', SECRET).update(body).digest('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${body}.${sig}`;
}

function verify(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;
  const [body, sig] = token.split('.');
  const expected = crypto.createHmac('sha256', SECRET).update(body).digest('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const a = Buffer.from(sig || '');
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(fromB64url(body));
    if (!payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ cookies */

function parseCookies(req) {
  const header = req.headers.cookie || '';
  return header.split(';').reduce((acc, part) => {
    const index = part.indexOf('=');
    if (index > -1) acc[part.slice(0, index).trim()] = decodeURIComponent(part.slice(index + 1).trim());
    return acc;
  }, {});
}

function setSession(res, user) {
  const token = sign({
    sub: String(user.id),
    email: user.email,
    role: user.role,
    name: user.name || '',
    exp: Date.now() + MAX_AGE * 1000,
  });
  res.setHeader('Set-Cookie',
    `${COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE}` +
    (process.env.NODE_ENV === 'production' ? '; Secure' : ''));
}

function clearSession(res) {
  res.setHeader('Set-Cookie', `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
}

/* ------------------------------------------------------------------ sessions */

/**
 * Retourne l'utilisateur courant ({id, email, role, name}) ou null.
 * Les comptes agents sont rechargés en base pour respecter une désactivation immédiate.
 */
async function currentUser(req) {
  const payload = verify(parseCookies(req)[COOKIE]);
  if (!payload) return null;
  if (payload.role === 'admin') {
    return { id: payload.sub, email: payload.email, role: 'admin', name: payload.name || 'Administrateur' };
  }
  const db = require('./db');
  try {
    const user = await db.findById('users', payload.sub);
    if (!user || user.active === false || user.role !== 'agent') return null;
    return { id: String(user.id), email: user.email, role: 'agent', name: user.name || user.email };
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------ admin initial */

/** L'administrateur existe via variables d'environnement (un seul compte). */
function adminIdentity() {
  const email = (process.env.ADMIN_EMAIL || 'admin@kandys-pâtisserie.ci').toLowerCase();
  const hash = process.env.ADMIN_PASSWORD_HASH || '';
  const plain = process.env.ADMIN_PASSWORD || '';
  return { email, hash, plain };
}

function checkAdminPassword(password) {
  const { hash, plain } = adminIdentity();
  if (hash) return verifyPassword(password, hash);
  if (plain) return String(password) === plain;
  return false;
}

module.exports = {
  MAX_AGENTS,
  hashPassword,
  verifyPassword,
  setSession,
  clearSession,
  currentUser,
  adminIdentity,
  checkAdminPassword,
  sign,
  verify,
};
