-- Kandys Pâtisserie — base Neon (PostgreSQL)
-- Ce fichier est identique au schéma appliqué automatiquement par l'API
-- (voir api/_lib/schema.js). Utile pour créer la base à la main avec psql.

create table if not exists users (
  id            text primary key,
  email         text unique not null,
  name          text,
  role          text not null default 'agent' check (role in ('admin', 'agent')),
  active        boolean not null default true,
  password_hash text not null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz,
  last_login    timestamptz
);

create table if not exists orders (
  id           text primary key,
  nom          text not null,
  prenoms      text,
  telephone    text not null,
  localisation text,
  type         text,
  description  text not null,
  status       text not null default 'nouvelle'
               check (status in ('nouvelle', 'en_cours', 'prete', 'livree', 'annulee')),
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
);

-- Historique de traitement : qui a fait avancer la commande, quand, et vers quel statut.
create table if not exists order_events (
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
);

create table if not exists realisations (
  id         text primary key,
  category   text not null,
  title      text not null,
  caption    text default '',
  alt        text default '',
  image      text not null,          -- chemin /assets, URL ou data URL compressée
  position   integer not null default 0,
  visible    boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create table if not exists logs (
  id          text primary key,
  actor_id    text,
  actor_email text,
  actor_role  text,
  action      text not null,
  target      text default '',
  details     text default '',
  created_at  timestamptz not null default now()
);

create index if not exists orders_created_at_idx on orders (created_at desc);
create index if not exists orders_status_idx on orders (status);
create index if not exists order_events_order_idx on order_events (order_id, created_at desc);
create index if not exists orders_handled_at_idx on orders (handled_at);
create index if not exists realisations_position_idx on realisations (position);
create index if not exists logs_created_at_idx on logs (created_at desc);
