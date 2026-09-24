/* ============================================================
   VOD Corp — app.js (Integración Fase 5)
   Navegación + Autenticación + Catálogo + Player HLS + Admin + Analítica
   ============================================================ */

const SIDEBAR_SCREENS = ['home', 'catalog', 'player', 'publish', 'analytics', 'admin', 'error403'];

/* ── Lucide SVG sprite (iconos usados en el proyecto) ─────────── */
const ICONS = {
  home:       `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  library:    `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
  play:       `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>`,
  upload:     `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
  barChart:   `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  users:      `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  logOut:     `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
  plus:       `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  search:     `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  chevRight:  `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`,
  sun:        `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
  moon:       `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
  playCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>`,
  video:      `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>`,
  film:       `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>`,
  lock:       `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  ban:        `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>`,
  inbox:      `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>`,
  menu:       `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></svg>`,
  x:          `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  alertCircle:`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
};

/* ── Utilidad para escapar texto (Mitigación estricta de XSS) ── */
function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatDuration(seconds) {
  const s = parseInt(seconds, 10) || 0;
  const m = Math.floor(s / 60);
  const remS = s % 60;
  if (m === 0) return `${remS}s`;
  return remS > 0 ? `${m}m ${remS}s` : `${m} min`;
}

function formatTime(seconds) {
  const s = Math.floor(seconds) || 0;
  const m = Math.floor(s / 60);
  const remS = s % 60;
  return `${m}:${remS < 10 ? '0' : ''}${remS}`;
}

/* ── Estado Global de la Aplicación ─────────────────────────── */
let hlsInstance = null;
let heartbeatInterval = null;
let activeVideoId = null;
let catalogCurrentPage = 1;
let catalogCurrentCategory = 'Todas';
let catalogCurrentSearch = '';
let catalogCurrentSort = 'recientes';

