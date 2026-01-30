# Portafolio Jorge Cabrera

Portafolio profesional construido con Astro, TypeScript y Tailwind CSS.

## 🚀 Stack Tecnológico

- **Framework:** Astro 5.x
- **Styling:** Tailwind CSS 4.x
- **TypeScript:** Modo Strict
- **Interactividad:** React Islands
- **Deploy:** Netlify
- **Dominio:** jorge-cabrera.cl

## 📁 Estructura del Proyecto

```
portafolio-astro/
├── src/
│   ├── components/      # Componentes reutilizables
│   │   ├── Navbar.astro
│   │   ├── Footer.astro
│   │   └── ServiceCard.astro
│   ├── layouts/         # Layouts base
│   │   └── Layout.astro
│   ├── pages/           # Páginas del sitio
│   │   ├── index.astro  # Landing page
│   │   ├── 404.astro
│   │   └── proyectos/
│   │       └── importadora-dr.astro  # Case study
│   └── styles/
│       └── global.css   # Estilos de Tailwind
├── public/
│   └── img/             # Assets estáticos
├── astro.config.mjs     # Configuración de Astro
├── netlify.toml         # Configuración de Netlify
└── package.json
```

## 🛠️ Comandos

```bash
# Instalar dependencias
npm install

# Desarrollo local
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 🌐 Deploy en Netlify

Ver [DEPLOY.md](DEPLOY.md) para instrucciones completas.

**Quick start:**
1. Push a GitHub
2. Conectar repo en Netlify
3. Deploy automático
4. Configurar dominio jorge-cabrera.cl

## 📝 Agregar Nuevos Proyectos

1. Crea `src/pages/proyectos/nombre-proyecto.astro`
2. Usa el template de `importadora-dr.astro`
3. Agrega imágenes en `public/img/`
4. Push a GitHub → Deploy automático

## 📧 Contacto

- Email: jcabreralabbe@gmail.com
- Sitio: [jorge-cabrera.cl](https://jorge-cabrera.cl)

---

Desarrollado con ❤️ por Jorge Cabrera
