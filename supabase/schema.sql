-- Kandys Pâtisserie — schéma de base pour l'espace équipe (Supabase / PostgreSQL)
-- À exécuter dans Supabase : SQL Editor → New query → coller → Run.

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
  created_at   timestamptz not null default now(),
  updated_at   timestamptz,
  updated_by   text default ''
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
create index if not exists realisations_position_idx on realisations (position);
create index if not exists logs_created_at_idx on logs (created_at desc);

-- Sécurité : accès uniquement via la clé « service_role » utilisée par les
-- fonctions serverless (/api). Aucun accès anonyme.
alter table users        enable row level security;
alter table orders       enable row level security;
alter table realisations enable row level security;
alter table logs         enable row level security;
