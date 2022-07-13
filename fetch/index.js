const key = "1cd28ab1dd944419b4291322221207";
const country = "London";
const url = `http://api.weatherapi.com/v1/current.json?key=${key}&q=${country}&aqi=no`;
const ul = document.querySelector(".lista");

fetch(url).then(res => res.json()).then(function(data){
    const li = document.createElement("li");
    ul.appendChild(li);
    for(const dato in data){
        console.log(dato);
        const span = document.createElement("span");
        li.appendChild(span);
        span.textContent = dato;
    }
    
})

