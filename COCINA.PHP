<?php include 'conexion.php'; ?>

<!DOCTYPE html>
<html lang="es">

<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Cocina</title>

<script src="https://cdn.tailwindcss.com"></script>

<link rel="stylesheet" href="assets/style.css">

</head>

<body>

<div class="p-6">

<h1 class="text-5xl font-black text-red-500 mb-10">
PANEL DE COCINA
</h1>

<div id="orders"
class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

</div>

</div>

<script>

function loadOrders(){

fetch('obtener_pedidos.php')
.then(res=>res.json())
.then(data=>{

const container = document.getElementById('orders');

container.innerHTML='';

data.forEach(order=>{

let products = JSON.parse(order.productos);

container.innerHTML += `

<div class="bg-zinc-800 rounded-3xl p-5">

<div class="flex justify-between mb-4">

<h2 class="text-2xl font-bold">
Mesa #${order.mesa}
</h2>

<span class="bg-yellow-500 text-black px-3 py-1 rounded-xl">
${order.estado}
</span>

</div>

${products.map(item=>`

<div class="bg-zinc-700 p-3 rounded-xl mb-3">

<p class="font-bold">
${item.name}
</p>

<p>
$${item.price}
</p>

</div>

`).join('')}

<div class="flex gap-2 mt-4">

<button
onclick="updateStatus(${order.id},'Preparando')"
class="flex-1 bg-yellow-500 text-black py-2 rounded-xl">

Preparando

</button>

<button
onclick="updateStatus(${order.id},'Listo')"
class="flex-1 bg-green-600 py-2 rounded-xl">

Listo

</button>

</div>

</div>

`;

});

});

}

function updateStatus(id,status){

fetch('actualizar_estado.php',{

method:'POST',

headers:{
'Content-Type':'application/json'
},

body:JSON.stringify({
id,
status
})

})
.then(()=>{

loadOrders();

});

}

setInterval(loadOrders,2000);

loadOrders();

</script>

</body>
</html>