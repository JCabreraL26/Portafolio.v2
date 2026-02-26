# Portafolio Jorge Cabrera

Portafolio profesional construido con Astro 5, React, TypeScript y Tailwind CSS 4. Sitio bilingüe (español/inglés) con componentes interactivos y animaciones.

## 🚀 Stack Tecnológico

- **Framework:** Astro 5.17.1
- **UI Framework:** React 19.2.4 (Islands Architecture)
- **Styling:** Tailwind CSS 4.1.18 con Vite
- **TypeScript:** Configuración estricta
- **Animaciones:** Framer Motion 12.29.2
- **Utilidades:** CLSX 2.1.1
- **Internacionalización:** Astro i18n (es/en)
- **SEO:** Sitemap automático
- **Deploy:** Netlify
- **Dominio:** jorge-cabrera.cl

## 📁 Estructura del Proyecto

```
portafolio-astro/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── BackgroundCircles.tsx    # Círculos animados de fondo
│   │   ├── Footer.astro              # Footer del sitio
│   │   ├── HeroCircle.tsx            # Componente hero interactivo
│   │   ├── InventoryScanner.tsx      # Scanner de inventario (React)
│   │   ├── LanguageSwitch.tsx        # Selector de idioma
│   │   ├── Navbar.astro              # Navegación principal
│   │   ├── PizzaSpinner.tsx          # Spinner animado
│   │   └── ServiceCard.astro         # Tarjetas de servicios
│   ├── i18n/               # Internacionalización
│   │   ├── es.json         # Traducciones español
│   │   ├── en.json         # Traducciones inglés
│   │   └── utils.ts        # Utilidades i18n
│   ├── layouts/            # Layouts base
│   │   └── Layout.astro    # Layout principal
│   ├── pages/              # Páginas del sitio
│   │   ├── index.astro     # Landing page principal
│   │   ├── 404.astro       # Página no encontrada
│   │   └── proyectos/      # Proyectos portfolio
│   │       ├── importadora-dr.astro  # Case study Importadora DR
│   │       └── menuclick.astro       # Case study MenuClick
│   └── styles/             # Estilos globales
│       └── global.css      # Configuración Tailwind
├── public/                 # Assets estáticos
│   ├── favicon.ico
│   ├── favicon.svg
│   └── img/               # Imágenes del sitio
├── astro.config.mjs       # Configuración Astro + i18n
├── netlify.toml           # Configuración Netlify
├── package.json           # Dependencias y scripts
└── tsconfig.json          # Configuración TypeScript
```

## 🛠️ Comandos

```bash
# Instalar dependencias
npm install

# Desarrollo local (http://localhost:4321)
npm run dev

# Build para producción
npm run build

# Preview del build local
npm run preview

# Comando Astro directo
npm run astro [comando]
```

## 🌐 Arquitectura y Características

### Islands Architecture
- Componentes React interactivos con `client:load`
- Componentes Astro estáticos para mejor rendimiento
- Hidratación selectiva solo donde se necesita

### Internacionalización
- Configuración i18n nativa de Astro
- Soporte para español (default) e inglés
- Routing sin prefijo para locale default
- Traducciones en JSON con data-i18n attributes

### Componentes Interactivos
- **HeroCircle:** Animación principal con Framer Motion
- **InventoryScanner:** Demo funcional de scanner
- **LanguageSwitch:** Cambio de idioma dinámico
- **BackgroundCircles:** Efectos visuales animados
- **PizzaSpinner:** Loader personalizado

### SEO y Performance
- Sitemap automático para todos los locales
- Optimización de imágenes en public/
- Build estático para máximo rendimiento
- PWA-ready con favicon moderno

## 🌐 Deploy en Netlify

Ver [DEPLOY.md](DEPLOY.md) para instrucciones completas.

**Quick start:**
1. Push a GitHub
2. Conectar repo en Netlify
3. Configurar build command: `npm run build`
4. Configurar publish directory: `dist`
5. Deploy automático con GitHub Actions
6. Configurar dominio jorge-cabrera.cl

## 📝 Agregar Nuevos Proyectos

1. Crea `src/pages/proyectos/nombre-proyecto.astro`
2. Usa el template de proyectos existentes
3. Agrega imágenes en `public/img/`
4. Agrega traducciones en `src/i18n/es.json` y `en.json`
5. Push a GitHub → Deploy automático

## 🎨 Personalización

### Colores y Estilos
- Variables CSS en `src/styles/global.css`
- Tailwind CSS 4 con configuración Vite
- Grid pattern personalizado en hero section

### Animaciones
- Framer Motion para componentes React
- CSS transitions para elementos estáticos
- Performance optimizada con will-change

## 📧 Contacto

- Email: jcabreralabbe@gmail.com
- Sitio: [jorge-cabrera.cl](https://jorge-cabrera.cl)
- GitHub: [JCabreraL26](https://github.com/JCabreraL26)

---

Desarrollado con ❤️ y Astro por Jorge Cabrera
