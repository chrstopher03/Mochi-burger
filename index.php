<?php include 'conexion.php'; ?>
<!DOCTYPE html>
<html lang="es">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Burger</title>

<script src="https://cdn.tailwindcss.com"></script>

<link rel="stylesheet" href="assets/style.css">

</head>

<body>

<div class="min-h-screen p-6">

<div class="max-w-7xl mx-auto mb-10 flex justify-between items-center">

<div>
<h1 class="text-5xl font-black text-yellow-400">
BURGER
</h1>

<p class="text-zinc-400">
Restaurante • Pizzas • Hamburguesas
</p>
</div>

<div>
<select id="tableNumber"
class="bg-zinc-800 border border-zinc-700 px-5 py-3 rounded-2xl">

<option value="1">Mesa #1</option>
<option value="2">Mesa #2</option>
<option value="3">Mesa #3</option>
<option value="4">Mesa #4</option>

</select>
</div>

</div>

<div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

<div class="lg:col-span-2 glass rounded-3xl p-6">

<h2 class="text-3xl font-bold text-yellow-400 mb-6">
Menú Digital
</h2>

<div id="products"
class="grid grid-cols-1 md:grid-cols-2 gap-5"></div>

</div>

<div class="glass rounded-3xl p-6">

<h2 class="text-3xl font-bold text-green-400 mb-6">
Tu Pedido
</h2>

<div id="cart"></div>

<div class="mt-6 border-t border-zinc-700 pt-5">

<div class="flex justify-between text-2xl font-bold mb-5">

<span>Total</span>

<span id="total">$0</span>

</div>

<button onclick="sendOrder()"
class="w-full bg-green-600 py-4 rounded-2xl text-xl font-bold">

Pedir a esta Mesa

</button>

</div>

</div>

</div>

</div>

<script>

const products = [

{
id:1,
name:'Classic Burger',
price:8,
image:'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop'
},

{
id:2,
name:'Pizza Pepperoni',
price:15,
image:'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop'
},

{
id:3,
name:'French Fries',
price:4,
image:'https://images.unsplash.com/photo-1576107232684-1279f390859f?q=80&w=1200&auto=format&fit=crop'
}

];

let cart = [];

const productsContainer = document.getElementById('products');
const cartContainer = document.getElementById('cart');
const totalContainer = document.getElementById('total');

function renderProducts(){

productsContainer.innerHTML='';

products.forEach(product=>{

productsContainer.innerHTML += `

<div class="bg-zinc-800 rounded-3xl overflow-hidden">

<img src="${product.image}"
class="w-full h-52 object-cover">

<div class="p-5">

<div class="flex justify-between">

<h2 class="text-2xl font-bold">
${product.name}
</h2>

<span class="text-yellow-400 font-bold">
$${product.price}
</span>

</div>

<button
onclick="addToCart(${product.id})"
class="mt-5 w-full bg-red-600 py-3 rounded-2xl font-bold">

Agregar

</button>

</div>

</div>

`;

});

}

function addToCart(id){

const product = products.find(p=>p.id===id);

cart.push({
...product,
quantity:1
});

renderCart();

}

function renderCart(){

cartContainer.innerHTML='';

let total = 0;

cart.forEach((item,index)=>{

total += item.price * item.quantity;

cartContainer.innerHTML += `

<div class="bg-zinc-800 p-4 rounded-2xl mb-4">

<div class="flex justify-between">

<div>

<h3 class="font-bold">
${item.name}
</h3>

<p class="text-yellow-400">
$${item.price}
</p>

</div>

<button
onclick="removeItem(${index})"
class="bg-red-600 px-3 rounded-lg">

X

</button>

</div>

</div>

`;

});

totalContainer.textContent = '$'+total;

}

function removeItem(index){

cart.splice(index,1);

renderCart();

}

function sendOrder(){

if(cart.length===0){

alert('Agrega productos');

return;

}

const mesa = document.getElementById('tableNumber').value;

let total = 0;

cart.forEach(item=>{
total += item.price * item.quantity;
});

fetch('guardar_pedido.php',{

method:'POST',

headers:{
'Content-Type':'application/json'
},

body:JSON.stringify({
mesa,
productos:cart,
total
})

})
.then(res=>res.text())
.then(data=>{

alert('Pedido enviado');

cart=[];

renderCart();

});

}

renderProducts();
renderCart();

</script>

</body>
</html>