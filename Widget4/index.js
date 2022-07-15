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

enableButton.addEventListener("click", function () {
  changeIcon(this, "alarm", "alarm_off");
});

confirmScheduleButton.addEventListener("click", confirmSchedule);

widget.addEventListener("click", showCheckboxList);

deleteButton.addEventListener("click", deleteSchedule);

disableButton.addEventListener("click", function (e) {
  e.preventDefault();

  changeIcon(this, "alarm", "alarm_off");
});

checkBoxList.addEventListener("click", setDays);

//funciones

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

  timers.push(timer);

  localStorage.setItem("timers", JSON.stringify(timers));

  console.log(timers);
}

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

  if (minutes < 10) {
    fullEndTime = `${hour}:0${parseInt(minutes) + 5}`;

    console.log("minutos 0 -10");
  } else if (minutes > 60) {
    fullEndTime = `0${parseInt(hour) + 1}:0${parseInt(minutes) + 5 - 60}`;
    
    console.log("minutos 60 - 65");
  } else {
    fullEndTime = `${hour}:${parseInt(minutes) + 5}`;
    console.log("minutos 10- 50");
  }

  endTimeInput.value = fullEndTime;

}

const valorCheckbox = [];

function setDays(e, buttons){
  if(e.target.classList.contains("checkbox")){
    console.log("check");

    valorCheckbox.push(e.target.value);
    valorCheckSet = [...new Set(valorCheckbox)];
    inputDay.value = valorCheckSet;

    checkValue = e.target.value;

    switch(checkValue){
      case "L":
        timer.days[0] = 1;
        buttons[0].id = 1;
        break;
      case "M":
        timer.days[1] = 1;
        buttons[1].id = 1;
        break;
      case "X":
        timer.days[2] = 1;
        buttons[2].id = 1;
        break;
      case "J":
        timer.days[3] = 1;
        buttons[3].id = 1;
        break;
      case "V":
        timer.days[4] = 1;
        buttons[4].id = 1;
        break;
      case "S":
        timer.days[5] = 1;
        buttons[5].id = 1;
        break;
      case "D":
        timer.days[6] = 1;
        buttons[6].id = 1;
        break;
      case "Select All":
        timer.days.fill(1,0,7);
        buttons.id = 1;
        break;              
    }

    console.log(valorCheckSet);
    console.log(timer);

  }
}

const days = ["L", "M", "X", "J", "V", "S", "D"];

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
      /* if (!formulario.classList.contains("hidden")) {
        botonConfirmarHorario.removeEventListener("click", confirmarHorario);
        botonConfirmarHorario.addEventListener("click", editarHorario);
      } */

    });

    rowButtons.classList.add("borde");
  });
}

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

let checkboxValue = [0, 0, 0, 0, 0, 0, 0];

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

function changeIcon(button, iconOne, iconTwo) {
  const span = button.childNodes[0];
  span.classList.toggle(iconOne);
  if (span.classList.contains(iconOne)) {
    span.innerHTML = iconTwo;
  } else {
    span.innerHTML = iconOne;
  }
}
