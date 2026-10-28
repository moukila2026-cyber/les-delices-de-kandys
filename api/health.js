'use strict';

const db = require('./_lib/db');
const { ok, fail } = require('./_lib/http');

/**
 * État public et non sensible du service : mode de stockage et présence des
 * colonnes de suivi des commandes. Sert à vérifier un déploiement à distance.
 */
module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return fail(res, 405, 'Méthode non autorisée');
  try {
    const schema = await db.schemaInfo();
    return ok(res, {
      ok: Boolean(schema.orders_tracking && schema.order_events),
      storage: { mode: db.mode, durable: db.durable },
      schema,
    });
  } catch (error) {
    console.error(error);
    return fail(res, 500, 'État indisponible.');
  }
};
