// Función para cargar juegos en una sección específica
async function cargarJuegos(seccion = '', nombre = '', anio = '') {
    try {
        const response = await fetch(`api_videojuegos.php?seccion=${seccion}&nombre=${encodeURIComponent(nombre)}&anio=${anio}`);
        const juegos = await response.json();

        const section = seccion === 'otros' ? document.getElementById('otrosJuegosContainer') : document.getElementById('juegosContainer');
        section.innerHTML = '';  // Limpiar el contenido inicial

        if (juegos.length === 0) {
            section.innerHTML = '<p>No se encontraron juegos.</p>'; // Mensaje si no hay resultados
            return;
        }

        juegos.forEach(juego => {
            const juegoDiv = document.createElement('div');
            juegoDiv.classList.add('game');
            juegoDiv.dataset.lanzamiento = juego.lanzamiento;

            juegoDiv.innerHTML = `
                <img src="imagenes_juegos/${juego.imagen_url}" alt="${juego.titulo}">
                <h2>${juego.titulo}</h2>
                <p>${juego.descripcion}</p>
                <p><strong>Plataformas:</strong> ${juego.plataformas}</p>
                <p><strong>Lanzamiento:</strong> ${juego.lanzamiento}</p>
            `;

            section.appendChild(juegoDiv);
        });
    } catch (error) {
        console.error('Error al cargar los juegos:', error);
    }
}

// Elementos de navegación
const sectionHome = document.getElementById('home');
const sectionGames = document.getElementById('games');
const sectionOtrosJuegos = document.getElementById('otros-juegos');
const sectionContacto = document.getElementById('contacto');
const filtroAnio = document.getElementById('filtroAnio');
const filtroAnioOtros = document.getElementById('filtroAnioOtros'); // Asegúrate de que este ID sea correcto

// Elementos de búsqueda
const buscadorNombre = document.getElementById('buscadorNombre'); // Asegúrate de tener este campo en tu HTML
const botonBuscar = document.getElementById('botonBuscar'); // Asegúrate de tener este botón en tu HTML
const botonFiltro = document.getElementById('botonFiltro'); // Asegúrate de tener este botón en tu HTML

// Ocultar todas las secciones excepto "Inicio"
function mostrarSeccion(seccion) {
    sectionHome.style.display = seccion === 'home' ? 'block' : 'none';
    sectionGames.style.display = seccion === 'gotys' ? 'block' : 'none';
    sectionOtrosJuegos.style.display = seccion === 'otros' ? 'block' : 'none';
    sectionContacto.style.display = seccion === 'contacto' ? 'block' : 'none';

    // Mostrar/ocultar filtros
    filtroAnio.style.display = (seccion === 'gotys' || seccion === 'otros') ? 'block' : 'none';
}

// Cargar "Inicio" al inicio
mostrarSeccion('home');

// Enlace a "Inicio"
const inicioLink = document.querySelector('nav a[href="#home"]');
if (inicioLink) {
    inicioLink.addEventListener('click', function (e) {
        e.preventDefault();
        mostrarSeccion('home');
    });
}

// Enlace a "Gotys"
const gotysLink = document.querySelector('nav a[href="#games"]');
if (gotysLink) {
    gotysLink.addEventListener('click', function (e) {
        e.preventDefault();
        cargarJuegos('gotys');
        mostrarSeccion('gotys');
    });
}

// Enlace a "Otros Juegos Interesantes"
const otrosJuegosLink = document.querySelector('nav a[href="#otros-juegos"]');
if (otrosJuegosLink) {
    otrosJuegosLink.addEventListener('click', function (e) {
        e.preventDefault();
        cargarJuegos('otros');
        mostrarSeccion('otros');
    });
}

// Enlace a "Contacto"
const contactoLink = document.querySelector('nav a[href="#contacto"]');
if (contactoLink) {
    contactoLink.addEventListener('click', function (e) {
        e.preventDefault();
        mostrarSeccion('contacto');
    });
}

// Lógica para buscar juegos por nombre
botonBuscar.addEventListener('click', function() {
    const nombreBuscado = buscadorNombre.value.trim();
    if (sectionGames.style.display === 'block') {
        cargarJuegos('gotys', nombreBuscado);
    } else if (sectionOtrosJuegos.style.display === 'block') {
        cargarJuegos('otros', nombreBuscado);
    }
});

// Lógica para filtrar juegos por año
botonFiltro.addEventListener('click', function() {
    const anioSeleccionado = filtroAnio.value;
    if (sectionGames.style.display === 'block') {
        cargarJuegos('gotys', '', anioSeleccionado);
    }
});