/* ── Notificaciones Toast ────────────────────────────────────── */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const bgClass = type === 'error' ? 'bg-red-950 border-red-600 text-red-200' : 'bg-card border-border text-foreground';
  toast.className = `flex items-center gap-3 px-4 py-3 rounded-lg border shadow-xl text-sm transition-all duration-300 transform translate-y-2 opacity-0 ${bgClass}`;
  
  const span = document.createElement('span');
  span.textContent = message;
  toast.appendChild(span);
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* ── Control del Drawer / Sheet móvil ─────────────────────────── */
function openMobileDrawer() {
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('mobile-drawer-backdrop');
  if (drawer && backdrop) {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeMobileDrawer() {
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('mobile-drawer-backdrop');
  if (drawer && backdrop) {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/* ── Inyectar iconos Lucide en elementos con data-icon ─────────── */
function injectIcons(root = document) {
  root.querySelectorAll('[data-icon]').forEach(el => {
    const name = el.getAttribute('data-icon');
    if (ICONS[name]) el.innerHTML = ICONS[name];
  });
}

/* ── Animaciones de entrada al mostrar pantalla ───────────────── */
function animateScreen(screen) {
  const sidebar = screen.querySelector('aside');
  if (sidebar) {
    sidebar.classList.remove('animate-slide-left');
    void sidebar.offsetWidth;
    sidebar.classList.add('animate-slide-left');
  }

  const topbar = screen.querySelector('header');
  if (topbar) {
    topbar.classList.remove('animate-slide-top');
    void topbar.offsetWidth;
    topbar.classList.add('animate-slide-top');
  }

  const heading = screen.querySelector('h1');
  if (heading) {
    heading.classList.remove('animate-fade-up');
    void heading.offsetWidth;
    heading.classList.add('animate-fade-up');
  }

  const staggerTargets = screen.querySelectorAll('.card, [class*="grid"] > div, .table-wrap tr');
  staggerTargets.forEach((el, i) => {
    el.classList.remove('animate-fade-up', ...Array.from({length: 8}, (_, n) => `stagger-${n+1}`));
    void el.offsetWidth;
    el.classList.add('animate-fade-up', `stagger-${Math.min(i + 1, 8)}`);
  });
}

/* ── Actualizar perfil y navegación por roles en Topbar y Sidebar ─ */
function updateShellUserInfo() {
  const user = window.api.getUser();
  if (!user) return;

  const safeNombre = user.nombre || user.email || 'Usuario';
  const safeDept = user.departamento || (user.rol === 'admin' ? 'Administrador' : 'General');

  document.querySelectorAll('.user-display-name').forEach(el => {
    el.textContent = safeNombre;
  });
  document.querySelectorAll('.user-display-dept').forEach(el => {
    el.textContent = safeDept;
  });

  const isAdmin = user.rol === 'admin';
  document.querySelectorAll('.nav-admin-only').forEach(el => {
    el.style.display = isAdmin ? '' : 'none';
  });
}

/* ── Mostrar pantalla con control de acceso y carga dinámica ─── */
function show(id) {
  closeMobileDrawer();

  // Validación de autenticación
  const isAuth = window.api.isAuthenticated();
  const user = window.api.getUser();

  if (!isAuth && id !== 'login') {
    id = 'login';
  } else if (isAuth && id === 'login') {
    id = 'home';
  }

  // Protección de rutas administrativas
  if ((id === 'admin' || id === 'analytics') && !window.api.isAdmin()) {
    id = 'error403';
  }

  // Desactivar reproductor si cambiamos de pantalla
  if (id !== 'player') {
    stopPlayer();
  }

  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.bottom-nav-item').forEach(b => b.classList.remove('active'));

  document.querySelectorAll('.nav-item').forEach(b => {
    const oc = b.getAttribute('onclick') || '';
    if (oc.includes(`show('${id}')`)) {
      b.classList.add('active');
    } else if (oc.includes('show(')) {
      b.classList.remove('active');
    }
  });

  const screen = document.getElementById('screen-' + id);
  if (!screen) return;
  screen.classList.add('active');

  const bnavBtn = document.getElementById('bnav-' + id);
  if (bnavBtn) bnavBtn.classList.add('active');

  const bottomNav = document.getElementById('mobile-bottom-nav');
  if (bottomNav) {
    bottomNav.style.display = (id === 'login') ? 'none' : '';
  }

  if (SIDEBAR_SCREENS.includes(id)) {
    const sbEl = document.getElementById('sb-' + id);
    if (sbEl && sbEl.innerHTML.trim() === '') {
      sbEl.innerHTML = document.getElementById('tpl-sidebar').innerHTML;
      injectIcons(sbEl);
    }
    const tbEl = document.getElementById('tb-' + id);
    if (tbEl && tbEl.innerHTML.trim() === '') {
      tbEl.innerHTML = document.getElementById('tpl-topbar').innerHTML;
      injectIcons(tbEl);
    }
    screen.style.flexDirection = 'row';
    updateShellUserInfo();
  }

  injectIcons(screen);
  requestAnimationFrame(() => animateScreen(screen));
  window.scrollTo(0, 0);

  // Carga reactiva de datos por pantalla
  if (id === 'home') loadHomeScreen();
  if (id === 'catalog') loadCatalogScreen();
  if (id === 'admin') loadAdminScreen();
  if (id === 'analytics') loadAnalyticsScreen();
}

/* ── Toggle de tema ────────────────────────────────────────────── */
function toggleTheme() {
  document.documentElement.classList.toggle('dark');
  localStorage.setItem('vod-theme',
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );
}

/* ── Cierre de sesión ─────────────────────────────────────────── */
function logout() {
  stopPlayer();
  window.api.clearAuth();
  show('login');
  showToast('Has cerrado sesión exitosamente.');
}

/* ── Handlers Globales de API ──────────────────────────────────── */
window.onUnauthorized = function() {
  stopPlayer();
  show('login');
  showToast('Tu sesión ha expirado. Ingresa nuevamente.', 'error');
};

window.onUserInactive = function() {
  stopPlayer();
  show('login');
  showToast('Acceso denegado: Usuario inactivo. Consulta con Recursos Humanos.', 'error');
};

window.onPasswordChangeRequired = function() {
  openChangePasswordModal();
};

/* ================================================================
   MODAL: CAMBIO OBLIGATORIO DE CONTRASEÑA
   ================================================================ */
function openChangePasswordModal() {
  const modal = document.getElementById('modal-change-password');
  if (modal) {
    modal.classList.remove('hidden');
    const err = document.getElementById('cp-error');
    if (err) err.classList.add('hidden');
    const actual = document.getElementById('cp-actual');
    if (actual) actual.value = '';
    const nueva = document.getElementById('cp-nueva');
    if (nueva) nueva.value = '';
    const confirmar = document.getElementById('cp-confirmar');
    if (confirmar) confirmar.value = '';
  }
}

function closeChangePasswordModal() {
  const modal = document.getElementById('modal-change-password');
  if (modal) modal.classList.add('hidden');
}

/* ================================================================
   PANTALLA 1: LOGIN
   ================================================================ */
function setupLoginForm() {
  const form = document.getElementById('form-login');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');
    const submitBtn = document.getElementById('login-submit');

    errorEl.classList.add('hidden');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Verificando...';

    try {
      const res = await window.api.login(email, password);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Iniciar sesión';

      if (res.debe_cambiar_clave || (res.usuario && res.usuario.debe_cambiar_clave)) {
        openChangePasswordModal();
      } else {
        show('home');
      }
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Iniciar sesión';
      errorEl.textContent = err.message || 'Credenciales inválidas';
      errorEl.classList.remove('hidden');
    }
  });
}

function setupChangePasswordForm() {
  const form = document.getElementById('form-change-password');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const actual = document.getElementById('cp-actual').value;
    const nueva = document.getElementById('cp-nueva').value;
    const confirmar = document.getElementById('cp-confirmar').value;
    const errorEl = document.getElementById('cp-error');
    const submitBtn = document.getElementById('cp-submit');

    if (nueva.length < 10) {
      errorEl.textContent = 'La nueva contraseña debe tener al menos 10 caracteres.';
      errorEl.classList.remove('hidden');
      return;
    }

    if (nueva !== confirmar) {
      errorEl.textContent = 'La nueva contraseña y su confirmación no coinciden.';
      errorEl.classList.remove('hidden');
      return;
    }

    if (actual === nueva) {
      errorEl.textContent = 'La nueva contraseña debe ser diferente de la actual.';
      errorEl.classList.remove('hidden');
      return;
    }

    errorEl.classList.add('hidden');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Actualizando...';

    try {
      await window.api.changePassword(actual, nueva);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Actualizar contraseña y continuar';
      closeChangePasswordModal();
      showToast('Contraseña actualizada correctamente. ¡Bienvenido!');
      show('home');
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Actualizar contraseña y continuar';
      errorEl.textContent = err.message || 'Error al actualizar contraseña';
      errorEl.classList.remove('hidden');
    }
  });
}

