# 🔧 Guía de Modo de Mantenimiento - VRTon

## 🎯 Problema Actual
Actualmente usas `11-index.html` como archivo temporal mientras desarrollas, pero esto no es la mejor práctica para modo de mantenimiento.

## 💡 Solución Recomendada: Modo de Mantenimiento Profesional

### Opción 1: Usando .htaccess (Recomendado)

Crea un archivo `maintenance.html` simple y elegante:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VRTon - Sitio en Mantenimiento</title>
    <link rel="stylesheet" href="styles.css">
    <style>
        .maintenance-page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            background: var(--color-bg-dark);
            color: var(--color-text-light);
        }
        .maintenance-content {
            max-width: 600px;
            padding: 2rem;
        }
        .maintenance-logo {
            width: 150px;
            margin-bottom: 2rem;
        }
        .countdown {
            font-size: 1.2rem;
            margin: 2rem 0;
            color: var(--color-primary);
        }
    </style>
</head>
<body>
    <div class="maintenance-page">
        <div class="maintenance-content">
            <img src="assets/logo.png" alt="VRTon" class="maintenance-logo">
            <h1>🔧 Sitio en Mantenimiento</h1>
            <p>Estamos trabajando para mejorar tu experiencia. Volvemos pronto con novedades increíbles.</p>
            <div class="countdown" id="countdown">Estimado: 2 horas</div>
            <div class="social-links">
                <a href="https://discord.gg/gSCsPKTsVJ">Discord</a> | 
                <a href="https://instagram.com/vrtonoficial">Instagram</a>
            </div>
        </div>
    </div>
</body>
</html>
```

Luego en `.htaccess`, añade al principio:

```apache
# Modo de mantenimiento
# Para activar: descomenta las siguientes 4 líneas
# RewriteCond %{REMOTE_ADDR} !^123\.456\.789\.123$  # Tu IP (opcional)
# RewriteCond %{REQUEST_URI} !/maintenance.html$
# RewriteCond %{REQUEST_URI} !/assets/
# RewriteRule ^(.*)$ /maintenance.html [R=503,L]
```

### Opción 2: Usando Variables de Entorno

En tu `.htaccess`:

```apache
# Verificar si existe archivo de mantenimiento
RewriteCond %{DOCUMENT_ROOT}/maintenance.flag -f
RewriteCond %{REQUEST_URI} !/maintenance.html$
RewriteCond %{REQUEST_URI} !/assets/
RewriteRule ^(.*)$ /maintenance.html [R=503,L]
```

Para activar: `touch maintenance.flag`
Para desactivar: `rm maintenance.flag`

### Opción 3: Renombrado Inteligente (Para tu caso actual)

1. **Cuando esté listo para producción:**
```bash
# Renombrar el archivo actual
mv 11-index.html index.html

# Actualizar .htaccess para servir index.html
# Cambiar la línea:
RewriteRule ^$ index.html [L]
```

2. **Actualizar Service Worker cache:**
```javascript
const urlsToCache = [
  '/',
  '/index.html',  // En lugar de 11-index.html
  '/colaboradores.html',
  // ... resto de archivos
];
```

## 🚀 Migración Paso a Paso (Recomendada)

### Paso 1: Preparar para el cambio
```bash
# 1. Commit todos los cambios actuales
git add .
git commit -m "Preparar para migración a index.html"

# 2. Crear backup
cp 11-index.html index.html
```

### Paso 2: Actualizar configuración
```bash
# Actualizar .htaccess
sed -i 's/11-index\.html/index.html/g' .htaccess

# Actualizar Service Worker
sed -i 's/11-index\.html/index.html/g' sw.js
```

### Paso 3: Testing y deploy
```bash
# Test local
# Abrir navegador y verificar que / funciona correctamente

# Deploy
git add .
git commit -m "🚀 Migrar de 11-index.html a index.html"
git push
```

### Paso 4: Cleanup
```bash
# Eliminar archivo temporal
rm 11-index.html
git add .
git commit -m "🗑️ Remover archivo temporal 11-index.html"
```

## 🎯 Ventajas de cada Opción

### Modo Mantenimiento con .htaccess:
✅ Control total sobre cuándo activar/desactivar
✅ Página dedicada con información útil
✅ Códigos de estado HTTP correctos (503)
✅ Permite acceso desde tu IP durante desarrollo

### Renombrado a index.html:
✅ Estándar web universal
✅ URLs más limpias (solo /)
✅ Mejor SEO
✅ No necesita configuración especial del servidor

## 📋 Recomendación Final

**Para VRTon, recomiendo:**

1. **Inmediato:** Usar el renombrado a `index.html` (Opción 3)
2. **Futuro:** Implementar sistema de mantenimiento con `.htaccess` (Opción 1)

Esto te dará:
- URLs profesionales (`vrton.org/` en lugar de `vrton.org/11-index.html`)
- Sistema de mantenimiento para futuras actualizaciones
- Mejor experiencia de usuario y SEO

¿Quieres que implemente alguna de estas opciones ahora?
