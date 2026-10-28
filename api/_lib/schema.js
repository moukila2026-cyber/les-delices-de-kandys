'use strict';

/**
 * Schéma de la base Neon (PostgreSQL), embarqué pour être appliqué automatiquement
 * au premier appel de l'API. Le même contenu est fourni dans `db/schema.sql`.
 */

const STATEMENTS = [
  `create table if not exists users (
     id            text primary key,
     email         text unique not null,
     name          text,
     role          text not null default 'agent',
     active        boolean not null default true,
     password_hash text not null,
     created_at    timestamptz not null default now(),
     updated_at    timestamptz,
     last_login    timestamptz
   )`,
  `create table if not exists orders (
     id           text primary key,
     nom          text not null,
     prenoms      text,
     telephone    text not null,
     localisation text,
     type         text,
     description  text not null,
     status       text not null default 'nouvelle',
     note         text default '',
     pickup_date  date,
     pickup_slot  text default '',
     parts        integer,
     handled_by       text default '',
     handled_by_name  text default '',
     handled_by_role  text default '',
     handled_at       timestamptz,
     created_at   timestamptz not null default now(),
     updated_at   timestamptz,
     updated_by   text default ''
   )`,
  `create table if not exists realisations (
     id         text primary key,
     category   text not null,
     title      text not null,
     caption    text default '',
     alt        text default '',
     image      text not null,
     position   integer not null default 0,
     visible    boolean not null default true,
     created_at timestamptz not null default now(),
     updated_at timestamptz
   )`,
  `create table if not exists order_events (
     id          text primary key,
     order_id    text not null,
     actor_id    text default '',
     actor_email text default '',
     actor_name  text default '',
     actor_role  text default '',
     from_status text default '',
     to_status   text default '',
     note        text default '',
     created_at  timestamptz not null default now()
   )`,
  `create table if not exists logs (
     id          text primary key,
     actor_id    text,
     actor_email text,
     actor_role  text,
     action      text not null,
     target      text default '',
     details     text default '',
     created_at  timestamptz not null default now()
   )`,
  'create index if not exists orders_created_at_idx on orders (created_at desc)',
  'create index if not exists orders_status_idx on orders (status)',
  'create index if not exists order_events_order_idx on order_events (order_id, created_at desc)',
  'create index if not exists orders_handled_at_idx on orders (handled_at)',
  'create index if not exists realisations_position_idx on realisations (position)',
  'create index if not exists logs_created_at_idx on logs (created_at desc)',
];

/**
 * Migrations appliquées après la création initiale : elles ajoutent les colonnes
 * de suivi à une table `orders` déjà existante (base Neon créée avant cette version).
 * Chaque instruction est tolérante aux erreurs : une colonne déjà présente est ignorée.
 */
const MIGRATIONS = [
  'alter table orders add column if not exists pickup_date date',
  "alter table orders add column if not exists pickup_slot text default ''",
  'alter table orders add column if not exists parts integer',
  "alter table orders add column if not exists handled_by text default ''",
  "alter table orders add column if not exists handled_by_name text default ''",
  "alter table orders add column if not exists handled_by_role text default ''",
  'alter table orders add column if not exists handled_at timestamptz',
];

module.exports = { STATEMENTS, MIGRATIONS };