/* ================================================================
   PANTALLA 2: HOME (CONTINUAR VIENDO Y BIBLIOTECAS)
   ================================================================ */
async function loadHomeScreen() {
  const user = window.api.getUser();
  if (user) {
    const greetingEl = document.getElementById('home-greeting');
    if (greetingEl) {
      greetingEl.textContent = `Bienvenido/a, ${user.nombre || user.email}. Aquí está tu actividad reciente.`;
    }
  }

  const continueGrid = document.getElementById('home-continue-grid');
  const continueCount = document.getElementById('home-continue-count');

  if (continueGrid) {
    continueGrid.innerHTML = '<div class="col-span-3 text-sm text-muted-foreground py-4">Cargando videos en curso...</div>';
    try {
      // Backend cambio 1: solo trae videos no completados
      const res = await window.api.getProgress();
      const items = res.progreso || [];

      if (continueCount) {
        continueCount.textContent = `${items.length} en progreso`;
      }

      if (items.length === 0) {
        continueGrid.innerHTML = `
          <div class="col-span-full card p-6 text-center border-dashed">
            <p class="text-sm font-medium">No tienes videos pendientes por continuar.</p>
            <p class="text-xs text-muted-foreground mt-1">Explora nuestro catálogo corporativo y capacítate.</p>
            <button onclick="show('catalog')" class="btn btn-default btn-sm mt-4">Explorar catálogo</button>
          </div>
        `;
      } else {
        continueGrid.innerHTML = '';
        items.forEach(p => {
          const pct = (p.duracion_seg > 0) ? Math.min(100, Math.round((p.posicion_seg / p.duracion_seg) * 100)) : 0;
          const remSeg = Math.max(0, (p.duracion_seg || 0) - (p.posicion_seg || 0));

          const card = document.createElement('div');
          card.className = 'card overflow-hidden cursor-pointer hover:border-foreground/30 transition-all group';
          card.onclick = () => playVideo(p.video_id);

          const thumbHtml = p.miniatura_url
            ? `<img src="${escapeHTML(p.miniatura_url)}" alt="${escapeHTML(p.titulo)}" class="w-full h-full object-cover" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';">
               <span data-icon="video" class="opacity-30 group-hover:opacity-60 transition-opacity" style="display:none"></span>`
            : `<span data-icon="video" class="opacity-30 group-hover:opacity-60 transition-opacity" style="display:flex"></span>`;

          card.innerHTML = `
            <div class="aspect-video relative flex items-center justify-center bg-muted overflow-hidden">
              ${thumbHtml}
              <span class="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-md bg-background/80">${formatDuration(p.duracion_seg)}</span>
              <div class="absolute bottom-0 left-0 right-0">
                <div class="progress-track" style="border-radius:0">
                  <div class="progress-fill" style="width:${pct}%"></div>
                </div>
              </div>
            </div>
            <div class="p-4">
              <p class="font-medium text-sm leading-tight mb-1 truncate">${escapeHTML(p.titulo)}</p>
              <div class="flex items-center justify-between">
                <span class="text-xs text-muted-foreground">${escapeHTML(p.categoria)} · ${formatDuration(remSeg)} restantes</span>
                <span class="text-xs font-semibold">${pct}%</span>
              </div>
            </div>
          `;
          continueGrid.appendChild(card);
        });
        injectIcons(continueGrid);
      }
    } catch (err) {
      if (continueGrid) {
        continueGrid.innerHTML = `<div class="col-span-3 text-sm text-red-400 py-2">Error cargando progreso: ${escapeHTML(err.message)}</div>`;
      }
    }
  }
}

