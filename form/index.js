const botonEnviar = document.querySelector(".enviar");
const botonReset = document.querySelector(".reset");
const nombre = document.querySelector("#nombre");
const apellido = document.querySelector("#apellido");
const edad = document.querySelector("#edad");
const email = document.querySelector("#email");
const telefono = document.querySelector("#telefono");

botonEnviar.addEventListener("click", function(e){
    e.preventDefault();
    console.log(nombre.value, apellido.value, edad.value, email.value, telefono.value);
})
