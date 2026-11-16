import { PortafolioService, Proyecto } from "./portafolioService.js";

const portafolio = new PortafolioService();

const formulario = document.getElementById('formProyecto');
const contenedor = document.querySelector('.projects__container');

formulario.addEventListener('submit', createProyecto);

function multilineALista(texto) {
    return texto
        .split('\n')
        .map(linea => linea.trim())
        .filter(linea => linea !== '');
}

function createProyecto(event) {
    event.preventDefault();

    const datos = new FormData(formulario);

    const proyecto = new Proyecto(
        datos.get('name').trim(),
        multilineALista(datos.get('tecnologies')),
        datos.get('description').trim(),
        multilineALista(datos.get('contributors')),
        datos.get('repository').trim()
    );

    portafolio.guardarProyecto(proyecto);
    renderProyectos();
    formulario.reset();
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

    tarjeta.append(
        h3,
        descripcion,
        crearSeccionLista('Tecnologias', proyecto.tecnologias),
        crearSeccionLista('Coolaboradores', proyecto.coolaboradores),
        repo
    );
    return tarjeta;
}

function renderProyectos() {
    contenedor.replaceChildren();
    portafolio.getProyectos().forEach(proyecto => {
        contenedor.appendChild(crearTarjetaProyecto(proyecto));
    });
}