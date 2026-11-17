import { PortafolioService, Proyecto } from "./portafolioService.js";

// Una sola instancia del servicio para toda la página
const portafolio = new PortafolioService();

const formulario = document.getElementById('formProyecto');
const contenedor = document.querySelector('.projects__container');
const botonGuardar = formulario.querySelector('button[type="submit"]');
let proyectoEditandoId = null;

formulario.addEventListener('submit', guardarFormulario);
contenedor.addEventListener('click', manejarClickProyecto);

function multilineALista(texto) {
    return texto
        .split('\n')
        .map(linea => linea.trim())
        .filter(linea => linea !== '');
}

function guardarFormulario(event) {
    event.preventDefault();

    const datos = new FormData(formulario);

    const proyecto = new Proyecto(
        datos.get('name').trim(),
        multilineALista(datos.get('tecnologies')),
        datos.get('description').trim(),
        multilineALista(datos.get('contributors')),
        datos.get('repository').trim()
    );

    if (proyectoEditandoId === null) {
        portafolio.guardarProyecto(proyecto);
    } else {
        portafolio.actualizarProyecto(proyectoEditandoId, proyecto);
    }

    salirModoEdicion();
    renderProyectos();
}

function manejarClickProyecto(event) {
    const boton = event.target.closest('button[data-action]');
    if (!boton) return;

    const id = Number(boton.dataset.id);

    if (boton.dataset.action === 'eliminar') {
        eliminarProyecto(id);
    } else if (boton.dataset.action === 'modificar') {
        modificarProyecto(id);
    }
}

function eliminarProyecto(id) {
    if (!confirm('¿Seguro que quieres eliminar este proyecto?')) return;

    portafolio.eliminarProyecto(id);

    if (proyectoEditandoId === id) {
        salirModoEdicion();
    }
    renderProyectos();
}

function modificarProyecto(id) {
    const proyecto = portafolio.getProyectos().find(p => p.id === id);
    if (!proyecto) return;

    proyectoEditandoId = id;

    document.getElementById('name').value = proyecto.nombre;
    document.getElementById('description').value = proyecto.descripcion;
    document.getElementById('tecnologies').value = proyecto.tecnologias.join('\n');
    document.getElementById('contributors').value = proyecto.coolaboradores.join('\n');
    document.getElementById('repository').value = proyecto.repositorio;

    botonGuardar.textContent = 'Actualizar';
    document.getElementById('name').focus();
}

function salirModoEdicion() {
    proyectoEditandoId = null;
    formulario.reset();
    botonGuardar.textContent = 'Guardar';
}

function crearSeccionLista(titulo, items) {
    const fragmento = document.createDocumentFragment();

    const p = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = titulo;
    p.appendChild(strong);

    const seccion = document.createElement('div');
    seccion.className = 'projects__section';
    const ul = document.createElement('ul');
    items.forEach(texto => {
        const li = document.createElement('li');
        li.textContent = texto;
        ul.appendChild(li);
    });
    seccion.appendChild(ul);

    fragmento.append(p, seccion);
    return fragmento;
}

function crearBoton(texto, accion, id, clase) {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.textContent = texto;
    boton.className = clase;
    boton.dataset.action = accion;
    boton.dataset.id = id;
    return boton;
}

function crearTarjetaProyecto(proyecto) {
    const tarjeta = document.createElement('div');
    tarjeta.id = `${proyecto.id}-project`;
    tarjeta.className = 'project';

    const h3 = document.createElement('h3');
    h3.textContent = proyecto.nombre;

    const descripcion = document.createElement('p');
    descripcion.textContent = proyecto.descripcion;

    const repo = document.createElement('div');
    repo.textContent = `Puedes encontrar el repositorio en ${proyecto.repositorio}`;

    const acciones = document.createElement('div');
    acciones.className = 'project__actions';
    acciones.append(
        crearBoton('Modificar', 'modificar', proyecto.id, 'btn btn--edit'),
        crearBoton('Eliminar', 'eliminar', proyecto.id, 'btn btn--delete')
    );

    tarjeta.append(
        h3,
        descripcion,
        crearSeccionLista('Tecnologias', proyecto.tecnologias),
        crearSeccionLista('Coolaboradores', proyecto.coolaboradores),
        repo,
        acciones
    );
    return tarjeta;
}

function renderProyectos() {
    contenedor.replaceChildren();
    portafolio.getProyectos().forEach(proyecto => {
        contenedor.appendChild(crearTarjetaProyecto(proyecto));
    });
}