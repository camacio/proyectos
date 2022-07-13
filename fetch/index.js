const key = "1cd28ab1dd944419b4291322221207";
const country = "*";
const url = `http://api.weatherapi.com/v1/current.json?key=${key}&q=${country}&aqi=no`;
const ul = document.querySelector(".lista");

fetch(url).then(res => res.json()).then(function(data){
    const li = document.createElement("li");
    const span = document.createElement("span");
    ul.appendChild(li);
    li.appendChild(span);
    for(const dato in data){
        span.textContent = data[dato];
    }
    
})

