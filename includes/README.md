# Sistema de Componentes Header/Footer - VRTon

Este sistema permite mantener el header (navegación) y footer de manera centralizada para todas las páginas del sitio web.

## Estructura de Archivos

```
includes/
├── header.html          # Componente del header/navegación
├── footer.html          # Componente del footer
└── page-template.html   # Plantilla para nuevas páginas

scripts/
└── components.js        # Script que carga los componentes automáticamente
```

## Cómo Funciona

1. **Carga Automática**: El script `components.js` se ejecuta en cada página y carga automáticamente el header y footer desde los archivos en `/includes/`
2. **Funcionalidad Preservada**: El script reinicializa todas las funcionalidades del menú móvil y navegación después de cargar los componentes
3. **Página Activa**: Marca automáticamente la página actual en la navegación

## Uso en Páginas Existentes

Para convertir una página existente al sistema de componentes:

1. **Eliminar el header HTML** y reemplazar con un comentario:
   ```html
   <!-- Header se carga automáticamente vía JavaScript -->
   ```

2. **Eliminar el footer HTML** y reemplazar con un comentario:
   ```html
   <!-- Footer se carga automáticamente vía JavaScript -->
   ```

3. **Agregar el script de componentes** antes de otros scripts:
   ```html
   <script src="scripts/components.js" defer></script>
   ```

## Crear Nuevas Páginas

1. **Copia la plantilla**: Usa `includes/page-template.html` como base
2. **Personaliza los metadatos**: Reemplaza `[TÍTULO DE LA PÁGINA]`, `[DESCRIPCIÓN DE LA PÁGINA]`, etc.
3. **Agrega tu contenido**: Coloca el contenido específico de la página en la sección `<main>`
4. **Scripts adicionales**: Agrega scripts específicos de la página al final

## Ventajas

✅ **Mantenimiento Centralizado**: Edita header/footer una sola vez para todas las páginas  
✅ **Consistencia**: Garantiza que todas las páginas tengan la misma navegación  
✅ **Funcionalidad Completa**: Preserva el menú móvil y todas las características  
✅ **SEO Amigable**: No afecta la indexación de motores de búsqueda  
✅ **Indicador de Página Activa**: Marca automáticamente la página actual en la navegación  

## Modificar Header/Footer

Para cambiar el header o footer en todo el sitio:

1. **Edita** `includes/header.html` o `includes/footer.html`
2. **Guarda** los cambios
3. **Recarga** cualquier página del sitio - los cambios aparecerán automáticamente

## Páginas Compatibles

- ✅ `index.html` - Convertida al sistema de componentes
- ✅ `colaboradores.html` - Convertida al sistema de componentes
- ⚠️ Otras páginas HTML necesitan ser convertidas manualmente

## Notas Técnicas

- Los componentes se cargan usando `fetch()` API
- Compatible con todos los navegadores modernos
- El script maneja errores gracefully si los archivos no se encuentran
- La funcionalidad del menú móvil se reinicializa automáticamente
- El sistema es compatible con las páginas que usan Furality styling

## Estructura del HTML Resultante

Después de que el script cargue los componentes, la estructura será:

```html
<body>
    <header><!-- Cargado desde includes/header.html --></header>
    
    <!-- Contenido específico de la página -->
    <main>...</main>
    
    <footer><!-- Cargado desde includes/footer.html --></footer>
    <script src="scripts/components.js"></script>
</body>
```