/* ================================================================
   PANTALLA 3: CATÁLOGO DE VIDEOS
   ================================================================ */
async function loadCatalogScreen(page = 1) {
  catalogCurrentPage = page;
  const grid = document.getElementById('catalog-grid');
  const countEl = document.getElementById('catalog-count');
  const paginationEl = document.getElementById('catalog-pagination');

  if (grid) {
    grid.innerHTML = '<div class="col-span-full text-center py-12 text-sm text-muted-foreground">Cargando catálogo...</div>';
  }

  try {
    const res = await window.api.getVideos({
      q: catalogCurrentSearch,
      categoria: catalogCurrentCategory,
      orden: catalogCurrentSort,
      page: catalogCurrentPage,
      limit: 12,
    });

    const videos = res.videos || [];
    const pag = res.paginacion || { total: 0, page: 1, totalPages: 1 };

    if (countEl) {
      countEl.textContent = `${pag.total} video${pag.total === 1 ? '' : 's'} disponible${pag.total === 1 ? '' : 's'}`;
    }

    if (grid) {
      if (videos.length === 0) {
        grid.innerHTML = `
          <div class="col-span-full card flex flex-col items-center justify-center p-12 text-center border-dashed">
            <span data-icon="inbox" class="w-10 h-10 opacity-20 mb-3"></span>
            <p class="text-base font-semibold">No se encontraron videos</p>
            <p class="text-xs text-muted-foreground mt-1">Prueba con otros términos de búsqueda o filtros.</p>
          </div>
        `;
        injectIcons(grid);
      } else {
        grid.innerHTML = '';
        videos.forEach(v => {
          const card = document.createElement('div');
          card.className = 'card overflow-hidden cursor-pointer hover:border-foreground/30 transition-all group';
          card.onclick = () => playVideo(v.id);

          const thumbHtml = v.miniatura_url
            ? `<img src="${escapeHTML(v.miniatura_url)}" alt="${escapeHTML(v.titulo)}" class="w-full h-full object-cover" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';">
               <span data-icon="video" class="opacity-30 group-hover:opacity-60 transition-opacity" style="display:none"></span>`
            : `<span data-icon="video" class="opacity-30 group-hover:opacity-60 transition-opacity" style="display:flex"></span>`;

          card.innerHTML = `
            <div class="aspect-video relative flex items-center justify-center bg-muted overflow-hidden">
              ${thumbHtml}
              <span class="absolute top-2 left-2"><span class="badge badge-secondary">${escapeHTML(v.categoria)}</span></span>
              <span class="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-md bg-background/80">${formatDuration(v.duracion_seg)}</span>
            </div>
            <div class="p-4">
              <p class="font-medium text-sm truncate mb-1" title="${escapeHTML(v.titulo)}">${escapeHTML(v.titulo)}</p>
              <p class="text-xs text-muted-foreground line-clamp-2">${escapeHTML(v.descripcion || 'Sin descripción')}</p>
            </div>
          `;
          grid.appendChild(card);
        });
        injectIcons(grid);
      }
    }

    // Paginación
    if (paginationEl) {
      if (pag.totalPages > 1) {
        paginationEl.classList.remove('hidden');
        paginationEl.innerHTML = `
          <div class="text-xs text-muted-foreground">Página ${pag.page} de ${pag.totalPages}</div>
          <div class="flex items-center gap-2">
            <button class="btn btn-outline btn-sm" ${pag.page <= 1 ? 'disabled' : ''} onclick="loadCatalogScreen(${pag.page - 1})">Anterior</button>
            <button class="btn btn-outline btn-sm" ${pag.page >= pag.totalPages ? 'disabled' : ''} onclick="loadCatalogScreen(${pag.page + 1})">Siguiente</button>
          </div>
        `;
      } else {
        paginationEl.classList.add('hidden');
      }
    }
  } catch (err) {
    if (grid) {
      grid.innerHTML = `<div class="col-span-full text-center py-8 text-sm text-red-400">Error cargando catálogo: ${escapeHTML(err.message)}</div>`;
    }
  }
}

