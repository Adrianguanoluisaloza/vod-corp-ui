# VOD Corp — Boceto UI

Boceto navegable de la interfaz para la plataforma **VOD Corporativo** (Grupo 4).

Diseñado con el sistema visual de [shadcn/ui](https://github.com/shadcndashboard/shadcndashboard):
- Tokens CSS dark/light (variables HSL)
- Fuente **Geist** (Variable woff2)
- Íconos **Lucide** (SVG inline)
- Animaciones **tw-animate-css** (keyframes CSS, sin dependencias)

## Pantallas

| Pantalla | Descripción |
|---|---|
| 🔐 Login | Formulario con acceso rápido por rol |
| 🏠 Home | Dashboard con stats, "Continuar viendo" y bibliotecas |
| 📚 Catálogo | Grid de videos con filtros, badges y estados |
| ▶️ Player | Ficha + player HTML5 + progreso guardado |
| 📤 Publicar | Formulario de alta con preview e historial |
| 📊 Analítica | 6 métricas + top 10 con tasa de compleción |
| ⚙️ Admin | Tabla de usuarios semilla con último acceso |
| 🚫 403 | Acceso denegado con permisos del rol |

## Estructura

```
├── index.html
├── css/
│   ├── tokens.css       # Variables CSS shadcn/ui dark + light
│   ├── components.css   # Componentes: card, btn, badge, input, table…
│   └── animations.css   # Keyframes tw-animate-css + stagger
├── js/
│   └── app.js           # Navegación, toggle tema, Lucide icons, animaciones
└── assets/
    ├── fonts/           # Geist Sans + Geist Mono (woff2)
    └── images/
        ├── logos/       # logoicon.svg, darklogo.svg…
        └── avatars/     # user-1.png … user-10.png
```

## Stack final del proyecto

Este boceto es solo la referencia visual. El producto real se construye con:

- **Elixir + Phoenix LiveView** — interfaz reactiva en servidor
- **Tailwind CSS** — estilos (mismo sistema de tokens)
- **PostgreSQL + Ecto** — datos
- **Azure VM Ubuntu 24.04** — despliegue

## Grupo 4 · Universidad Técnica Luis Vargas Torres
Materia: Gráficas y Multimedia · 2026
