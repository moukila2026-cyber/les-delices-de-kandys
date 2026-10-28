'use strict';

const db = require('./_lib/db');
const auth = require('./_lib/auth');
const { ok, fail, body, id, now, clean, log } = require('./_lib/http');

const STATUSES = ['nouvelle', 'en_cours', 'prete', 'livree', 'annulee'];

function normaliseOrder(row) {
  return {
    id: row.id,
    nom: row.nom,
    prenoms: row.prenoms,
    telephone: row.telephone,
    localisation: row.localisation,
    type: row.type,
    description: row.description,
    status: row.status || 'nouvelle',
    note: row.note || '',
    created_at: row.created_at,
    updated_at: row.updated_at || row.created_at,
    updated_by: row.updated_by || '',
  };
}

module.exports = async function handler(req, res) {
  const url = new URL(req.url, 'http://localhost');

  /* -------------------------------------------------------- création publique */
  if (req.method === 'POST') {
    const data = await body(req);
    const payload = {
      nom: clean(data.nom, 80),
      prenoms: clean(data.prenoms, 80),
      telephone: clean(data.telephone, 40),
      localisation: clean(data.localisation, 120),
      type: clean(data.type, 80),
      description: clean(data.description, 1500),
    };
    if (!payload.nom || !payload.telephone || !payload.description) {
      return fail(res, 400, 'Nom, téléphone et description sont obligatoires.');
    }
    try {
      const order = {
        id: id('cmd_'),
        ...payload,
        status: 'nouvelle',
        note: '',
        created_at: now(),
        updated_at: now(),
        updated_by: '',
      };
      await db.insert('orders', order);
      await log(null, 'commande_creee', order.id, `${order.nom} — ${order.type}`);
      return ok(res, { order: normaliseOrder(order) });
    } catch (error) {
      console.error(error);
      return fail(res, 500, 'Commande non enregistrée.');
    }
  }

  /* ------------------------------------------------------------ lecture interne */
  const user = await auth.currentUser(req);
  if (!user) return fail(res, 401, 'Session expirée. Reconnectez-vous.');

  try {
    if (req.method === 'GET') {
      const status = url.searchParams.get('status') || '';
      const search = (url.searchParams.get('q') || '').toLowerCase();
      let rows = await db.select('orders', {}, { order: 'created_at.desc' });
      if (status && STATUSES.includes(status)) {
        rows = rows.filter((row) => (row.status || 'nouvelle') === status);
      }
      if (search) {
        rows = rows.filter((row) =>
          [row.nom, row.prenoms, row.telephone, row.description, row.type]
            .join(' ')
            .toLowerCase()
            .includes(search));
      }
      const counts = STATUSES.reduce((acc, key) => {
        acc[key] = rows.filter((row) => (row.status || 'nouvelle') === key).length;
        return acc;
      }, {});
      return ok(res, {
        orders: rows.map(normaliseOrder),
        counts,
        total: rows.length,
        canDelete: user.role === 'admin',
      });
    }

    if (req.method === 'PATCH') {
      const data = await body(req);
      const orderId = clean(data.id, 60) || url.searchParams.get('id');
      if (!orderId) return fail(res, 400, 'Commande introuvable.');
      const existing = await db.findById('orders', orderId);
      if (!existing) return fail(res, 404, 'Commande introuvable.');

      const patch = { updated_at: now(), updated_by: `${user.name || user.email} (${user.role})` };
      if (data.status !== undefined) {
        if (!STATUSES.includes(data.status)) return fail(res, 400, 'Statut inconnu.');
        patch.status = data.status;
      }
      if (data.note !== undefined) patch.note = clean(data.note, 900);
      const updated = await db.update('orders', orderId, patch);
      await log(user, 'commande_modifiee', orderId,
        `Statut : ${patch.status || existing.status}${patch.note !== undefined ? ' · note mise à jour' : ''}`);
      return ok(res, { order: normaliseOrder(updated) });
    }

    if (req.method === 'DELETE') {
      if (user.role !== 'admin') return fail(res, 403, 'Action réservée à l’administrateur.');
      const orderId = url.searchParams.get('id') || clean((await body(req)).id, 60);
      if (!orderId) return fail(res, 400, 'Commande introuvable.');
      await db.remove('orders', orderId);
      await log(user, 'commande_supprimee', orderId, 'Commande supprimée');
      return ok(res, { ok: true });
    }

    return fail(res, 405, 'Méthode non autorisée');
  } catch (error) {
    console.error(error);
    return fail(res, 500, 'Opération impossible.');
  }
};
