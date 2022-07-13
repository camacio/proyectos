//botones
const botonAñadir = document.querySelector(".boton-añadir");
const botonHabilitar = document.querySelector(".boton-habilitar");
const botonConfirmarHorario = document.querySelector(".confirmar-horario");
const botonEliminar = document.querySelector(".eliminar");
const botonDeshabilitar = document.querySelector(".deshabilitar-horario");
const botonesFormulario = document.querySelector(".botones-formulario");

const tabla = document.querySelector(".tabla");
const formulario = document.querySelector(".formulario");
const cabeceraHorario = document.querySelector(".cabecera-horario");
const filaBotonHorario = document.querySelector(".botones-horario");
const parrafoHorario = document.querySelector(".parrafo-horario");
const widget = document.querySelector(".widget");

//inputs
const listaCheckBox = document.querySelector(".lista-checkbox");
const inputDia = document.querySelector("#input-dia");
const checkbox = document.querySelector(".checkbox");
const inputHoraInicio = document.querySelector("#hora-inicio");
const inputHoraFin = document.querySelector("#hora-fin");

const datos = {
  id: 0,
  horaInicio: "",
  horaFin: "",
  duracion: 0,
};

//listeners

botonAñadir.addEventListener("click", function () {
  formulario.classList.toggle("hidden");
  parrafoHorario.classList.add("hidden");
  añadirHora();
  cambiarIcono(this, "add", "close");

  if (!tabla.classList.contains("hidden")) {
    tabla.classList.add("hidden");
  }

  if(formulario.classList.contains("hidden")){
    tabla.classList.remove("hidden");
  }

  valorCheckbox = [];
  inputDia.value = "";
  botonHabilitar.classList.toggle("hidden");

  inputDia.value = calcularDiaActual();

  botonEliminar.classList.add("hidden");
  botonDeshabilitar.classList.add("hidden");
  botonesFormulario.classList.remove("reverse");  

});

botonHabilitar.addEventListener("click", function () {
  cambiarIcono(this, "alarm", "alarm_off");
});

widget.addEventListener("click", mostrarListaCheckbox);

botonConfirmarHorario.addEventListener("click", confirmarHorario);

botonEliminar.addEventListener("click", eliminarHorario);

listaCheckBox.addEventListener("click", function (e) {
  obtenerCheckbox(e);
});

botonDeshabilitar.addEventListener("click", function (e) {
  e.preventDefault();

  cambiarIcono(this, "alarm", "alarm_off");
});

//funciones

function confirmarHorario(e) {
  e.preventDefault();

  tabla.classList.toggle("hidden");
  formulario.classList.add("hidden");

  obtenerCheckbox(e);

  calcularHorario();

  insertarFilaDatos();

  insertarFilaBotones();

  botonHabilitar.classList.toggle("hidden");

  cambiarIcono(botonAñadir, "add", "close");

  if (tabla.rows.length === 5) {
    cabeceraHorario.classList.remove("hidden");
  }

  botonEliminar.classList.add("hidden");
  botonDeshabilitar.classList.add("hidden");

}

function calcularDiaActual() {
  const fecha = new Date();

  const dias = [
      "D",
      "L",
      "M",
      "M",
      "J",
      "V",
      "S",
    ];

    return dias[fecha.getDay()];
}

function calcularHorario() {
  datos.id = datos.id + 1;

  calcularHora();
}

function calcularHora() {
  const fecha = new Date();
  const horaInicio = inputHoraInicio.value;

  const nuevaHoraInicio = new Date(
    fecha.toString().split(":")[0].slice(0, -2) + horaInicio
  );

  datos.horaInicio = nuevaHoraInicio.getTime();
  console.log(datos.horaInicio);

  const horaFin = inputHoraFin.value;

  const nuevaHoraFin = new Date(
    fecha.toString().split(":")[0].slice(0, -2) + horaFin
  );

  datos.horaFin = nuevaHoraFin.getTime();
  console.log(datos.horaFin);

  const duracion = datos.horaFin - datos.horaInicio;
  datos.duracion = `${new Date(duracion).getMinutes()}min`;
}

