'use strict';

/* Espace équipe Kandys Pâtisserie — dashboard commandes, réalisations, agents. */

const state = {
  user: null,
  maxAgents: 3,
  storage: { mode: 'local', durable: false },
  orders: [],
  realisations: [],
  agents: [],
  editing: null,
  imageData: null,
  removeImage: false,
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const STATUS_LABELS = {
  nouvelle: 'Nouvelle',
  en_cours: 'En cours',
  prete: 'Prête',
  livree: 'Livrée',
  annulee: 'Annulée',
};

const CATEGORY_LABELS = {
  africain: 'Cuisine africaine',
  europeen: 'Cuisine européenne',
  entrees: 'Entrées',
  patisserie: 'Pâtisserie',
  anniversaire: 'Anniversaire',
  mariage: 'Mariage',
};

/* ------------------------------------------------------------------- utils */

function toast(message, tone = 'ok') {
  const el = $('#toast');
  el.textContent = message;
  el.hidden = false;
  el.style.background = tone === 'error' ? '#8f2f2a' : '';
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => { el.hidden = true; }, 3200);
}

function showError(el, message) {
  if (!el) return;
  el.textContent = message || '';
  el.hidden = !message;
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await response.json().catch(() => ({}));
  if (response.status === 401) {
    showAuth();
    throw new Error(data.error || 'Session expirée.');
  }
  if (!response.ok) throw new Error(data.error || 'Une erreur est survenue.');
  return data;
}

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function field(form, name) {
  // form.title / form.name / form.id renvoient des propriétés DOM : passer par elements.
  return form.elements.namedItem(name);
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]
  ));
}

/* ------------------------------------------------------------------- auth */

function showAuth() {
  $('#app').hidden = true;
  $('#auth-screen').hidden = false;
  state.user = null;
}

function showApp(user) {
  state.user = user;
  $('#auth-screen').hidden = true;
  $('#app').hidden = false;
  $('#user-name').textContent = user.name || user.email;
  $('#user-role').textContent = user.role === 'admin' ? 'Administrateur' : 'Agent';
  $$('[data-admin-only]').forEach((el) => {
    const adminOnly = user.role !== 'admin';
    el.hidden = adminOnly;
    if (el.classList.contains('tab')) el.style.display = adminOnly ? 'none' : '';
  });
  $('#realisations-role-note').hidden = user.role === 'admin';
  $('#storage-warning').hidden = Boolean(state.storage.durable);
  loadOrders();
  loadRealisations();
  if (user.role === 'admin') {
    loadAgents();
    loadLogs();
  }
}

async function boot() {
  try {
    const data = await api('/api/auth/me');
    state.storage = data.storage || state.storage;
    state.maxAgents = data.maxAgents || 3;
    if (data.user) showApp(data.user);
    else showAuth();
  } catch {
    showAuth();
  }
}

$('#login-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = $('#login-submit');
  showError($('#login-error'), '');
  button.disabled = true;
  try {
    const data = await api('/api/auth/login', {
      method: 'POST',
      body: {
        email: $('#login-email').value.trim(),
        password: $('#login-password').value,
      },
    });
    $('#login-password').value = '';
    showApp(data.user);
  } catch (error) {
    showError($('#login-error'), error.message);
  } finally {
    button.disabled = false;
  }
});

$('#logout').addEventListener('click', async () => {
  try { await api('/api/auth/logout', { method: 'POST' }); } catch { /* ignore */ }
  showAuth();
});

/* ------------------------------------------------------------------- tabs */

$('#tabs').addEventListener('click', (event) => {
  const button = event.target.closest('.tab');
  if (!button) return;
  $$('.tab').forEach((tab) => tab.classList.toggle('is-active', tab === button));
  $$('.panel').forEach((panel) => {
    panel.classList.toggle('is-active', panel.dataset.panel === button.dataset.tab);
  });
  if (button.dataset.tab === 'journal') loadLogs();
  if (button.dataset.tab === 'agents') loadAgents();
});

/* --------------------------------------------------------------- commandes */

async function loadOrders() {
  const list = $('#orders-list');
  try {
    const params = new URLSearchParams();
    const status = $('#orders-status').value;
    const search = $('#orders-search').value.trim();
    if (status) params.set('status', status);
    if (search) params.set('q', search);
    const data = await api(`/api/orders?${params.toString()}`);
    state.orders = data.orders;
    const fresh = data.counts.nouvelle || 0;
    const badge = $('#tab-orders-badge');
    badge.hidden = fresh === 0;
    badge.textContent = fresh;
    renderOrders(data.canDelete);
  } catch (error) {
    list.innerHTML = `<p class="empty">${escapeHtml(error.message)}</p>`;
  }
}

