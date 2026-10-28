'use strict';

const db = require('../_lib/db');
const auth = require('../_lib/auth');
const { ok, fail, body, log } = require('../_lib/http');

const MIN_LENGTH = 8;

module.exports = async function handler(req, res) {
  if (req.method !== 'PATCH') return fail(res, 405, 'Méthode non autorisée');

  const user = await auth.currentUser(req);
  if (!user) return fail(res, 401, 'Session expirée. Reconnectez-vous.');

  const data = await body(req);
  const current = String(data.current || '');
  const next = String(data.next || '');

  if (next.length < MIN_LENGTH) {
    return fail(res, 400, `Le nouveau mot de passe doit contenir au moins ${MIN_LENGTH} caractères.`);
  }

  try {
    if (user.role === 'admin') {
      const stored = (await db.select('users', { role: 'admin' }))[0];
      const valid = stored
        ? auth.verifyPassword(current, stored.password_hash)
        : auth.checkAdminPassword(current);
      if (!valid) return fail(res, 403, 'Mot de passe actuel incorrect.');
      const hash = auth.hashPassword(next);
      if (stored) {
        await db.update('users', stored.id, { password_hash: hash, updated_at: new Date().toISOString() });
      } else {
        await db.insert('users', {
          id: 'admin',
          email: auth.adminIdentity().email,
          name: 'Administrateur',
          role: 'admin',
          active: true,
          password_hash: hash,
          created_at: new Date().toISOString(),
        });
      }
      await log(user, 'mot_de_passe', 'compte', 'Mot de passe administrateur modifié');
      return ok(res, { ok: true });
    }

    const row = await db.findById('users', user.id);
    if (!row || !auth.verifyPassword(current, row.password_hash)) {
      return fail(res, 403, 'Mot de passe actuel incorrect.');
    }
    await db.update('users', user.id, {
      password_hash: auth.hashPassword(next),
      updated_at: new Date().toISOString(),
    });
    await log(user, 'mot_de_passe', 'compte', 'Mot de passe agent modifié');
    return ok(res, { ok: true });
  } catch (error) {
    console.error(error);
    return fail(res, 500, 'Modification impossible.');
  }
};
