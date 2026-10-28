'use strict';

/**
 * Couche de stockage du dashboard Kandys.
 *
 *  1. Neon (PostgreSQL) → DATABASE_URL / POSTGRES_URL / NEON_DATABASE_URL
 *     (ou PGHOST + PGDATABASE + PGUSER + PGPASSWORD)
 *  2. Fichier local (secours) → KANDYS_DB_PATH, non durable sur Vercel
 */

const fs = require('fs');
const path = require('path');
const seed = require('./seed');
const { STATEMENTS, MIGRATIONS } = require('./schema');

const LOCAL_DB = process.env.KANDYS_DB_PATH || path.join('/tmp', 'kandys-db.json');

const COLUMNS = {
  users: ['id', 'email', 'name', 'role', 'active', 'password_hash', 'created_at', 'updated_at', 'last_login'],
  orders: ['id', 'nom', 'prenoms', 'telephone', 'localisation', 'type', 'description', 'status', 'note',
    'pickup_date', 'pickup_slot', 'parts', 'handled_by', 'handled_by_name', 'handled_by_role', 'handled_at',
    'created_at', 'updated_at', 'updated_by'],
  order_events: ['id', 'order_id', 'actor_id', 'actor_email', 'actor_name', 'actor_role',
    'from_status', 'to_status', 'note', 'created_at'],
  realisations: ['id', 'category', 'title', 'caption', 'alt', 'image', 'position', 'visible',
    'created_at', 'updated_at'],
  logs: ['id', 'actor_id', 'actor_email', 'actor_role', 'action', 'target', 'details', 'created_at'],
};

function connectionString() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  if (process.env.POSTGRES_URL) return process.env.POSTGRES_URL;
  if (process.env.NEON_DATABASE_URL) return process.env.NEON_DATABASE_URL;
  if (process.env.PGHOST && process.env.PGDATABASE && process.env.PGUSER) {
    const user = encodeURIComponent(process.env.PGUSER);
    const password = process.env.PGPASSWORD ? `:${encodeURIComponent(process.env.PGPASSWORD)}` : '';
    return `postgresql://${user}${password}@${process.env.PGHOST}/${process.env.PGDATABASE}?sslmode=require`;
  }
  return '';
}

const CONNECTION = connectionString();
const usePostgres = Boolean(CONNECTION) || Boolean(process.env.KANDYS_FORCE_PG);

/* ------------------------------------------------------------- PostgreSQL -- */

let pool = null;
let ready = null;
let testRunner = null;

function getPool() {
  if (pool) return pool;
  if (global.__kandysPool) {
    pool = global.__kandysPool;
    return pool;
  }
  let Pool;
  try {
    ({ Pool } = require('@neondatabase/serverless'));
  } catch {
    ({ Pool } = require('pg'));
  }
  pool = new Pool({ connectionString: CONNECTION, max: 3 });
  global.__kandysPool = pool;
  return pool;
}

async function run(text, params) {
  if (testRunner) {
    const rows = await testRunner(text, params || []);
    return rows || [];
  }
  const { rows } = await getPool().query(text, params || []);
  return rows;
}

/** Crée les tables au premier appel (idempotent) et amorce les réalisations. */
function ensureSchema() {
  if (!ready) {
    ready = (async () => {
      for (const statement of STATEMENTS) {
        await run(statement);
      }
      // Colonnes de suivi ajoutées aux bases existantes : on ignore celles déjà présentes.
      for (const statement of MIGRATIONS) {
        try {
          await run(statement);
        } catch (error) {
          // Colonne déjà présente ou moteur sans ALTER ... IF NOT EXISTS : on journalise
          // sans bloquer, mais l'erreur reste visible dans les logs d'exécution.
          console.warn('Migration ignorée :', statement, '—', error.message);
        }
      }
      const [{ total }] = await run('select count(*)::int as total from realisations');
      if (Number(total) === 0) {
        for (const item of seed.realisations()) {
          await run(
            `insert into realisations (id, category, title, caption, alt, image, position, visible, created_at)
             values ($1, $2, $3, $4, $5, $6, $7, true, now())
             on conflict (id) do nothing`,
            [item.id, item.category, item.title, item.caption, item.alt, item.image, item.position],
          );
        }
      }
    })().catch((error) => {
      ready = null; // nouvelle tentative au prochain appel
      throw error;
    });
  }
  return ready;
}

/** Les dates reviennent en Date : on les normalise en ISO pour l'API. */
function normaliseRow(row) {
  if (!row) return row;
  const out = {};
  Object.entries(row).forEach(([key, value]) => {
    out[key] = value instanceof Date ? value.toISOString() : value;
  });
  return out;
}

function columnsOf(table) {
  const columns = COLUMNS[table];
  if (!columns) throw new Error(`Table inconnue : ${table}`);
  return columns;
}

/* -------------------------------------------------------------------- local -- */

