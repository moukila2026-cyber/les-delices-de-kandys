'use strict';

const db = require('../_lib/db');
const auth = require('../_lib/auth');
const { ok, fail, body, email: toEmail, log } = require('../_lib/http');

// Limitation simple des tentatives (par instance serverless).
const attempts = new Map();
const WINDOW = 10 * 60 * 1000;
const MAX_TRIES = 8;

function tooMany(key) {
  const entry = attempts.get(key);
  if (!entry) return false;
  if (Date.now() - entry.first > WINDOW) {
    attempts.delete(key);
    return false;
  }
  return entry.count >= MAX_TRIES;
}

function registerFail(key) {
  const entry = attempts.get(key);
  if (!entry || Date.now() - entry.first > WINDOW) {
    attempts.set(key, { count: 1, first: Date.now() });
  } else {
    entry.count += 1;
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return fail(res, 405, 'Méthode non autorisée');

  const data = await body(req);
  const mail = toEmail(data.email);
  const password = String(data.password || '');

  if (!mail || password.length < 4) {
    return fail(res, 400, 'E-mail ou mot de passe manquant.');
  }

  const key = `${mail}`;
  if (tooMany(key)) {
    return fail(res, 429, 'Trop de tentatives. Réessayez dans quelques minutes.');
  }

  try {
    // 1. Administrateur principal (variables d'environnement ou mot de passe modifié en base)
    const admin = auth.adminIdentity();
    if (mail === admin.email) {
      const stored = await db.select('users', { role: 'admin' }).catch(() => []);
      const override = stored[0];
      // Dès qu'un mot de passe a été défini dans le dashboard, il remplace celui des variables d'environnement.
      const valid = override
        ? auth.verifyPassword(password, override.password_hash)
        : auth.checkAdminPassword(password);
      if (!valid) {
        registerFail(key);
        return fail(res, 401, 'E-mail ou mot de passe incorrect.', 'bad_credentials');
      }
      const user = {
        id: override ? override.id : 'admin',
        email: admin.email,
        role: 'admin',
        name: 'Administrateur',
      };
      auth.setSession(res, user);
      await log(user, 'connexion', 'dashboard', 'Connexion administrateur');
      return ok(res, { user });
    }

    // 2. Agents
    const rows = await db.select('users', { email: mail });
    const agent = rows.find((row) => row.role === 'agent');
    if (!agent || agent.active === false || !auth.verifyPassword(password, agent.password_hash)) {
      registerFail(key);
      return fail(res, 401, 'E-mail ou mot de passe incorrect.', 'bad_credentials');
    }

    const user = { id: String(agent.id), email: agent.email, role: 'agent', name: agent.name };
    auth.setSession(res, user);
    await log(user, 'connexion', 'dashboard', 'Connexion agent');
    return ok(res, { user });
  } catch (error) {
    console.error(error);
    return fail(res, 500, 'Connexion impossible pour le moment.');
  }
};
