const partesDelCoche = ["ruedas", "puerta", "volante", "yantas", "ruedas", "asiento", "motor"];

const coche = partesDelCoche.reduce(function(anterior, actual){
    return `${anterior} ${actual}`
}, "Mi coche tiene: "); 

console.log(coche);