function readLocal() {
  try {
    return JSON.parse(fs.readFileSync(LOCAL_DB, 'utf8'));
  } catch {
    const db = { users: [], orders: [], realisations: seed.realisations(), order_events: [], logs: [] };
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

/* ---------------------------------------------------------------------- api -- */

const db = {
  get mode() {
    return usePostgres ? 'neon' : 'local';
  },
  /** Les données sont-elles conservées durablement en production ? */
  get durable() {
    return Boolean(CONNECTION) || Boolean(testRunner);
  },

  async select(table, filters = {}, options = {}) {
    const columns = columnsOf(table);
    if (!usePostgres) {
      const local = readLocal();
      let rows = [...(local[table] || [])];
      Object.entries(filters).forEach(([key, value]) => {
        if (!columns.includes(key) || value === undefined || value === null) return;
        rows = rows.filter((row) => String(row[key]) === String(value));
      });
      if (options.order) {
        const [field, dir] = options.order.split('.');
        rows.sort((a, b) => (a[field] > b[field] ? 1 : a[field] < b[field] ? -1 : 0) * (dir === 'desc' ? -1 : 1));
      }
      return options.limit ? rows.slice(0, options.limit) : rows;
    }

    await ensureSchema();
    const params = [];
    const where = [];
    Object.entries(filters).forEach(([key, value]) => {
      if (!columns.includes(key) || value === undefined || value === null) return;
      params.push(value);
      where.push(`${key} = $${params.length}`);
    });
    let sql = `select * from ${table}`;
    if (where.length) sql += ` where ${where.join(' and ')}`;
    if (options.order) {
      const [field, dir] = options.order.split('.');
      if (columns.includes(field)) {
        sql += ` order by ${field} ${String(dir).toLowerCase() === 'desc' ? 'desc' : 'asc'}`;
      }
    }
    if (options.limit) {
      params.push(Number(options.limit));
      sql += ` limit $${params.length}`;
    }
    const rows = await run(sql, params);
    return rows.map(normaliseRow);
  },

  async findById(table, id) {
    const columns = columnsOf(table);
    if (!columns.includes('id')) return null;
    const rows = await this.select(table, { id });
    return rows[0] || null;
  },

  async insert(table, row) {
    const columns = columnsOf(table).filter((column) => row[column] !== undefined);
    if (!usePostgres) {
      const local = readLocal();
      local[table] = local[table] || [];
      local[table].push(row);
      writeLocal(local);
      return row;
    }
    await ensureSchema();
    const placeholders = columns.map((_, index) => `$${index + 1}`);
    const sql = `insert into ${table} (${columns.join(', ')}) values (${placeholders.join(', ')}) returning *`;
    const rows = await run(sql, columns.map((column) => row[column]));
    return normaliseRow(rows[0]) || row;
  },

  async update(table, id, patch) {
    const columns = columnsOf(table).filter((column) => column !== 'id' && patch[column] !== undefined);
    if (!columns.length) return this.findById(table, id);
    if (!usePostgres) {
      const local = readLocal();
      const rows = local[table] || [];
      const index = rows.findIndex((row) => String(row.id) === String(id));
      if (index === -1) return null;
      rows[index] = { ...rows[index], ...patch };
      writeLocal(local);
      return rows[index];
    }
    await ensureSchema();
    const values = columns.map((column) => patch[column]);
    values.push(id);
    const sets = columns.map((column, index) => `${column} = $${index + 1}`);
    const sql = `update ${table} set ${sets.join(', ')} where id = $${values.length} returning *`;
    const rows = await run(sql, values);
    return normaliseRow(rows[0]) || null;
  },

  async remove(table, id) {
    columnsOf(table);
    if (!usePostgres) {
      const local = readLocal();
      local[table] = (local[table] || []).filter((row) => String(row.id) !== String(id));
      writeLocal(local);
      return true;
    }
    await ensureSchema();
    await run(`delete from ${table} where id = $1`, [id]);
    return true;
  },

  /**
   * Diagnostic (endpoint /api/health) : vérifie que les colonnes de suivi et la
   * table d'historique existent réellement, sans exposer la moindre donnée.
   */
  async schemaInfo() {
    if (!usePostgres) return { orders_tracking: true, order_events: true };
    await ensureSchema();
    try {
      const rows = await run(`select table_name, column_name from information_schema.columns
        where table_name in ('orders', 'order_events')`);
      const has = (table, column) =>
        rows.some((row) => row.table_name === table && row.column_name === column);
      return {
        orders_tracking: ['pickup_date', 'pickup_slot', 'parts', 'handled_by', 'handled_at']
          .every((column) => has('orders', column)),
        order_events: has('order_events', 'order_id'),
      };
    } catch (error) {
      return { orders_tracking: null, order_events: null, error: String(error.message || error) };
    }
  },

  /** Réservé aux tests : remplace le pilote SQL par un moteur en mémoire. */
  __setRunnerForTests(fn) {
    testRunner = fn;
    if (fn) ready = null;
  },

  reset() {
    if (!usePostgres) {
      try {
        fs.unlinkSync(LOCAL_DB);
      } catch {
        /* ignore */
      }
    }
  },
};

module.exports = db;
