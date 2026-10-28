'use strict';

const auth = require('../_lib/auth');
const db = require('../_lib/db');
const { ok } = require('../_lib/http');

module.exports = async function handler(req, res) {
  const user = await auth.currentUser(req);
  const storage = { mode: db.mode, durable: db.durable };
  if (!user) return ok(res, { user: null, storage });
  return ok(res, {
    user,
    storage,
    maxAgents: auth.MAX_AGENTS,
  });
};
