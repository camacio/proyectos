//botones
const addButton = document.querySelector(".boton-añadir");
const enableButton = document.querySelector(".boton-habilitar");
const confirmScheduleButton = document.querySelector(".confirmar-horario");
const deleteButton = document.querySelector(".eliminar");
const disableButton = document.querySelector(".deshabilitar-horario");
const formButtons = document.querySelector(".botones-formulario");

const table = document.querySelector(".tabla");
const form = document.querySelector(".formulario");
const scheduleHeader = document.querySelector(".cabecera-horario");
const rowTimeButton = document.querySelector(".botones-horario");
const scheduleParagraph = document.querySelector(".parrafo-horario");
const widget = document.querySelector(".widget");

//inputs
const checkBoxList = document.querySelector(".lista-checkbox");
const inputDay = document.querySelector("#input-dia");
const checkboxes = document.querySelectorAll(".checkbox");
const startTimeInput = document.querySelector("#hora-inicio");
const endTimeInput = document.querySelector("#hora-fin");

let CONDITIONAL_SCHEDULE = true;
const CURRENT_DATE = new Date();
const DAYS_OF_THE_WEEK = ["L", "M", "X", "J", "V", "S", "D"];
const CURRENT_DAY = DAYS_OF_THE_WEEK[CURRENT_DATE.getDay() - 1];

const timers = [];

const timer = {
  id: 0,
  starttime: "",
  endtime: "",
  duration: 0,
  days: [false, false, false, false, false, false, false],
};

//listeners


addButton.addEventListener("click", addSchedule);

enableButton.addEventListener("click", toggleSchedule);

confirmScheduleButton.addEventListener("click", conditionalSchedule);

widget.addEventListener("click", showCheckboxList);

deleteButton.addEventListener("click", deleteSchedule);

disableButton.addEventListener("click", toggleSchedule);

checkBoxList.addEventListener("click", setDays);

//funciones

//función botón añadir

function addSchedule() {
  form.classList.toggle("hidden");
  scheduleParagraph.classList.add("hidden");
  setHourInput();
  changeIcon(this, "add", "close");

  enableButton.classList.toggle("hidden");

  inputDay.value = CURRENT_DAY;

  formButtons.classList.remove("reverse");

}

//función botón habilitar horario

function toggleSchedule(e) {
  e.preventDefault();

  changeIcon(this, "alarm", "alarm_off");
  if (this.childNodes[0].innerHTML == "alarm_off") {
    console.log("horario deshabilitado");
  }
}

//función botón confirmar horario

function confirmSchedule() {

  timer.id = timer.id + 1;

  calculateSchedule();

  enableButton.classList.toggle("hidden");

  changeIcon(addButton, "add", "close");

  const timerCodificado = JSON.stringify(timer);
  const timerDescodificado = JSON.parse(timerCodificado);
  timers.push(timerDescodificado);

  localStorage.setItem("timers", JSON.stringify(timers));

  addButton.value = "enable"

  console.log("confirmar horario");

  reset();

}

function conditionalSchedule(e){
  e.preventDefault();

  (CONDITIONAL_SCHEDULE) ? confirmSchedule() : editSchedule();

}

function editSchedule(){
  form.classList.add("hidden");
  table.classList.remove("hidden");
  console.log("editar horario");

}

function reset(){
  const header = ["#","Inicio","Fin","Duración"];

  table.innerHTML = "";
  table.classList.toggle("hidden");
  form.classList.toggle("hidden");

  const row = table.insertRow();
  row.classList.add("cabecera-horario");

  header.forEach(function(item){
    const cell = row.insertCell();
    cell.textContent = item;
    row.appendChild(cell);
  })
  
  for(let i = 0; i < timers.length; i++){
    insertDataRow(i);
    insertRowButtons(i);
  }
}

//funciones calculario horario

function calculateSchedule() {

  const startTime = startTimeInput.value;

  const newStartTime = new Date(
    CURRENT_DATE.toString().split(":")[0].slice(0, -2) + startTime
  );

  timer.starttime = newStartTime.getTime();

  const endTime = endTimeInput.value;

  const newEndTime = new Date(
    CURRENT_DATE.toString().split(":")[0].slice(0, -2) + endTime
  );

  timer.endtime = newEndTime.getTime();

  setHourInterval(timer);

  const duration = timer.endtime - timer.starttime;

  const newDate = new Date(duration);

  const minutes = newDate.getMinutes();
  const hours = newDate.getHours() - 1;

  timer.duration = `${newDate.getMinutes()}min`;

  if (hours > 0) {
    timer.duration = `${hours}h ${minutes}m`;
    console.log("mas de 24 h");
  }

  if(hours == -1){
    timer.duration = `23h ${minutes}m`;
  }
}

function setHourInterval(timer){
  if (timer.starttime > timer.endtime) {
    if (
      confirm("La franja horaria sobrepasa la medianoche. ¿Desea continuar?")
    ) {
      console.log("confirmado");
    } else {
      console.log("rechazado");
    }
  }
}

