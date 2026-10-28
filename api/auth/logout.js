'use strict';

const auth = require('../_lib/auth');
const { ok, fail, log } = require('../_lib/http');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return fail(res, 405, 'Méthode non autorisée');
  const user = await auth.currentUser(req);
  if (user) await log(user, 'deconnexion', 'dashboard', 'Déconnexion');
  auth.clearSession(res);
  return ok(res, { ok: true });
};
