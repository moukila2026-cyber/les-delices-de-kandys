'use strict';

const db = require('./_lib/db');
const auth = require('./_lib/auth');
const { ok, fail, body, id, now, clean, log } = require('./_lib/http');

const STATUSES = ['nouvelle', 'en_cours', 'prete', 'livree', 'annulee'];

/** Créneaux de retrait proposés au client (click & collect). */
const PICKUP_SLOTS = [
  'Matin (8h – 11h)',
  'Midi (12h – 14h)',
  'Après-midi (15h – 17h)',
  'Soir (18h – 20h)',
];

/** Délai minimum avant le retrait : 48 h. */
const LEAD_DAYS = 2;

function dateOnly(value) {
  if (!value) return '';
  const raw = value instanceof Date ? value.toISOString() : String(value);
  return /^\d{4}-\d{2}-\d{2}/.test(raw) ? raw.slice(0, 10) : '';
}

function minPickupDate() {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + LEAD_DAYS);
  return date.toISOString().slice(0, 10);
}

function normaliseEvent(row) {
  return {
    id: row.id,
    from_status: row.from_status || '',
    to_status: row.to_status || '',
    actor_name: row.actor_name || row.actor_email || 'Site web',
    actor_email: row.actor_email || '',
    actor_role: row.actor_role || '',
    note: row.note || '',
    created_at: row.created_at,
  };
}

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
    pickup_date: dateOnly(row.pickup_date),
    pickup_slot: row.pickup_slot || '',
    parts: row.parts === null || row.parts === undefined ? null : Number(row.parts),
    handled_by: row.handled_by || '',
    handled_by_name: row.handled_by_name || '',
    handled_by_role: row.handled_by_role || '',
    handled_at: row.handled_at || null,
    created_at: row.created_at,
    updated_at: row.updated_at || row.created_at,
    updated_by: row.updated_by || '',
    events: [],
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

    /* Retrait (click & collect) : facultatif côté API, contrôlé côté formulaire. */
    const rawPickupDate = clean(data.pickup_date, 10);
    const pickupDate = dateOnly(rawPickupDate);
    if (rawPickupDate && !pickupDate) return fail(res, 400, 'Date de retrait invalide.');
    if (pickupDate && pickupDate < minPickupDate()) {
      return fail(res, 400, `Merci de prévoir votre retrait au moins ${LEAD_DAYS * 24} h à l’avance.`);
    }
    const pickupSlot = clean(data.pickup_slot, 40);
    if (pickupSlot && !PICKUP_SLOTS.includes(pickupSlot)) {
      return fail(res, 400, 'Créneau de retrait inconnu.');
    }
    let parts = null;
    if (data.parts !== undefined && data.parts !== null && String(data.parts).trim() !== '') {
      parts = Number.parseInt(data.parts, 10);
      if (!Number.isFinite(parts) || parts < 1 || parts > 500) {
        return fail(res, 400, 'Nombre de parts invalide (entre 1 et 500).');
      }
    }

    try {
      const createdAt = now();
      const order = {
        id: id('cmd_'),
        ...payload,
        status: 'nouvelle',
        note: '',
        pickup_date: pickupDate || null,
        pickup_slot: pickupSlot,
        parts,
        handled_by: '',
        handled_by_name: '',
        handled_by_role: '',
        handled_at: null,
        created_at: createdAt,
        updated_at: createdAt,
        updated_by: '',
      };
      await db.insert('orders', order);
      await db.insert('order_events', {
        id: id('evt_'),
        order_id: order.id,
        actor_id: 'public',
        actor_email: 'visiteur',
        actor_name: 'Site web',
        actor_role: 'public',
        from_status: '',
        to_status: 'nouvelle',
        note: 'Commande reçue',
        created_at: createdAt,
      });
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
      const pending = url.searchParams.get('pending') === '1';
      const all = await db.select('orders', {}, { order: 'created_at.desc' });

      /* Les compteurs portent sur l'ensemble des commandes, pas sur le filtre courant. */
      const counts = STATUSES.reduce((acc, key) => {
        acc[key] = all.filter((row) => (row.status || 'nouvelle') === key).length;
        return acc;
      }, {});
      counts.a_traiter = all.filter((row) => !row.handled_at).length;

      let rows = all;
      if (status && STATUSES.includes(status)) {
        rows = rows.filter((row) => (row.status || 'nouvelle') === status);
      }
      if (pending) {
        rows = rows.filter((row) => !row.handled_at);
      }
      if (search) {
        rows = rows.filter((row) =>
          [row.nom, row.prenoms, row.telephone, row.description, row.type]
            .join(' ')
            .toLowerCase()
            .includes(search));
      }

      /* Historique de traitement : une seule lecture, regroupée par commande. */
      const eventsByOrder = {};
      if (rows.length) {
        const events = await db.select('order_events', {}, { order: 'created_at.desc', limit: 800 });
        events.forEach((event) => {
          const list = eventsByOrder[event.order_id] || (eventsByOrder[event.order_id] = []);
          if (list.length < 6) list.push(normaliseEvent(event));
        });
        Object.values(eventsByOrder).forEach((list) => list.reverse());
      }

      const orders = rows.map((row) => ({
        ...normaliseOrder(row),
        events: eventsByOrder[row.id] || [],
      }));

      return ok(res, {
        orders,
        counts,
        total: orders.length,
        canDelete: user.role === 'admin',
      });
    }

    if (req.method === 'PATCH') {
      const data = await body(req);
      const orderId = clean(data.id, 60) || url.searchParams.get('id');
      if (!orderId) return fail(res, 400, 'Commande introuvable.');
      const existing = await db.findById('orders', orderId);
      if (!existing) return fail(res, 404, 'Commande introuvable.');

      const previousStatus = existing.status || 'nouvelle';
      const stamp = now();
      const actorName = user.name || user.email;
      const patch = { updated_at: stamp, updated_by: `${actorName} (${user.role})` };
      let statusChanged = false;

      if (data.status !== undefined) {
        if (!STATUSES.includes(data.status)) return fail(res, 400, 'Statut inconnu.');
        patch.status = data.status;
        statusChanged = data.status !== previousStatus;
      }
      if (data.note !== undefined) patch.note = clean(data.note, 900);

      /* Traçabilité : qui a traité la commande et à quel moment. */
      if (statusChanged) {
        patch.handled_by = user.email;
        patch.handled_by_name = actorName;
        patch.handled_by_role = user.role;
        patch.handled_at = stamp;
      }

      const updated = await db.update('orders', orderId, patch);

      if (statusChanged) {
        await db.insert('order_events', {
          id: id('evt_'),
          order_id: orderId,
          actor_id: String(user.id),
          actor_email: user.email,
          actor_name: actorName,
          actor_role: user.role,
          from_status: previousStatus,
          to_status: patch.status,
          note: data.note !== undefined ? clean(data.note, 900) : '',
          created_at: stamp,
        });
      }

      const moment = new Date(stamp).toLocaleString('fr-FR', {
        timeZone: 'Africa/Abidjan', dateStyle: 'short', timeStyle: 'short',
      });
      const details = statusChanged
        ? `Statut : ${previousStatus} → ${patch.status} · traité par ${actorName} (${user.email}, ${user.role}) le ${moment}`
        : `Note interne mise à jour par ${actorName} (${user.email}, ${user.role})`;
      await log(user, 'commande_modifiee', orderId, details);

      return ok(res, { order: normaliseOrder(updated) });
    }

    if (req.method === 'DELETE') {
      if (user.role !== 'admin') return fail(res, 403, 'Action réservée à l’administrateur.');
      const orderId = url.searchParams.get('id') || clean((await body(req)).id, 60);
      if (!orderId) return fail(res, 400, 'Commande introuvable.');
      const events = await db.select('order_events', { order_id: orderId });
      for (const event of events) {
        await db.remove('order_events', event.id);
      }
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