function setupCatalogFilters() {
  const searchInput = document.getElementById('catalog-search');
  if (searchInput) {
    let timeout = null;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        catalogCurrentSearch = e.target.value.trim();
        loadCatalogScreen(1);
      }, 350);
    });
  }

  const sortSelect = document.getElementById('catalog-sort');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      catalogCurrentSort = e.target.value;
      loadCatalogScreen(1);
    });
  }

  document.querySelectorAll('.cat-filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.cat-filter-btn').forEach(b => b.classList.remove('btn-default', 'active'));
      btn.classList.add('btn-default', 'active');
      catalogCurrentCategory = btn.getAttribute('data-cat') || 'Todas';
      loadCatalogScreen(1);
    });
  });
}

/* ================================================================
   PANTALLA 4: PLAYER HLS Y LATIDO
   ================================================================ */
function stopPlayer() {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
  const videoEl = document.getElementById('vod-player');
  if (videoEl) {
    // Adenda 5b punto 1: en stopPlayer(), ANTES de pausar, leer currentTime, enviar progress y quitar handlers
    const curPos = Math.floor(videoEl.currentTime) || 0;
    if (activeVideoId && curPos > 0) {
      window.api.sendAnalytics(activeVideoId, 'progress', curPos);
    }
    // Desvincular handlers para no disparar eventos duplicados al pausar
    videoEl.onplay = null;
    videoEl.onpause = null;
    videoEl.onended = null;
    videoEl.ontimeupdate = null;
    videoEl.pause();
    videoEl.removeAttribute('src');
    videoEl.load();
  }
  if (hlsInstance) {
    hlsInstance.destroy();
    hlsInstance = null;
  }
  activeVideoId = null;
}

