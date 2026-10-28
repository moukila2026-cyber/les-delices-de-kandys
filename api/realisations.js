'use strict';

const db = require('./_lib/db');
const auth = require('./_lib/auth');
const { ok, fail, body, id, now, clean, log } = require('./_lib/http');
const seed = require('./_lib/seed');

const CATEGORIES = ['africain', 'europeen', 'entrees', 'patisserie', 'anniversaire', 'mariage'];
const MAX_IMAGE = 2_500_000; // ~2,5 Mo de data URL

function normalise(item) {
  return {
    id: item.id,
    category: item.category,
    title: item.title,
    caption: item.caption,
    alt: item.alt || item.title,
    image: item.image,
    position: Number(item.position || 0),
    visible: item.visible !== false,
  };
}

function validImage(value) {
  if (!value) return null;
  const str = String(value);
  if (str.length > MAX_IMAGE) return { error: 'Image trop lourde (2,5 Mo maximum).' };
  if (/^data:image\/(png|jpe?g|webp);base64,/i.test(str) || /^https?:\/\//i.test(str) || /^assets\//.test(str)) {
    return { value: str };
  }
  return { error: 'Format d’image non reconnu.' };
}

async function list() {
  let rows = await db.select('realisations', {}, { order: 'position.asc' });
  if (!rows.length) {
    // Première utilisation : on amorce avec les 14 réalisations du site.
    const defaults = seed.realisations();
    for (const item of defaults) {
      try {
        await db.insert('realisations', { ...item, visible: true, created_at: now() });
      } catch (error) {
        console.error(error);
      }
    }
    rows = await db.select('realisations', {}, { order: 'position.asc' });
  }
  return rows;
}

module.exports = async function handler(req, res) {
  const url = new URL(req.url, 'http://localhost');

  /* --------------------------------------------------------------- public -- */
  if (req.method === 'GET') {
    try {
      const rows = await list();
      const items = rows.map(normalise).filter((item) => item.visible);
      const counts = CATEGORIES.reduce((acc, key) => {
        acc[key] = items.filter((item) => item.category === key).length;
        return acc;
      }, {});
      return ok(res, { realisations: items, counts, total: items.length });
    } catch (error) {
      console.error(error);
      return fail(res, 500, 'Réalisations indisponibles.');
    }
  }

  const user = await auth.currentUser(req);
  if (!user) return fail(res, 401, 'Session expirée. Reconnectez-vous.');

  try {
    if (req.method === 'POST') {
      if (user.role !== 'admin') return fail(res, 403, 'Action réservée à l’administrateur.');
      const data = await body(req);
      const image = validImage(data.image);
      if (image && image.error) return fail(res, 400, image.error);
      if (!image || !image.value) return fail(res, 400, 'Ajoutez une photo.');
      const category = CATEGORIES.includes(data.category) ? data.category : 'patisserie';
      const rows = await list();
      const position = rows.length ? Math.max(...rows.map((row) => Number(row.position || 0))) + 1 : 1;
      const item = {
        id: id('real_'),
        category,
        title: clean(data.title, 90),
        caption: clean(data.caption, 60),
        alt: clean(data.alt || data.title, 160),
        image: image.value,
        position,
        visible: data.visible !== false,
        created_at: now(),
        updated_at: now(),
      };
      if (!item.title) return fail(res, 400, 'Le titre est obligatoire.');
      const created = await db.insert('realisations', item);
      await log(user, 'realisation_ajoutee', item.id, item.title);
      return ok(res, { realisation: normalise(created) });
    }

    if (req.method === 'PATCH') {
      if (user.role !== 'admin') return fail(res, 403, 'Action réservée à l’administrateur.');
      const data = await body(req);
      const target = clean(data.id, 60) || url.searchParams.get('id');
      const existing = target ? await db.findById('realisations', target) : null;
      if (!existing) return fail(res, 404, 'Réalisation introuvable.');

      const patch = { updated_at: now() };
      if (data.title !== undefined) patch.title = clean(data.title, 90);
      if (data.caption !== undefined) patch.caption = clean(data.caption, 60);
      if (data.alt !== undefined) patch.alt = clean(data.alt, 160);
      if (data.category !== undefined && CATEGORIES.includes(data.category)) patch.category = data.category;
      if (data.visible !== undefined) patch.visible = Boolean(data.visible);
      if (data.image) {
        const image = validImage(data.image);
        if (image.error) return fail(res, 400, image.error);
        patch.image = image.value;
      }
      const updated = await db.update('realisations', target, patch);
      await log(user, 'realisation_modifiee', target, patch.title || existing.title);
      return ok(res, { realisation: normalise(updated) });
    }

    if (req.method === 'DELETE') {
      if (user.role !== 'admin') return fail(res, 403, 'Action réservée à l’administrateur.');
      const target = url.searchParams.get('id') || clean((await body(req)).id, 60);
      const existing = target ? await db.findById('realisations', target) : null;
      if (!existing) return fail(res, 404, 'Réalisation introuvable.');
      await db.remove('realisations', target);
      await log(user, 'realisation_supprimee', target, existing.title);
      return ok(res, { ok: true });
    }

    return fail(res, 405, 'Méthode non autorisée');
  } catch (error) {
    console.error(error);
    return fail(res, 500, 'Opération impossible.');
  }
};