function setHourInput() {
  let hour = CURRENT_DATE.getHours();
  let minutes = CURRENT_DATE.getMinutes();

  if (hour < 10) {
    hour = `0${hour}`;
  }

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  const fullStartTime = hour + ":" + minutes;
  startTimeInput.value = fullStartTime;

  let fullEndTime = "";

  if (minutes > 5 && minutes < 10) {
    fullEndTime = `${hour}:${parseInt(minutes) + 5}`;

    console.log("minutos > 5")
  } else if (minutes < 5) {
    fullEndTime = `${hour}:0${parseInt(minutes) + 5}`;

    console.log("minutos < 5")

  } else if (minutes + 5 >= 60){
    fullEndTime = `${parseInt(hour) + 1}:0${parseInt(minutes) + 5 -60}`
  } else {
    fullEndTime = `${hour}:${parseInt(minutes) + 5}`;
    console.log("minutos 10- 60");
  }

  endTimeInput.value = fullEndTime;
}

const valorCheckbox = [];

function setDays(e) {
  if (e.target.classList.contains("checkbox")) {

    valorCheckbox.push(e.target.value);
    const valorCheckSet = [...new Set(valorCheckbox)];
    inputDay.value = valorCheckSet;

    const checkValue = e.target.value;

    const index = DAYS_OF_THE_WEEK.indexOf(checkValue);

    timer.days[index] = true;

    if (checkValue === "Select All") {
      timer.days.fill(true, 0, 7);
    }

    console.log(timer);
  }
}

//funciones para crear fila de botones

function insertRowButtons(i) {

  const rowButtons = table.insertRow();

  const {days} = timers[i];


  for(const [i, item] of DAYS_OF_THE_WEEK.entries()){
    rowButtons.classList.add("botones-horario");

    const cell = rowButtons.insertCell();
    const button = document.createElement("button");
    button.classList.add("boton-horario");
    button.textContent = item;

    cell.appendChild(button);

    if (days[i] == false) {
      button.classList.add("boton-horario-desmarcado");
    }

    if(item == CURRENT_DAY){
      days[i] = true;
      button.classList.remove("boton-horario-desmarcado");
    }

    button.addEventListener("click", function () {
      form.classList.remove("hidden");
      table.classList.add("hidden");
      enableButton.classList.toggle("hidden");
      deleteButton.classList.remove("hidden");
      disableButton.classList.remove("hidden");
      formButtons.classList.add("reverse");
      changeIcon(addButton, "add", "close");

      CONDITIONAL_SCHEDULE = false
      
    });

    rowButtons.classList.add("borde");

  }
}

function insertDataRow(i) {
  const row = table.insertRow();
  row.classList.add("cabecera-datos");

  const { days, ...timerRow } = timers[i];

  for (const data in timerRow) {
    const cell = row.insertCell();

    if (timerRow[data] == timers[i].starttime) {
      setTime(timers[i].starttime, cell);
    } else if (timerRow[data] == timers[i].endtime) {
      setTime(timers[i].endtime, cell);
    } else {
      cell.textContent = timerRow[data];
    }
  }
}

function setTime(timer, cell){
  const date = new Date(timer);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  cell.textContent = `${hours}:${minutes}`;
}

//funciones lista checkbox

function showCheckboxList(e) {
  if (inputDay.contains(e.target)) {
    checkBoxList.classList.remove("hidden");
    confirmScheduleButton.classList.add("hidden");
    disableButton.classList.add("hidden");
    deleteButton.classList.add("hidden");
    addButton.disabled = true;
  } else if (!checkBoxList.contains(e.target)) {
    checkBoxList.classList.add("hidden");
    confirmScheduleButton.classList.remove("hidden");
    addButton.disabled = false;
  }
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

//funcion para modificar horario

/* function editSchedule(e) {
  e.preventDefault();
  console.log("añadir desde formulario");
  table.classList.remove("hidden");
  form.classList.add("hidden");
  table.deleteRow(-1);
  table.deleteRow(-1);


  changeIcon(addButton, "add", "close");
} */

//función botón eliminar horario

function deleteSchedule(e) {
  e.preventDefault();

  table.deleteRow(-1);
  table.deleteRow(-1);
  table.classList.remove("hidden");
  form.classList.add("hidden");
  changeIcon(addButton, "add", "close");

  if (table.rows.length === 1) {
    table.innerHTML = "";
    scheduleParagraph.classList.remove("hidden");
  }

  timers.pop();
  timer.id = timer.id - 1;

  enableButton.classList.toggle("hidden");
}

//función para cambiar icono

function changeIcon(button, iconOne, iconTwo) {
  const span = button.childNodes[0];
  span.classList.toggle(iconOne);
  if (span.classList.contains(iconOne)) {
    span.innerHTML = iconTwo;
  } else {
    span.innerHTML = iconOne;
  }
}