async function playVideo(videoId) {
  stopPlayer();
  show('player');

  const videoEl = document.getElementById('vod-player');
  const hlsErrorEl = document.getElementById('player-hls-error');
  if (hlsErrorEl) hlsErrorEl.classList.add('hidden');

  const titleEl = document.getElementById('player-title');
  const breadcrumbEl = document.getElementById('player-breadcrumb-title');
  const categoryEl = document.getElementById('player-category');
  const durationEl = document.getElementById('player-duration');
  const descEl = document.getElementById('player-description');

  if (titleEl) titleEl.textContent = 'Cargando video...';

  try {
    const res = await window.api.getVideo(videoId);
    const video = res.video;
    activeVideoId = video.id;

    if (titleEl) titleEl.textContent = video.titulo;
    if (breadcrumbEl) breadcrumbEl.textContent = video.titulo;
    if (categoryEl) categoryEl.textContent = video.categoria;
    if (durationEl) durationEl.textContent = formatDuration(video.duracion_seg);
    if (descEl) descEl.textContent = video.descripcion || 'Sin descripción disponible.';

    const resumePos = video.ultima_posicion_seg || 0;
    const duracion = video.duracion_seg || 0;
    updatePlayerProgressBox(resumePos, duracion);

    const playlistUrl = `/hls/${video.id}/master.m3u8`;

    if (Hls.isSupported()) {
      hlsInstance = new Hls({
        xhrSetup: function(xhr, url) {
          const token = window.api.getToken();
          if (token) {
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
          }
        },
        maxBufferLength: 30,
      });

      hlsInstance.loadSource(playlistUrl);
      hlsInstance.attachMedia(videoEl);

      hlsInstance.on(Hls.Events.MANIFEST_PARSED, function() {
        if (resumePos > 0 && duracion > 0 && resumePos < duracion) {
          videoEl.currentTime = resumePos;
        }
        videoEl.play().catch(() => {});
      });

      let networkRetryCount = 0;
      let mediaRetryCount = 0;
      const MAX_RETRIES = 3;

      hlsInstance.on(Hls.Events.ERROR, function(event, data) {
        if (data.fatal) {
          console.warn('[HLS Fatal Error]', data.type, data.details);
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              if (data.response && data.response.code === 401) {
                stopPlayer();
                window.onUnauthorized();
              } else if (data.response && data.response.code === 403) {
                stopPlayer();
                showToast('Acceso denegado al streaming', 'error');
              } else if (networkRetryCount < MAX_RETRIES) {
                // Adenda 5b punto 2: Reintento con backoff exponencial
                networkRetryCount++;
                const delayMs = Math.pow(2, networkRetryCount) * 1000;
                console.log(`Reintentando carga HLS (${networkRetryCount}/${MAX_RETRIES}) en ${delayMs}ms...`);
                setTimeout(() => {
                  if (hlsInstance) hlsInstance.startLoad();
                }, delayMs);
              } else {
                stopPlayer();
                if (hlsErrorEl) {
                  hlsErrorEl.textContent = 'Error persistente de red al cargar el video. Por favor verifica tu conexión.';
                  hlsErrorEl.classList.remove('hidden');
                }
                showToast('Error de red persistente al cargar el video.', 'error');
              }
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              if (mediaRetryCount < MAX_RETRIES) {
                mediaRetryCount++;
                console.log(`Recuperando error de medio HLS (${mediaRetryCount}/${MAX_RETRIES})...`);
                hlsInstance.recoverMediaError();
              } else {
                stopPlayer();
                if (hlsErrorEl) {
                  hlsErrorEl.textContent = 'Error irrecuperable en el formato del video multimedia.';
                  hlsErrorEl.classList.remove('hidden');
                }
                showToast('Error al decodificar el video.', 'error');
              }
              break;
            default:
              stopPlayer();
              if (hlsErrorEl) {
                hlsErrorEl.textContent = 'No fue posible inicializar la reproducción del video.';
                hlsErrorEl.classList.remove('hidden');
              }
              break;
          }
        }
      });
    } else {
      // Adenda 5b punto 4: Fallback nativo de Safari no puede enviar Authorization
      // Reemplazado por mensaje claro en vez de intentar reproducir sin token y fallar con 401.
      if (hlsErrorEl) {
        hlsErrorEl.textContent = 'Tu navegador no soporta streaming protegido con Hls.js. Por favor actualiza a un navegador moderno (Safari en iOS 17.1+, Chrome, Edge o Firefox).';
        hlsErrorEl.classList.remove('hidden');
      }
      return;
    }

    // Configuración del latido único hacia /api/analytics
    setupPlayerHeartbeat(videoEl, video.id);

  } catch (err) {
    if (titleEl) titleEl.textContent = 'Error al cargar video';
    if (descEl) descEl.textContent = err.message;
    showToast(err.message, 'error');
  }
}

function updatePlayerProgressBox(current, total) {
  const pctEl = document.getElementById('player-progress-pct');
  const barEl = document.getElementById('player-progress-bar');
  const timeEl = document.getElementById('player-progress-time');

  const curSec = Math.floor(current) || 0;
  const totSec = Math.floor(total) || 0;
  const pct = totSec > 0 ? Math.min(100, Math.round((curSec / totSec) * 100)) : 0;
  const remSec = Math.max(0, totSec - curSec);

  if (pctEl) pctEl.textContent = `${pct}%`;
  if (barEl) barEl.style.width = `${pct}%`;
  if (timeEl) {
    timeEl.innerHTML = `<span>${formatTime(curSec)} visto</span><span>${formatTime(remSec)} restantes</span>`;
  }
}

function setupPlayerHeartbeat(videoEl, videoId) {
  // Limpiar listeners anteriores
  videoEl.onplay = () => {
    window.api.sendAnalytics(videoId, 'play', videoEl.currentTime);
    if (!heartbeatInterval) {
      // Latido cada 15 segundos (Regla Fase 5)
      heartbeatInterval = setInterval(() => {
        if (!videoEl.paused && !videoEl.ended) {
          window.api.sendAnalytics(videoId, 'progress', videoEl.currentTime);
          updatePlayerProgressBox(videoEl.currentTime, videoEl.duration);
        }
      }, 15000);
    }
  };

  videoEl.onpause = () => {
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
      heartbeatInterval = null;
    }
    const curPos = Math.floor(videoEl.currentTime) || 0;
    // Adenda 5b punto 1: en onpause enviar también progress con la posición actual (además del pause)
    window.api.sendAnalytics(videoId, 'progress', curPos);
    window.api.sendAnalytics(videoId, 'pause', curPos);
    updatePlayerProgressBox(curPos, videoEl.duration);
  };

  videoEl.onended = () => {
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
      heartbeatInterval = null;
    }
    window.api.sendAnalytics(videoId, 'ended', videoEl.duration || videoEl.currentTime);
    updatePlayerProgressBox(videoEl.duration || videoEl.currentTime, videoEl.duration || videoEl.currentTime);
  };

  videoEl.ontimeupdate = () => {
    // Actualizar caja de progreso cada segundo suavemente
    updatePlayerProgressBox(videoEl.currentTime, videoEl.duration);
  };
}

