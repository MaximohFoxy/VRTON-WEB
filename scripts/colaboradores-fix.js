// Script específico para la página de colaboradores

document.addEventListener('DOMContentLoaded', () => {
    // Configurar filtros de categorías
    const botonesCategorias = document.querySelectorAll('.categoria-selector');

    botonesCategorias.forEach(boton => {
        boton.addEventListener('click', function() {
            // Actualizar clases activas
            botonesCategorias.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Obtener la categoría seleccionada
            const categoria = this.getAttribute('data-categoria');
            console.log('Categoría seleccionada:', categoria);

            // Filtrar colaboradores
            const tarjetas = document.querySelectorAll('.colaborador-card');

            tarjetas.forEach(tarjeta => {
                const categoriaTarjeta = tarjeta.getAttribute('data-categoria');

                if (categoria === 'todos' || categoriaTarjeta === categoria) {
                    tarjeta.style.display = 'block';
                } else {
                    tarjeta.style.display = 'none';
                }
            });
        });
    });

    console.log('Script de colaboradores cargado correctamente');
});
