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

const timers = [];

const timer = {
  id: 0,
  starttime: "",
  endtime: "",
  duration: 0,
  days: [0,0,0,0,0,0,0]
};

//listeners

addButton.addEventListener("click", addSchedule);

enableButton.addEventListener("click", toggleSchedule);

confirmScheduleButton.addEventListener("click", confirmSchedule);

widget.addEventListener("click", showCheckboxList);

deleteButton.addEventListener("click", deleteSchedule);

disableButton.addEventListener("click", toggleSchedule);

checkBoxList.addEventListener("click", setDays);

//funciones

//función botón añadir

function addSchedule(){
  form.classList.toggle("hidden");
  scheduleParagraph.classList.add("hidden");
  setHourInput();
  changeIcon(this, "add", "close");

  if (!table.classList.contains("hidden")) {
    table.classList.add("hidden");
  }

  if (form.classList.contains("hidden")) {
    table.classList.remove("hidden");
  }

  checkboxValue = [];
  inputDay.value = "";
  enableButton.classList.toggle("hidden");

  inputDay.value = calculateCurrentDay();

  deleteButton.classList.add("hidden");
  disableButton.classList.add("hidden");
  formButtons.classList.remove("reverse");

  console.log(checkboxes);
}

//función botón habilitar horario

function toggleSchedule(e){
  e.preventDefault();

  changeIcon(this, "alarm", "alarm_off");
  if(this.childNodes[0].innerHTML == "alarm_off"){
    console.log("horario deshabilitado");
  }
}

//función botón confirmar horario

function confirmSchedule(e) {
  e.preventDefault();

  table.classList.toggle("hidden");
  form.classList.add("hidden");

  calculateSchedule();

  insertDataRow();

  insertRowButtons();

  enableButton.classList.toggle("hidden");

  changeIcon(addButton, "add", "close");

  if (table.rows.length === 3) {
    scheduleHeader.classList.remove("hidden");
  }

  deleteButton.classList.add("hidden");
  disableButton.classList.add("hidden");

  if(table.rows.length > 3 ){
    console.log("modificar horario");
    
  }

  timers.push(timer);

  localStorage.setItem("timers", JSON.stringify(timers));

  console.log(timers);
}

//funciones calculario horario

function calculateCurrentDay() {
  const date = new Date();

  const days = ["D", "L", "M", "X", "J", "V", "S"];

  return days[date.getDay()];
}

function calculateSchedule() {
  timer.id = timer.id + 1;

  const date = new Date();
  const startTime = startTimeInput.value;

  const newStartTime = new Date(
    date.toString().split(":")[0].slice(0, -2) + startTime
  );

  timer.starttime = newStartTime.getTime();

  const endTime = endTimeInput.value;

  const newEndTime = new Date(
    date.toString().split(":")[0].slice(0, -2) + endTime
  );

  timer.endtime = newEndTime.getTime();

  if(timer.starttime > timer.endtime){
    if(confirm("La franja horaria sobrepasa la medianoche. ¿Desea continuar?")){
      console.log("confirmado");
    }else{
      console.log("rechazado");
    }
    
  }

  const duration = timer.endtime - timer.starttime;
  timer.duration = `${new Date(duration).getMinutes()}min`;

  console.log(timer);
}

function setHourInput() {
  let hour = new Date().getHours();
  let minutes = new Date().getMinutes();

  if (hour < 10) {
    hour = `0${hour}`;
  }

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  const fullStartTime = hour + ":" + minutes;
  startTimeInput.value = fullStartTime;

  let fullEndTime = "";

  if(minutes >=5){
    fullEndTime = `${hour}:${parseInt(minutes) + 5}`
  } else if (minutes < 5) {
    fullEndTime = `${hour}:0${parseInt(minutes) + 5}`;

    console.log("minutos 0 -10");
  }else if (minutes > 55) {
    fullEndTime = `${parseInt(hour) + 1}:0${parseInt(minutes) + 5 - 60}`;
    
    console.log("minutos 60 - 65");
  } else {
    fullEndTime = `${hour}:${parseInt(minutes) + 5}`;
    console.log("minutos 10- 60");
  }

  endTimeInput.value = fullEndTime;

}

const days = ["L", "M", "X", "J", "V", "S", "D"];
const valorCheckbox = [];

function setDays(e){
  if(e.target.classList.contains("checkbox")){
    console.log("check");

    valorCheckbox.push(e.target.value);
    valorCheckSet = [...new Set(valorCheckbox)];
    inputDay.value = valorCheckSet;

    checkValue = e.target.value;

    const index = days.indexOf(checkValue)

    timer.days[index] = 1;

    if(checkValue === "Select All"){
      timer.days.fill(1,0,7);
    }

    console.log(timer);

  }
}

//funciones para crear fila de botones

function insertRowButtons() {
  const date = new Date();

  const rowButtons = table.insertRow();

  days.forEach((item) => {
    rowButtons.classList.add("botones-horario");

    const cell = rowButtons.insertCell();
    const button = document.createElement("button");
    button.classList.add("boton-horario");
    button.textContent = item; 
    button.id = 0;
    console.log(button.id);
    cell.appendChild(button);

    if (button.textContent == days[date.getDay() - 1]) {
      button.classList.add("boton-horario-selecionado");
    }

    button.addEventListener("click", function () {
      form.classList.remove("hidden");
      table.classList.add("hidden");
      deleteButton.classList.remove("hidden");
      disableButton.classList.remove("hidden");
      formButtons.classList.add("reverse");
      changeIcon(addButton, "add", "close");

/* 
      if (!form.classList.contains("hidden")) {
        confirmScheduleButton.removeEventListener("click", confirmSchedule);
        confirmScheduleButton.addEventListener("click", editSchedule);
      } 
       */

    });

    rowButtons.classList.add("borde");
  });
}

function insertDataRow() {
  const row = table.insertRow();
  row.classList.add("cabecera-datos");

  const {days, ...timerRow} = timer;

  for (const data in timerRow) {
    const cell = row.insertCell();
    
    if (timerRow[data] == timer.starttime) {
      cell.textContent = startTimeInput.value;
    } else if (timerRow[data] == timer.endtime) {
      cell.textContent = endTimeInput.value;
    } else {
      cell.textContent = timerRow[data];
    }
  }
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

function editSchedule(e) {
  e.preventDefault();
  console.log("añadir desde formulario");
  table.classList.remove("hidden");
  form.classList.add("hidden");
  table.deleteRow(-1);
  table.deleteRow(-1);
  insertDataRow();
  insertRowButtons();

  changeIcon(addButton, "add", "close");
}

//función botón eliminar horario

function deleteSchedule(e) {
  e.preventDefault();

  table.deleteRow(-1);
  table.deleteRow(-1);
  table.classList.remove("hidden");
  form.classList.add("hidden");
  changeIcon(addButton, "add", "close");

  if (table.rows.length === 1) {
    scheduleHeader.classList.add("hidden");
    scheduleParagraph.classList.remove("hidden");

    console.log(table.rows.length);
  }

  timer.id = timer.id - 1;
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