/* ================================================================
   PANTALLA 7: GESTIÓN DE USUARIOS (ADMIN)
   ================================================================ */
async function loadAdminScreen() {
  if (!window.api.isAdmin()) {
    show('error403');
    return;
  }

  const tbody = document.getElementById('admin-users-tbody');
  const countEl = document.getElementById('admin-users-count');
  if (tbody) {
    tbody.innerHTML = '<tr><td colspan="7" class="text-center py-8 text-sm text-muted-foreground">Cargando usuarios...</td></tr>';
  }

  try {
    const res = await window.api.getUsers();
    const users = res.usuarios || [];

    if (countEl) {
      countEl.textContent = `${users.length} usuario${users.length === 1 ? '' : 's'} registrado${users.length === 1 ? '' : 's'}`;
    }

    if (tbody) {
      if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center py-8 text-sm text-muted-foreground">No hay usuarios registrados</td></tr>';
      } else {
        tbody.innerHTML = '';
        users.forEach(u => {
          const tr = document.createElement('tr');
          const isActivo = !!u.activo;

          tr.innerHTML = `
            <td>
              <div class="flex items-center gap-2.5">
                <div class="avatar avatar-sm ${u.rol === 'admin' ? 'bg-red-700' : 'bg-blue-700'} font-semibold text-xs">
                  ${escapeHTML((u.nombre || 'U').substring(0, 2).toUpperCase())}
                </div>
                <span class="font-medium text-sm">${escapeHTML(u.nombre)}</span>
              </div>
            </td>
            <td class="text-xs text-muted-foreground font-mono">${escapeHTML(u.email)}</td>
            <td class="text-xs">${escapeHTML(u.departamento || 'General')}</td>
            <td class="text-xs text-muted-foreground">${escapeHTML(u.pais || 'Desconocido')}</td>
            <td><span class="badge ${u.rol === 'admin' ? 'badge-default' : 'badge-secondary'} text-xs">${escapeHTML(u.rol)}</span></td>
            <td>
              <span class="badge ${isActivo ? 'badge-success' : 'badge-destructive'} text-xs">
                ${isActivo ? 'Activo' : 'Inactivo'}
              </span>
            </td>
            <td class="text-right">
              <button class="btn btn-outline btn-sm text-xs py-1" onclick="toggleUserActive('${u.id}', ${isActivo})">
                ${isActivo ? 'Desactivar' : 'Activar'}
              </button>
            </td>
          `;
          tbody.appendChild(tr);
        });
      }
    }
  } catch (err) {
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center py-6 text-sm text-red-400">Error: ${escapeHTML(err.message)}</td></tr>`;
    }
  }
}

async function toggleUserActive(userId, currentlyActive) {
  try {
    await window.api.updateUser(userId, { activo: !currentlyActive });
    showToast(`Usuario ${!currentlyActive ? 'activado' : 'desactivado'} exitosamente.`);
    loadAdminScreen();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function openCreateUserModal() {
  const modal = document.getElementById('modal-create-user');
  if (modal) {
    modal.classList.remove('hidden');
    const err = document.getElementById('cu-error');
    if (err) err.classList.add('hidden');
    document.getElementById('form-create-user').reset();
  }
}

function closeCreateUserModal() {
  const modal = document.getElementById('modal-create-user');
  if (modal) modal.classList.add('hidden');
}

function setupCreateUserForm() {
  const form = document.getElementById('form-create-user');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('cu-nombre').value.trim();
    const email = document.getElementById('cu-email').value.trim();
    const departamento = document.getElementById('cu-departamento').value.trim();
    const pais = document.getElementById('cu-pais').value.trim();
    const rol = document.getElementById('cu-rol').value;
    const password = document.getElementById('cu-password').value;
    const errorEl = document.getElementById('cu-error');

    errorEl.classList.add('hidden');

    try {
      await window.api.createUser({
        nombre,
        email,
        departamento,
        pais,
        rol,
        password,
      });

      closeCreateUserModal();
      showToast('Usuario creado exitosamente con clave temporal obligatoria.');
      loadAdminScreen();
    } catch (err) {
      errorEl.textContent = err.message || 'Error creando usuario';
      errorEl.classList.remove('hidden');
    }
  });
}

