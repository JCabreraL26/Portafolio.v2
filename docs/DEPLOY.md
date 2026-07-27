# Instrucciones de Deploy Rápido

## 🚀 Deploy en Netlify (5 minutos)

### Paso 1: Preparar el código

```bash
# En la carpeta del proyecto
cd c:\Users\dell\.vscode\portafolio-astro

# Verificar que el build funciona
npm run build
```

### Paso 2: Subir a GitHub

```bash
# Inicializar git
git init

# Agregar todos los archivos
git add .

# Primer commit
git commit -m "🚀 Portafolio profesional con Astro"

# Crear branch main
git branch -M main

# Conectar con GitHub (reemplaza con tu URL de repo)
git remote add origin https://github.com/jcabreralabbe/portafolio.git

# Subir código
git push -u origin main
```

### Paso 3: Conectar Netlify

1. Ve a https://app.netlify.com
2. Click en **"Add new site"** → **"Import an existing project"**
3. Selecciona **GitHub**
4. Busca y selecciona tu repositorio `portafolio`
5. Netlify auto-detectará Astro:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click en **"Deploy site"**
7. ¡Espera 1-2 minutos y tu sitio estará live!

### Paso 4: Configurar dominio jorge-cabrera.cl

1. En Netlify, ve a **Site settings** → **Domain management**
2. Click en **"Add custom domain"**
3. Ingresa: `jorge-cabrera.cl`
4. Netlify te dará instrucciones específicas para tu proveedor de DNS

**Configuración típica de DNS:**

En el panel de tu proveedor de dominio (donde compraste jorge-cabrera.cl):

```
Tipo: A
Nombre: @
Valor: 75.2.60.5

Tipo: CNAME  
Nombre: www
Valor: [tu-sitio].netlify.app
```

5. Espera 24-48hrs para propagación de DNS
6. Netlify configurará SSL automáticamente (HTTPS)

### Paso 5: Verificar

✅ Tu sitio estará en: https://jorge-cabrera.cl
✅ SSL/HTTPS configurado automáticamente
✅ CDN global activado
✅ Builds automáticos en cada push a GitHub

## 🔄 Actualizaciones Futuras

Cada vez que quieras actualizar el sitio:

```bash
# Hacer cambios en el código
# ...

# Commit y push
git add .
git commit -m "Update: descripción de cambios"
git push

# Netlify despliega automáticamente en 1-2 minutos
```

## ⚡ Deploy Alternativo: Netlify Drop

Si no quieres usar GitHub:

1. Ejecuta: `npm run build`
2. Ve a https://app.netlify.com/drop
3. Arrastra la carpeta `dist` al navegador
4. ¡Listo! (pero sin auto-deploys)

---

**¿Problemas?** Revisa los logs en Netlify → Deploys → [último deploy] → Deploy log
