/**
 * VOD Corp — api.js
 * Capa de comunicación con el backend (Hono API)
 * Reglas Fase 5:
 * - Rutas relativas (/api/...)
 * - Token en sessionStorage
 * - Sanitización estricta (no XSS)
 * - Manejo centralizado de 401, 403 y errores
 */

const API_BASE = '/api';

const api = {
  // Manejo de autenticación en sessionStorage
  getToken() {
    return sessionStorage.getItem('vod_token') || '';
  },

  setToken(token) {
    if (token) {
      sessionStorage.setItem('vod_token', token);
    } else {
      sessionStorage.removeItem('vod_token');
    }
  },

  getUser() {
    try {
      const u = sessionStorage.getItem('vod_user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },

  setUser(user) {
    if (user) {
      sessionStorage.setItem('vod_user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('vod_user');
    }
  },

  clearAuth() {
    sessionStorage.removeItem('vod_token');
    sessionStorage.removeItem('vod_user');
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  isAdmin() {
    const u = this.getUser();
    return u && u.rol === 'admin';
  },

  // Función genérica de solicitud HTTP
  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);

      // 401: Sesión inválida o expirada -> limpiar y volver a login
      if (response.status === 401) {
        this.clearAuth();
        if (typeof window.onUnauthorized === 'function') {
          window.onUnauthorized();
        }
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || 'Sesión expirada. Por favor inicie sesión nuevamente.');
      }

      // 403: Verificar si requiere cambio obligatorio de clave o si es usuario inactivo
      if (response.status === 403) {
        const err = await response.json().catch(() => ({}));
        if (err.code === 'PASSWORD_CHANGE_REQUIRED' || (err.error && err.error.includes('PASSWORD_CHANGE_REQUIRED'))) {
          if (typeof window.onPasswordChangeRequired === 'function') {
            window.onPasswordChangeRequired();
          }
        } else if (err.error && err.error.toLowerCase().includes('inactivo')) {
          this.clearAuth();
          if (typeof window.onUserInactive === 'function') {
            window.onUserInactive();
          }
        }
        throw new Error(err.error || 'Acceso denegado');
      }

      // 429 o 503 (ej. en latidos o rate limit)
      if (response.status === 429 || response.status === 503) {
        const err = await response.json().catch(() => ({}));
        const errorObj = new Error(err.error || `Error ${response.status}`);
        errorObj.status = response.status;
        throw errorObj;
      }

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Error en la petición: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      throw err;
    }
  },

  // 1. Auth
  async login(email, password) {
    const res = await this.request('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    this.setToken(res.token);
    this.setUser(res.usuario);
    return res;
  },

  async changePassword(clave_actual, clave_nueva) {
    const res = await this.request('/auth/change-password', {
      method: 'POST',
      body: { clave_actual, clave_nueva },
    });
    if (res.token) {
      this.setToken(res.token);
    }
    if (res.usuario) {
      this.setUser(res.usuario);
    }
    return res;
  },

  async getMe() {
    return await this.request('/auth/me');
  },

  // 2. Videos y Catálogo
  async getVideos(params = {}) {
    const query = new URLSearchParams();
    if (params.q) query.set('q', params.q);
    if (params.categoria && params.categoria.toLowerCase() !== 'todas') query.set('categoria', params.categoria);
    if (params.orden) query.set('orden', params.orden);
    if (params.page) query.set('page', params.page);
    if (params.limit) query.set('limit', params.limit);

    const qs = query.toString();
    return await this.request(`/videos${qs ? '?' + qs : ''}`);
  },

  async getVideo(id) {
    return await this.request(`/videos/${id}`);
  },

  // 3. Progreso (solo lectura para "Continuar viendo" en Home)
  async getProgress(incluirCompletados = false) {
    const qs = incluirCompletados ? '?incluir_completados=1' : '';
    return await this.request(`/progress${qs}`);
  },

  // 4. Analítica y Latido del reproductor (escritor único de progreso)
  async sendAnalytics(videoId, evento, posicionSeg = 0) {
    try {
      return await this.request('/analytics', {
        method: 'POST',
        body: {
          video_id: videoId,
          evento,
          posicion_seg: Math.floor(posicionSeg),
        },
      });
    } catch (err) {
      // Ignorar silenciosamente errores de rate limit (429) o cola llena (503) durante latidos
      if (err.status === 429 || err.status === 503) {
        return null;
      }
      throw err;
    }
  },

  async getAnalyticsStats() {
    return await this.request('/analytics/stats');
  },

  // 5. Gestión de usuarios (solo admin)
  async getUsers() {
    return await this.request('/users');
  },

  async createUser(userData) {
    return await this.request('/users', {
      method: 'POST',
      body: userData,
    });
  },

  async updateUser(id, data) {
    return await this.request(`/users/${id}`, {
      method: 'PATCH',
      body: data,
    });
  },
};

// Exportar también al objeto global window para scripts tradicionales
window.api = api;