function añadirHora() {
  let hora = new Date().getHours();
  let minutos = new Date().getMinutes();

  if(hora<10){
    hora = `0${hora}`;
  }

  if(minutos<10){
    minutos = `0${minutos}`;
  }

  const horaCompletaInicio = hora + ":" + minutos;
  inputHoraInicio.value = horaCompletaInicio;
  const horaCompletaFin = `${hora}:${minutos + 5}`;
  inputHoraFin.value = horaCompletaFin;
}

function insertarFilaDatos() {
  const fila = tabla.insertRow();
  fila.classList.add("cabecera-datos");

  for (const dato in datos) {
    const celda = fila.insertCell();

    if (datos[dato] == datos.horaInicio) {
      celda.textContent = inputHoraInicio.value;
    } else if (datos[dato] == datos.horaFin) {
      celda.textContent = inputHoraFin.value;
    } else {
      celda.textContent = datos[dato];
    }
  }
}

function mostrarListaCheckbox(e) {
  if (inputDia.contains(e.target)) {
    listaCheckBox.classList.remove("hidden");
    botonConfirmarHorario.classList.add("hidden");
    botonDeshabilitar.classList.add("hidden");
    botonEliminar.classList.add("hidden");
    botonAñadir.disabled = true;
  } else if (!listaCheckBox.contains(e.target)) {
    listaCheckBox.classList.add("hidden");
    botonConfirmarHorario.classList.remove("hidden");
    botonAñadir.disabled = false;
  }
}

let valorCheckbox = [];

function obtenerCheckbox(e) {
  if (e.target.classList.contains("checkbox")) {
    console.log("check")
    valorCheckbox.push(e.target.value);

    const nuevoValor = valorCheckbox.map(reemplazarDuplicados);
    console.log(nuevoValor);
    inputDia.value = nuevoValor;
  }

  if (e.target.value === "Select All") {
    check();
    e.target.checked = false;
  }
}
console.log(valorCheckbox);

function reemplazarDuplicados(value, index, self) {
  return self.indexOf(value) === index ? value : "";
}

function insertarFilaBotones() {
  const fecha = new Date();
  const dias = ["L", "M", "X", "J", "V", "S", "D"];

  const filaBoton = tabla.insertRow();

  dias.forEach((item) => {
    filaBoton.classList.add("botones-horario");

    const celda = filaBoton.insertCell();
    const boton = document.createElement("button");
    boton.classList.add("boton-horario");
    boton.textContent = item;
    celda.appendChild(boton);

    if (boton.textContent == dias[fecha.getDay() - 1]) {
      boton.classList.add("boton-horario-selecionado");
    } 

    boton.addEventListener("click", function (e) {
      formulario.classList.remove("hidden");
      tabla.classList.add("hidden");
      botonEliminar.classList.remove("hidden");
      botonDeshabilitar.classList.remove("hidden");
      botonesFormulario.classList.add("reverse");
      cambiarIcono(botonAñadir, "add", "close");
      
    });

    filaBoton.classList.add("borde");
  });
}

function check() {
  document
    .querySelectorAll(".checkbox")
    .forEach((checkbox) => (checkbox.checked = true));
}

function uncheck() {
  document
    .querySelectorAll(".checkbox")
    .forEach((checkbox) => (checkbox.checked = false));
}

function eliminarHorario(e) {
  e.preventDefault();
  tabla.deleteRow(-1);
  tabla.deleteRow(-1);
  tabla.classList.remove("hidden");
  formulario.classList.add("hidden");
  cambiarIcono(botonAñadir, "add", "close");

  if (tabla.rows.length === 3) {
    cabeceraHorario.classList.add("hidden");
    parrafoHorario.classList.remove("hidden");

    console.log(tabla.rows.length);
  }

  datos.id = datos.id - 1;
}

function cambiarIcono(boton, iconoUno, iconoDos) {
  const span = boton.childNodes[0];
  span.classList.toggle(iconoUno);
  if (span.classList.contains(iconoUno)) {
    span.innerHTML = iconoDos;
  } else {
    span.innerHTML = iconoUno;
  }
}
