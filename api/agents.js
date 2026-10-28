'use strict';

const db = require('./_lib/db');
const auth = require('./_lib/auth');
const { ok, fail, body, id, now, clean, email: toEmail, log } = require('./_lib/http');

/** Gestion des agents — réservée à l'administrateur, 3 comptes maximum. */
module.exports = async function handler(req, res) {
  const user = await auth.currentUser(req);
  if (!user) return fail(res, 401, 'Session expirée. Reconnectez-vous.');
  if (user.role !== 'admin') return fail(res, 403, 'Seul l’administrateur gère les agents.');

  const url = new URL(req.url, 'http://localhost');

  try {
    const agents = async () => (await db.select('users', { role: 'agent' }, { order: 'created_at.asc' }))
      .map((row) => ({
        id: row.id,
        email: row.email,
        name: row.name,
        active: row.active !== false,
        created_at: row.created_at,
        last_login: row.last_login || null,
      }));

    if (req.method === 'GET') {
      const rows = await agents();
      return ok(res, {
        agents: rows,
        max: auth.MAX_AGENTS,
        remaining: Math.max(0, auth.MAX_AGENTS - rows.filter((a) => a.active).length),
      });
    }

    if (req.method === 'POST') {
      const data = await body(req);
      const mail = toEmail(data.email);
      const name = clean(data.name, 80);
      const password = String(data.password || '');
      if (!mail) return fail(res, 400, 'Adresse e-mail invalide.');
      if (!name) return fail(res, 400, 'Le nom de l’agent est obligatoire.');
      if (password.length < 8) return fail(res, 400, 'Mot de passe : 8 caractères minimum.');

      const existing = await db.select('users', { email: mail });
      if (existing.length) return fail(res, 409, 'Cette adresse e-mail est déjà utilisée.');

      const rows = await agents();
      const activeCount = rows.filter((agent) => agent.active).length;
      if (activeCount >= auth.MAX_AGENTS) {
        return fail(res, 409, `Limite atteinte : ${auth.MAX_AGENTS} comptes agents actifs maximum.`);
      }

      const agent = {
        id: id('usr_'),
        email: mail,
        name,
        role: 'agent',
        active: true,
        password_hash: auth.hashPassword(password),
        created_at: now(),
        updated_at: now(),
      };
      await db.insert('users', agent);
      await log(user, 'agent_cree', agent.id, `${name} — ${mail}`);
      return ok(res, { agent: { id: agent.id, email: agent.email, name: agent.name, active: true } });
    }

    if (req.method === 'PATCH') {
      const data = await body(req);
      const target = clean(data.id, 60) || url.searchParams.get('id');
      const row = target ? await db.findById('users', target) : null;
      if (!row || row.role !== 'agent') return fail(res, 404, 'Agent introuvable.');

      const patch = { updated_at: now() };
      if (data.name !== undefined) patch.name = clean(data.name, 80) || row.name;
      if (data.active !== undefined) patch.active = Boolean(data.active);
      if (data.password) {
        if (String(data.password).length < 8) return fail(res, 400, 'Mot de passe : 8 caractères minimum.');
        patch.password_hash = auth.hashPassword(String(data.password));
      }
      const updated = await db.update('users', target, patch);
      await log(user, 'agent_modifie', target,
        `${row.email}${patch.active === false ? ' · désactivé' : ''}${patch.password ? ' · mot de passe réinitialisé' : ''}`);
      return ok(res, {
        agent: {
          id: updated.id,
          email: updated.email,
          name: updated.name,
          active: updated.active !== false,
          created_at: updated.created_at,
        },
      });
    }

    if (req.method === 'DELETE') {
      const target = url.searchParams.get('id') || clean((await body(req)).id, 60);
      const row = target ? await db.findById('users', target) : null;
      if (!row || row.role !== 'agent') return fail(res, 404, 'Agent introuvable.');
      await db.remove('users', target);
      await log(user, 'agent_supprime', target, row.email);
      return ok(res, { ok: true });
    }

    return fail(res, 405, 'Méthode non autorisée');
  } catch (error) {
    console.error(error);
    return fail(res, 500, 'Opération impossible.');
  }
};
