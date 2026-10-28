'use strict';

const db = require('./_lib/db');
const auth = require('./_lib/auth');
const { ok, fail } = require('./_lib/http');

/** Journal d'activité : l'administrateur suit ce qui se passe, même à distance. */
module.exports = async function handler(req, res) {
  const user = await auth.currentUser(req);
  if (!user) return fail(res, 401, 'Session expirée. Reconnectez-vous.');
  if (req.method !== 'GET') return fail(res, 405, 'Méthode non autorisée');

  const url = new URL(req.url, 'http://localhost');
  const limit = Math.min(Number(url.searchParams.get('limit') || 100), 300);

  try {
    const logs = await db.select('logs', {}, { order: 'created_at.desc', limit });
    const orders = await db.select('orders');
    const realisations = await db.select('realisations');
    const agents = (await db.select('users', { role: 'agent' })).map((row) => ({
      id: row.id,
      email: row.email,
      name: row.name,
      active: row.active !== false,
      created_at: row.created_at,
    }));

    const byStatus = orders.reduce((acc, order) => {
      const key = order.status || 'nouvelle';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const stats = {
      orders_total: orders.length,
      orders_by_status: byStatus,
      orders_today: orders.filter((order) => (order.created_at || '').startsWith(new Date().toISOString().slice(0, 10))).length,
      orders_pending: orders.filter((order) => !order.handled_at).length,
      orders_handled: orders.filter((order) => Boolean(order.handled_at)).length,
      realisations: realisations.length,
      agents_active: agents.filter((agent) => agent.active).length,
    };

    return ok(res, {
      logs: logs.map((row) => ({
        id: row.id,
        actor_email: row.actor_email,
        actor_role: row.actor_role,
        action: row.action,
        target: row.target,
        details: row.details,
        created_at: row.created_at,
      })),
      stats,
      agents,
      storage: { mode: db.mode, durable: db.durable },
    });
  } catch (error) {
    console.error(error);
    return fail(res, 500, 'Journal indisponible.');
  }
};
