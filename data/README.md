# Carpeta de Datos

Esta carpeta contiene archivos de datos utilizados por el sitio web de VRTon.

## Archivos importantes

### colaboradores.json

Este archivo contiene la información de todos los colaboradores que se muestran en la página de "Colaboradores".

#### Estructura del archivo

```json
[
    {
        "nombre": "Nombre Completo",
        "categoria": "Categoría",
        "descripcion": "Breve descripción del colaborador",
        "imagen": "nombre-archivo.jpg"
    },
    ...
]
```

#### Cómo añadir un nuevo colaborador

1. Asegúrate de tener la imagen del colaborador en la carpeta `/assets/colaboradores/`
2. Añade un nuevo objeto al array con la información del colaborador
3. Asegúrate de que el campo "imagen" coincida exactamente con el nombre del archivo en la carpeta de colaboradores

#### Categorías disponibles

- Moderación
- AudioVisuales
- 2D
- 3D
- Host
- MapMaking
- Dj/Show
- Marketing

Puedes añadir nuevas categorías según sea necesario, pero asegúrate de actualizar también el filtro en la página `colaboradores.html`.
