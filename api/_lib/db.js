'use strict';

/**
 * Couche de stockage du dashboard Kandys.
 *
 * Deux modes :
 *  1. Supabase (production)  → SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
 *  2. Fichier local (dev)    → KANDYS_DB_PATH, données non durables sur Vercel
 */

const fs = require('fs');
const path = require('path');

const SUPABASE_URL = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const LOCAL_DB = process.env.KANDYS_DB_PATH || path.join('/tmp', 'kandys-db.json');

const isSupabase = Boolean(SUPABASE_URL && SUPABASE_KEY);

/* ------------------------------------------------------------------ local -- */

function readLocal() {
  try {
    return JSON.parse(fs.readFileSync(LOCAL_DB, 'utf8'));
  } catch {
    const seed = require('./seed');
    const db = {
      users: [],
      orders: [],
      realisations: seed.realisations(),
      logs: [],
    };
    writeLocal(db);
    return db;
  }
}

function writeLocal(db) {
  try {
    fs.mkdirSync(path.dirname(LOCAL_DB), { recursive: true });
    fs.writeFileSync(LOCAL_DB, JSON.stringify(db, null, 2));
  } catch (error) {
    console.error('Stockage local indisponible', error);
  }
}

/* --------------------------------------------------------------- supabase -- */

async function sb(pathname, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${pathname}`, {
    method: options.method || 'GET',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: options.prefer || 'return=representation',
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const message = (data && (data.message || data.hint)) || res.statusText;
    throw new Error(`Supabase ${res.status}: ${message}`);
  }
  return data;
}

function q(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') params.set(key, value);
  });
  const str = params.toString();
  return str ? `?${str}` : '';
}

/* -------------------------------------------------------------------- api -- */

const db = {
  mode: isSupabase ? 'supabase' : 'local',
  durable: isSupabase,

  async select(table, filters = {}, options = {}) {
    if (isSupabase) {
      const order = options.order ? `&order=${options.order}` : '';
      return (await sb(`${table}${q(filters)}${order}`)) || [];
    }
    const local = readLocal();
    let rows = [...(local[table] || [])];
    Object.entries(filters).forEach(([key, value]) => {
      if (key === 'select' || key === 'order') return;
      if (value === undefined || value === null) return;
      rows = rows.filter((row) => String(row[key]) === String(value));
    });
    if (options.order) {
      const [field, dir] = options.order.split('.');
      rows.sort((a, b) => (a[field] > b[field] ? 1 : a[field] < b[field] ? -1 : 0) * (dir === 'desc' ? -1 : 1));
    }
    return options.limit ? rows.slice(0, options.limit) : rows;
  },

  async findById(table, id) {
    const rows = await this.select(table, { id });
    return rows[0] || null;
  },

  async insert(table, row) {
    if (isSupabase) return (await sb(table, { method: 'POST', body: row }))[0];
    const local = readLocal();
    local[table] = local[table] || [];
    local[table].push(row);
    writeLocal(local);
    return row;
  },

  async update(table, id, patch) {
    if (isSupabase) {
      const rows = await sb(`${table}?id=eq.${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body: patch,
      });
      return rows[0] || null;
    }
    const local = readLocal();
    const rows = local[table] || [];
    const index = rows.findIndex((row) => String(row.id) === String(id));
    if (index === -1) return null;
    rows[index] = { ...rows[index], ...patch };
    writeLocal(local);
    return rows[index];
  },

  async remove(table, id) {
    if (isSupabase) {
      await sb(`${table}?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' });
      return true;
    }
    const local = readLocal();
    local[table] = (local[table] || []).filter((row) => String(row.id) !== String(id));
    writeLocal(local);
    return true;
  },

  async count(table, filters = {}) {
    return (await this.select(table, filters)).length;
  },

  reset() {
    if (!isSupabase) {
      try {
        fs.unlinkSync(LOCAL_DB);
      } catch {
        /* ignore */
      }
    }
  },
};

module.exports = db;