function renderOrders(canDelete) {
  const list = $('#orders-list');
  if (!state.orders.length) {
    list.innerHTML = '<p class="empty">Aucune commande pour ce filtre.</p>';
    return;
  }
  list.innerHTML = state.orders.map((order) => `
    <article class="order-card${order.status === 'nouvelle' ? ' is-new' : ''}" data-id="${escapeHtml(order.id)}">
      <div class="order-top">
        <h3>${escapeHtml(order.nom)} ${escapeHtml(order.prenoms || '')}</h3>
        <span class="status-pill status-${escapeHtml(order.status)}">${escapeHtml(STATUS_LABELS[order.status] || order.status)}</span>
      </div>
      <div class="order-meta">
        <span>📞 <a href="tel:${escapeHtml(order.telephone)}">${escapeHtml(order.telephone)}</a></span>
        <span>📍 ${escapeHtml(order.localisation || '—')}</span>
        <span>🎂 ${escapeHtml(order.type || '—')}</span>
        <span>🕒 ${escapeHtml(formatDate(order.created_at))}</span>
      </div>
      <p class="order-desc">${escapeHtml(order.description)}</p>
      <div class="order-actions">
        <select data-action="status" aria-label="Statut de la commande">
          ${Object.entries(STATUS_LABELS).map(([value, label]) =>
            `<option value="${value}"${order.status === value ? ' selected' : ''}>${label}</option>`).join('')}
        </select>
        <input type="text" data-action="note" placeholder="Note interne (facultatif)" value="${escapeHtml(order.note)}">
        <button class="btn btn-ghost btn-sm" type="button" data-action="save">Enregistrer</button>
        <a class="btn btn-ghost btn-sm" href="https://wa.me/${escapeHtml(String(order.telephone).replace(/\D/g, ''))}" target="_blank" rel="noopener noreferrer">WhatsApp</a>
        ${canDelete ? '<button class="btn btn-danger btn-sm" type="button" data-action="delete">Supprimer</button>' : ''}
      </div>
      ${order.updated_by ? `<div class="order-meta"><span>Dernière action : ${escapeHtml(order.updated_by)} · ${escapeHtml(formatDate(order.updated_at))}</span></div>` : ''}
    </article>
  `).join('');
}

$('#orders-list').addEventListener('click', async (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const card = button.closest('.order-card');
  const orderId = card.dataset.id;

  if (button.dataset.action === 'save') {
    const status = $('[data-action="status"]', card).value;
    const note = $('[data-action="note"]', card).value;
    button.disabled = true;
    try {
      await api('/api/orders', { method: 'PATCH', body: { id: orderId, status, note } });
      toast('Commande mise à jour.');
      loadOrders();
    } catch (error) {
      toast(error.message, 'error');
    } finally {
      button.disabled = false;
    }
    return;
  }

  if (button.dataset.action === 'delete') {
    if (!confirm('Supprimer définitivement cette commande ?')) return;
    try {
      await api(`/api/orders?id=${encodeURIComponent(orderId)}`, { method: 'DELETE' });
      toast('Commande supprimée.');
      loadOrders();
    } catch (error) {
      toast(error.message, 'error');
    }
  }
});

$('#orders-refresh').addEventListener('click', loadOrders);
$('#orders-status').addEventListener('change', loadOrders);
let searchTimer;
$('#orders-search').addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(loadOrders, 320);
});

/* ------------------------------------------------------------- réalisations */

async function loadRealisations() {
  const grid = $('#realisations-grid');
  try {
    const data = await api('/api/realisations');
    state.realisations = data.realisations;
    const isAdmin = state.user && state.user.role === 'admin';
    if (!data.realisations.length) {
      grid.innerHTML = '<p class="empty">Aucune réalisation.</p>';
      return;
    }
    grid.innerHTML = data.realisations.map((item) => `
      <article class="realisation-card" data-id="${escapeHtml(item.id)}">
        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.alt || item.title)}" loading="lazy">
        <div class="realisation-body">
          <small>${escapeHtml(CATEGORY_LABELS[item.category] || item.category)}</small>
          <strong>${escapeHtml(item.title)}</strong>
          ${item.caption ? `<small>${escapeHtml(item.caption)}</small>` : ''}
          ${item.visible === false ? '<span class="hidden-badge">Masquée</span>' : ''}
          ${isAdmin ? `<div class="realisation-actions">
            <button class="btn btn-ghost btn-sm" type="button" data-action="edit">Modifier</button>
            <button class="btn btn-danger btn-sm" type="button" data-action="delete">Supprimer</button>
          </div>` : ''}
        </div>
      </article>
    `).join('');
  } catch (error) {
    grid.innerHTML = `<p class="empty">${escapeHtml(error.message)}</p>`;
  }
}