/* ================================================================
   PANTALLA 6: ANALÍTICA (MÉTRICAS GLOBALES Y TOP 10)
   ================================================================ */
async function loadAnalyticsScreen() {
  if (!window.api.isAdmin()) {
    show('error403');
    return;
  }

  const statUsers = document.getElementById('stat-unique-users');
  const statTime = document.getElementById('stat-view-time');
  const statComp = document.getElementById('stat-completion-rate');
  const statPlays = document.getElementById('stat-total-plays');
  const topTable = document.getElementById('analytics-top-videos-tbody');

  if (topTable) {
    topTable.innerHTML = '<tr><td colspan="6" class="text-center py-6 text-sm text-muted-foreground">Cargando métricas...</td></tr>';
  }

  try {
    const res = await window.api.getAnalyticsStats();
    const g = res.metricas_globales || {};
    const top = res.top_videos || [];
    const eventos = res.resumen_eventos || [];

    let totalPlays = 0;
    eventos.forEach(ev => {
      if (ev.evento === 'play') totalPlays += parseInt(ev.total, 10);
    });

    if (statUsers) statUsers.textContent = g.usuarios_unicos ?? 0;
    if (statTime) {
      statTime.innerHTML = `${g.horas_vistas ?? 0}<span class="text-xs font-normal text-muted-foreground"> h (${g.minutos_vistos ?? 0} m)</span>`;
    }
    if (statComp) statComp.textContent = g.tasa_complecion_global || '0%';
    if (statPlays) statPlays.textContent = totalPlays;

    if (topTable) {
      if (top.length === 0) {
        topTable.innerHTML = '<tr><td colspan="6" class="text-center py-6 text-sm text-muted-foreground">Aún no hay reproducciones registradas</td></tr>';
      } else {
        topTable.innerHTML = '';
        top.forEach((v, idx) => {
          const compPct = parseFloat(v.porcentaje_complecion) || 0;
          const tr = document.createElement('tr');
          tr.className = 'cursor-pointer hover:bg-accent/50';
          tr.onclick = () => playVideo(v.id);

          tr.innerHTML = `
            <td class="font-mono text-xs text-muted-foreground">${idx + 1}</td>
            <td>
              <p class="font-medium text-sm truncate">${escapeHTML(v.titulo)}</p>
              <p class="text-xs text-muted-foreground">${escapeHTML(v.categoria)} · ${formatDuration(v.duracion_seg)}</p>
            </td>
            <td class="text-right font-semibold text-sm">${v.reproducciones || 0}</td>
            <td class="text-right text-xs text-muted-foreground">${v.espectadores_unicos || 0}</td>
            <td class="text-right text-xs text-muted-foreground">${formatDuration(v.duracion_seg)}</td>
            <td class="text-right">
              <div class="flex items-center justify-end gap-2">
                <div class="w-16 progress-track">
                  <div class="progress-fill" style="width:${compPct}%"></div>
                </div>
                <span class="text-xs font-bold ${compPct >= 70 ? 'text-green-500' : 'text-yellow-500'}">${compPct}%</span>
              </div>
            </td>
          `;
          topTable.appendChild(tr);
        });
      }
    }
  } catch (err) {
    if (topTable) {
      topTable.innerHTML = `<tr><td colspan="6" class="text-center py-6 text-sm text-red-400">Error: ${escapeHTML(err.message)}</td></tr>`;
    }
  }
}

/* ================================================================
   INICIALIZACIÓN DE LA APLICACIÓN
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Restaurar tema guardado
  const saved = localStorage.getItem('vod-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (saved === 'light' || (!saved && !prefersDark)) {
    document.documentElement.classList.remove('dark');
  } else {
    document.documentElement.classList.add('dark');
  }

  // 2. Inyectar iconos iniciales
  injectIcons(document);

  // 3. Inicializar formularios
  setupLoginForm();
  setupChangePasswordForm();
  setupCatalogFilters();
  setupCreateUserForm();

  // 4. Evaluar estado de sesión
  if (window.api.isAuthenticated()) {
    const user = window.api.getUser();
    if (user && user.debe_cambiar_clave) {
      show('login');
      openChangePasswordModal();
    } else {
      show('home');
    }
  } else {
    show('login');
  }
});