$('#realisations-grid').addEventListener('click', async (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const card = button.closest('.realisation-card');
  const id = card.dataset.id;
  const item = state.realisations.find((row) => row.id === id);

  if (button.dataset.action === 'edit' && item) {
    openRealisationModal(item);
    return;
  }

  if (button.dataset.action === 'delete' && item) {
    if (!confirm(`Supprimer « ${item.title} » du site ?`)) return;
    try {
      await api(`/api/realisations?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      toast('Réalisation supprimée.');
      loadRealisations();
    } catch (error) {
      toast(error.message, 'error');
    }
  }
});

const modal = $('#realisation-modal');
const realisationForm = $('#realisation-form');

function openRealisationModal(item) {
  state.editing = item ? item.id : null;
  state.imageData = null;
  showError($('#realisation-error'), '');
  $('#realisation-modal-title').textContent = item ? 'Modifier la réalisation' : 'Nouvelle réalisation';
  realisationForm.reset();
  const preview = $('#realisation-preview');
  if (item) {
    field(realisationForm, 'id').value = item.id;
    field(realisationForm, 'title').value = item.title || '';
    field(realisationForm, 'category').value = item.category || 'patisserie';
    field(realisationForm, 'caption').value = item.caption || '';
    field(realisationForm, 'alt').value = item.alt || '';
    field(realisationForm, 'visible').checked = item.visible !== false;
    preview.src = item.image;
    preview.hidden = false;
  } else {
    field(realisationForm, 'id').value = '';
    preview.hidden = true;
    preview.removeAttribute('src');
    field(realisationForm, 'visible').checked = true;
  }
  modal.showModal();
}

$('#new-realisation').addEventListener('click', () => openRealisationModal(null));
$('#realisation-cancel').addEventListener('click', () => modal.close());

/** Compresse la photo côté navigateur (évite les envois lourds). */
function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const max = 1280;
        const ratio = Math.min(1, max / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(image.width * ratio);
        canvas.height = Math.round(image.height * ratio);
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      image.onerror = () => reject(new Error('Image illisible.'));
      image.src = reader.result;
    };
    reader.onerror = () => reject(new Error('Lecture du fichier impossible.'));
    reader.readAsDataURL(file);
  });
}

$('#realisation-file').addEventListener('change', async (event) => {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  try {
    const dataUrl = await compressImage(file);
    state.imageData = dataUrl;
    const preview = $('#realisation-preview');
    preview.src = dataUrl;
    preview.hidden = false;
  } catch (error) {
    showError($('#realisation-error'), error.message);
  }
});

realisationForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = realisationForm.querySelector('button[type="submit"]');
  const values = {
    title: field(realisationForm, 'title').value.trim(),
    category: field(realisationForm, 'category').value,
    caption: field(realisationForm, 'caption').value.trim(),
    alt: field(realisationForm, 'alt').value.trim() || field(realisationForm, 'title').value.trim(),
    visible: field(realisationForm, 'visible').checked,
  };
  if (!values.title) return showError($('#realisation-error'), 'Le titre est obligatoire.');
  if (!state.editing && !state.imageData) {
    return showError($('#realisation-error'), 'Ajoutez une photo.');
  }

  const body = { ...values };
  if (state.imageData) body.image = state.imageData;
  if (state.editing) body.id = state.editing;

  button.disabled = true;
  try {
    await api('/api/realisations', { method: state.editing ? 'PATCH' : 'POST', body });
    modal.close();
    toast(state.editing ? 'Réalisation modifiée.' : 'Réalisation ajoutée.');
    loadRealisations();
  } catch (error) {
    showError($('#realisation-error'), error.message);
  } finally {
    button.disabled = false;
  }
});

/* ------------------------------------------------------------------ agents */

async function loadAgents() {
  if (!state.user || state.user.role !== 'admin') return;
  const list = $('#agents-list');
  try {
    const data = await api('/api/agents');
    state.agents = data.agents;
    state.maxAgents = data.max;
    $('#agents-counter').textContent = `${data.agents.filter((agent) => agent.active).length} / ${data.max}`;
    $('#agent-form').querySelector('button').disabled = data.remaining === 0;
    if (!data.agents.length) {
      list.innerHTML = '<p class="empty">Aucun agent pour le moment.</p>';
      return;
    }
    list.innerHTML = data.agents.map((agent) => `
      <article class="agent-row" data-id="${escapeHtml(agent.id)}">
        <div class="agent-id">
          <strong>${escapeHtml(agent.name)}</strong>
          <small>${escapeHtml(agent.email)} · créé le ${escapeHtml(formatDate(agent.created_at))}</small>
        </div>
        <span class="state ${agent.active ? 'state-on' : 'state-off'}">${agent.active ? 'Actif' : 'Désactivé'}</span>
        <button class="btn btn-ghost btn-sm" type="button" data-action="toggle">${agent.active ? 'Désactiver' : 'Réactiver'}</button>
        <button class="btn btn-ghost btn-sm" type="button" data-action="reset">Mot de passe</button>
        <button class="btn btn-danger btn-sm" type="button" data-action="delete">Supprimer</button>
      </article>
    `).join('');
  } catch (error) {
    list.innerHTML = `<p class="empty">${escapeHtml(error.message)}</p>`;
  }
}

$('#agent-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  showError($('#agent-error'), '');
  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  try {
    await api('/api/agents', {
      method: 'POST',
      body: {
        name: field(form, 'name').value.trim(),
        email: field(form, 'email').value.trim(),
        password: field(form, 'password').value,
      },
    });
    form.reset();
    toast('Agent créé.');
    loadAgents();
  } catch (error) {
    showError($('#agent-error'), error.message);
  } finally {
    button.disabled = false;
  }
});

$('#agents-list').addEventListener('click', async (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const row = button.closest('.agent-row');
  const id = row.dataset.id;
  const agent = state.agents.find((item) => item.id === id);

  if (button.dataset.action === 'toggle' && agent) {
    try {
      await api('/api/agents', { method: 'PATCH', body: { id, active: !agent.active } });
      toast(agent.active ? 'Agent désactivé.' : 'Agent réactivé.');
      loadAgents();
    } catch (error) {
      toast(error.message, 'error');
    }
    return;
  }

  if (button.dataset.action === 'reset' && agent) {
    const password = prompt(`Nouveau mot de passe pour ${agent.name} (8 caractères minimum) :`);
    if (!password) return;
    try {
      await api('/api/agents', { method: 'PATCH', body: { id, password } });
      toast('Mot de passe réinitialisé.');
    } catch (error) {
      toast(error.message, 'error');
    }
    return;
  }

  if (button.dataset.action === 'delete' && agent) {
    if (!confirm(`Supprimer définitivement le compte de ${agent.name} ?`)) return;
    try {
      await api(`/api/agents?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      toast('Agent supprimé.');
      loadAgents();
    } catch (error) {
      toast(error.message, 'error');
    }
  }
});

/* ----------------------------------------------------------------- journal */

async function loadLogs() {
  if (!state.user || state.user.role !== 'admin') return;
  try {
    const data = await api('/api/logs?limit=120');
    const stats = data.stats || {};
    $('#stats').innerHTML = `
      <div class="stat"><span>Commandes</span><strong>${stats.orders_total || 0}</strong></div>
      <div class="stat"><span>Nouvelles</span><strong>${(stats.orders_by_status || {}).nouvelle || 0}</strong></div>
      <div class="stat"><span>Aujourd’hui</span><strong>${stats.orders_today || 0}</strong></div>
      <div class="stat"><span>Réalisations</span><strong>${stats.realisations || 0}</strong></div>
      <div class="stat"><span>Agents actifs</span><strong>${stats.agents_active || 0}</strong></div>
    `;
    const labels = {
      connexion: 'Connexion',
      deconnexion: 'Déconnexion',
      commande_creee: 'Nouvelle commande',
      commande_modifiee: 'Commande mise à jour',
      commande_supprimee: 'Commande supprimée',
      realisation_ajoutee: 'Réalisation ajoutée',
      realisation_modifiee: 'Réalisation modifiée',
      realisation_supprimee: 'Réalisation supprimée',
      agent_cree: 'Agent créé',
      agent_modifie: 'Agent modifié',
      agent_supprime: 'Agent supprimé',
      mot_de_passe: 'Mot de passe modifié',
    };
    $('#logs-list').innerHTML = (data.logs || []).map((entry) => `
      <div class="log-item">
        <strong>${escapeHtml(labels[entry.action] || entry.action)}</strong>
        <p>${escapeHtml(entry.details || '')}</p>
        <time>${escapeHtml(formatDate(entry.created_at))} · ${escapeHtml(entry.actor_email)} (${escapeHtml(entry.actor_role)})</time>
      </div>
    `).join('') || '<p class="empty">Aucune activité enregistrée.</p>';
  } catch (error) {
    $('#logs-list').innerHTML = `<p class="empty">${escapeHtml(error.message)}</p>`;
  }
}

$('#logs-refresh').addEventListener('click', loadLogs);

/* ------------------------------------------------------------------ compte */

$('#password-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  showError($('#password-error'), '');
  $('#password-success').hidden = true;
  if (field(form, 'next').value !== field(form, 'confirm').value) {
    return showError($('#password-error'), 'Les deux mots de passe ne correspondent pas.');
  }
  try {
    await api('/api/auth/password', {
      method: 'PATCH',
      body: { current: field(form, 'current').value, next: field(form, 'next').value },
    });
    form.reset();
    const success = $('#password-success');
    success.textContent = 'Mot de passe enregistré.';
    success.hidden = false;
  } catch (error) {
    showError($('#password-error'), error.message);
  }
});

boot();
