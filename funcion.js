
const products = [

{
  id: 1,
  name: 'Classic Burger',
  description: 'Carne 100% res, queso cheddar y salsa especial.',
  price: 8,
  category: 'burger',
  popular: true,
  image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop',
  removable: ['Cebolla', 'Tomate', 'Queso'],
  extras: [
    { name: 'Extra Queso', price: 1 },
    { name: 'Tocino', price: 2 }
  ]
},

{
  id: 2,
  name: 'Double Smash',
  description: 'Doble carne smash con queso premium.',
  price: 12,
  category: 'burger',
  popular: true,
  image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200&auto=format&fit=crop',
  removable: ['Tomate'],
  extras: [
    { name: 'Extra Carne', price: 3 }
  ]
},

{
  id: 3,
  name: 'Doner',
  description: 'Doner especial con salsa premium.',
  price: 15,
  category: 'pizza',
  popular: true,
  image: '4.jpeg',
  removable: ['Salsa'],
  extras: [
    { name: 'Salsa Picante', price: 2 }
  ]
},

{
  id: 4,
  name: 'Alitas',
  description: 'Alitas bañadas en salsa especial.',
  price: 18,
  category: 'pizza',
  image: '5.jpeg',
  removable: ['Salsa'],
  extras: [
    { name: 'BBQ', price: 2 },
    { name: 'Mango Habanero', price: 2 },
    { name: 'Ranch', price: 2 },
    { name: 'Mostaza y Miel', price: 2 }
  ]
},

{
  id: 5,
  name: 'Sandwich de Pescado',
  description: 'Sandwich premium de pescado.',
  price: 4,
  category: 'fries',
  image: '6.jpeg',
  removable: [],
  extras: []
},

{
  id: 6,
  name: 'Sandwich de Pollo',
  description: 'Sandwich crispy de pollo.',
  price: 3,
  category: 'drink',
  image: '7.jpeg',
  removable: [],
  extras: [
    { name: 'Salsa Picante', price: 5 },
    { name: 'Salsa Casera', price: 5 }
  ]
}

];

let filteredProducts = [...products];
let cart = [];
let discount = 0;
let selectedProduct = null;

const productsContainer = document.getElementById('products');
const cartContainer = document.getElementById('cart');
const totalContainer = document.getElementById('total');

/* =========================
ALERTAS
========================= */

function showAlert(message, type = 'success') {

  Swal.fire({

    toast: true,
    position: 'top-end',
    icon: type,
    title: message,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: '#18181b',
    color: '#fff'

  });

}

/* =========================
RENDER PRODUCTS
========================= */

function renderProducts() {

  productsContainer.innerHTML = '';

  filteredProducts.forEach(product => {

    productsContainer.innerHTML += `

    <div class="bg-zinc-900 rounded-3xl overflow-hidden product-card relative fade-up border border-zinc-800 hover:border-orange-500/40 transition-all duration-500 hover:-translate-y-2">

      ${product.popular ? `
        <div class="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-orange-500 px-4 py-2 rounded-2xl font-black z-10 shadow-xl badge-popular">
          🔥 Popular
        </div>
      ` : ''}

      <button
        onclick="toggleFavorite(${product.id})"
        class="absolute top-4 right-4 bg-black/50 hover:bg-red-500 transition-all w-12 h-12 rounded-2xl text-2xl z-10 backdrop-blur-md">
        ❤️
      </button>

      <div class="overflow-hidden">

        <img 
          src="${product.image}" 
          alt="${product.name}"
          class="w-full h-64 object-cover hover:scale-110 transition-all duration-700">

      </div>

      <div class="p-5 relative z-10">

        <div class="flex justify-between items-center gap-3">

          <h2 class="text-2xl font-black">
            ${product.name}
          </h2>

          <span class="text-yellow-400 text-3xl font-black">
            C$${product.price}
          </span>

        </div>

        <p class="text-zinc-400 mt-3 text-sm">
          ${product.description}
        </p>

        <div class="flex items-center gap-2 mt-3">
          ⭐⭐⭐⭐⭐
          <span class="text-zinc-400 text-sm">
            (4.9)
          </span>
        </div>

        <button
          onclick="addToCart(${product.id})"
          class="mt-5 w-full btn-primary py-4 rounded-2xl font-black text-lg hover:scale-[1.03] transition-all">
          🍔 Escoger Plato
        </button>

      </div>

    </div>

    `;

  });

}

/* =========================
MODAL
========================= */

function addToCart(id) {

  selectedProduct =
    products.find(product => product.id === id);

  document.getElementById('customizeTitle').textContent =
    selectedProduct.name;

  const removeOptions =
    document.getElementById('removeOptions');

  const extraOptions =
    document.getElementById('extraOptions');

  removeOptions.innerHTML = '';
  extraOptions.innerHTML = '';

  if (selectedProduct.removable.length === 0) {

    removeOptions.innerHTML = `
      <p class="text-zinc-400">
        No hay ingredientes para quitar
      </p>
    `;

  }

  selectedProduct.removable.forEach(item => {

    removeOptions.innerHTML += `
    
      <label class="flex items-center gap-3 bg-zinc-900 p-3 rounded-xl hover:bg-zinc-700 transition-all">

        <input
          type="checkbox"
          value="${item}"
          class="remove-item accent-red-500 w-5 h-5"
        >

        <span>
          Sin ${item}
        </span>

      </label>
    
    `;

  });

  if(selectedProduct.extras.length === 0){

    extraOptions.innerHTML = `
      <p class="text-zinc-400">
        No hay extras disponibles
      </p>
    `;

  }

  selectedProduct.extras.forEach(extra => {

    extraOptions.innerHTML += `
    
      <label class="flex items-center gap-3 bg-zinc-900 p-3 rounded-xl hover:bg-zinc-700 transition-all">

        <input
          type="checkbox"
          value="${extra.name}"
          data-price="${extra.price}"
          class="extra-item accent-green-500 w-5 h-5"
        >

        <span>
          ${extra.name} (+C$${extra.price})
        </span>

      </label>
    
    `;

  });

  document
    .getElementById('customizeModal')
    .classList.remove('hidden');

  document
    .getElementById('customizeModal')
    .classList.add('flex');

}

function confirmCustomize() {

  const removed = [
    ...document.querySelectorAll('.remove-item:checked')
  ].map(el => el.value);

  const extras = [
    ...document.querySelectorAll('.extra-item:checked')
  ].map(el => ({
    name: el.value,
    price: Number(el.dataset.price)
  }));

  const extraPrice =
    extras.reduce((acc, item) => acc + item.price, 0);

  const existingProduct = cart.find(item =>
    item.id === selectedProduct.id &&
    JSON.stringify(item.removed) === JSON.stringify(removed) &&
    JSON.stringify(item.extras) === JSON.stringify(extras)
  );

  if(existingProduct){

    existingProduct.quantity++;

  } else {

    cart.push({
      ...selectedProduct,
      quantity: 1,
      removed,
      extras,
      finalPrice: selectedProduct.price + extraPrice
    });

  }

  renderCart();

  closeCustomizeModal();

  showAlert(`${selectedProduct.name} agregado al carrito`);

}

function closeCustomizeModal() {

  document
    .getElementById('customizeModal')
    .classList.add('hidden');

  document
    .getElementById('customizeModal')
    .classList.remove('flex');

}

/* =========================
CART
========================= */

function renderCart() {

  cartContainer.innerHTML = '';

  let total = 0;

  if (cart.length === 0) {

    cartContainer.innerHTML = `
      <div class="text-center text-zinc-500 py-10">
        🛒 No hay productos agregados
      </div>
    `;

    totalContainer.textContent = 'C$0';

    updateCartCounter();

    return;

  }

  cart.forEach((item, index) => {

    total += item.finalPrice * item.quantity;

    cartContainer.innerHTML += `
      <div class="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 fade-up">

        <div class="flex justify-between items-center mb-4 gap-3">

          <div>

            <h3 class="font-black text-lg">
              ${item.name}
            </h3>

            <p class="text-yellow-400 font-bold">
              C$${item.finalPrice}
            </p>

            ${
              item.extras.length > 0
              ?
              `<p class="text-green-400 text-sm mt-1">
                + ${item.extras.map(e => e.name).join(', ')}
              </p>`
              : ''
            }

            ${
              item.removed.length > 0
              ?
              `<p class="text-red-400 text-sm mt-1">
                Sin ${item.removed.join(', ')}
              </p>`
              : ''
            }

          </div>

          <img
            src="${item.image}"
            class="w-20 h-20 object-cover rounded-2xl border border-zinc-700">

        </div>

        <div class="flex justify-between items-center">

          <div class="flex items-center gap-2">

            <button
              onclick="decreaseQuantity(${index})"
              class="bg-red-600 w-8 h-8 rounded-lg">
              -
            </button>

            <span class="font-bold text-lg">
              ${item.quantity}
            </span>

            <button
              onclick="increaseQuantity(${index})"
              class="bg-green-600 w-8 h-8 rounded-lg">
              +
            </button>

          </div>

          <button
            onclick="removeItem(${index})"
            class="bg-zinc-700 hover:bg-red-600 transition-all px-4 py-2 rounded-xl">
            Eliminar
          </button>

        </div>

      </div>
    `;

  });

  total -= discount;

  if (total < 0) total = 0;

  totalContainer.textContent = `C$${total}`;

  updateCartCounter();

}

function increaseQuantity(index) {

  cart[index].quantity++;

  renderCart();

}

function decreaseQuantity(index) {

  if (cart[index].quantity > 1) {

    cart[index].quantity--;

  }

  renderCart();

}

function removeItem(index) {

  cart.splice(index, 1);

  renderCart();

  showAlert('Producto eliminado', 'error');

}

/* =========================
ENVIAR PEDIDO
========================= */

/* =========================
ENVIAR PEDIDO
========================= */

function sendOrder() {

  const tableNumber =
    document.getElementById('tableNumber').value || 'Sin mesa';

  if (cart.length === 0) {

    showAlert('Agrega productos primero', 'error');

    return;

  }

  Swal.fire({

    title:'Enviar pedido',

    text:'Tu pedido será enviado a través de nuestro WhatsApp',

    icon:'info',

    background:'#18181b',

    color:'#fff',

    confirmButtonColor:'#22c55e',

    cancelButtonColor:'#ef4444',

    confirmButtonText:'Enviar pedido',

    cancelButtonText:'Cancelar',

    showCancelButton:true

  }).then((result) => {

    if(result.isConfirmed){

      const now = new Date();

      const fecha =
        `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;

      const hora =
        now.toLocaleTimeString('es-NI', {
          hour:'numeric',
          minute:'2-digit',
          second:'2-digit',
          hour12:true
        });

      let message = `PEDIDO MOCHI BURGERS%0A`;

      message += `--------------------------------%0A`;

      message += `Mesa : ${tableNumber}%0A`;

      message += `Fecha: ${fecha}%0A`;

      message += `Hora : ${hora}%0A`;

      message += `--------------------------------%0A`;

      message += `Producto              Cant  Total%0A`;

      message += `--------------------------------%0A`;

      let total = 0;

      cart.forEach(item => {

        const subtotal =
          item.finalPrice * item.quantity;

        total += subtotal;

        // PRODUCTO
        message += `${item.name}  ${item.quantity}  C$${subtotal}%0A`;

        // EXTRAS
        if(item.extras && item.extras.length > 0){

          item.extras.forEach(extra => {

            message += `   + ${extra.name}%0A`;

          });

        }

        // INGREDIENTES QUITADOS
        if(item.removed && item.removed.length > 0){

          item.removed.forEach(remove => {

            message += `   - Sin ${remove}%0A`;

          });

        }

      });

      message += `--------------------------------%0A`;

      if(discount > 0){

        message += `Descuento: -C$${discount}%0A`;

      }

      message += `TOTAL: C$${total - discount}%0A`;

      message += `--------------------------------%0A%0A`;

      message += `Quiero coordinar entrega`;

      const phone = '50582337242';

      window.open(
        `https://wa.me/${phone}?text=${message}`,
        '_blank'
      );

      document
        .getElementById('successSound')
        .play();

      showAlert(
        `Pedido enviado Mesa #${tableNumber}`,
        'success'
      );

      cart = [];

      discount = 0;

      renderCart();

    }

  });

}

/* =========================
COUNTER
========================= */

function updateCartCounter() {

  const counter =
    document.getElementById('cartCounter');

  if (!counter) return;

  const totalItems =
    cart.reduce((acc, item) => acc + item.quantity, 0);

  counter.textContent = totalItems;

}

/* =========================
FILTER
========================= */

function filterCategory(category) {

  if (category === 'all') {

    filteredProducts = [...products];

  } else {

    filteredProducts = products.filter(
      product => product.category === category
    );

  }

  renderProducts();

}

document
  .getElementById('searchInput')
  .addEventListener('input', function (e) {

    const value = e.target.value.toLowerCase();

    filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(value)
    );

    renderProducts();

  });

/* =========================
FAVORITOS
========================= */

function toggleFavorite(id) {

  showAlert('Producto agregado a favoritos ❤️');

}

/* =========================
CUPON
========================= */

function applyCoupon() {

  const coupon =
    document.getElementById('coupon').value;

  if (coupon === 'BURGER10') {

    discount = 2;

    renderCart();

    showAlert('Cupón aplicado correctamente 🔥');

  } else {

    showAlert('Cupón inválido', 'error');

  }

}

/* =========================
SCROLL CART
========================= */

function scrollToCart() {

  document
    .getElementById('cartSection')
    .scrollIntoView({
      behavior:'smooth'
    });

}

/* =========================
MOBILE MENU
========================= */

document
  .getElementById('mobileMenuBtn')
  .addEventListener('click', () => {

    document
      .getElementById('mobileMenu')
      .classList.toggle('hidden');

  });

/* =========================
INIT
========================= */

renderProducts();
renderCart();

/* =========================
LOADER CINEMATIC
========================= */

window.addEventListener("load", () => {

  const loader = document.getElementById("loaderScreen");
  const loaderBar = document.getElementById("loaderBar");

  let width = 0;

  const interval = setInterval(() => {

    width += 5;

    loaderBar.style.width = width + "%";

    if(width >= 100){

      clearInterval(interval);

      setTimeout(() => {

        loader.style.opacity = "0";
        loader.style.transition = "all .8s ease";

        setTimeout(() => {

          loader.remove();

        }, 800);

      }, 500);

    }

  }, 80);

});
/* =========================
PWA INSTALL APP
========================= */

let deferredPrompt;

const installBtn = document.getElementById("installBtn");

/* DETECT INSTALL */

window.addEventListener("beforeinstallprompt", (e) => {

  e.preventDefault();

  deferredPrompt = e;

  console.log("PWA disponible");

});

/* INSTALL BUTTON */

installBtn.addEventListener("click", async () => {

  /* SI EXISTE INSTALL NATIVO */

  if(deferredPrompt){

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    console.log(outcome);

    if(outcome === "accepted"){

      Swal.fire({

        icon: "success",
        title: "Aplicación instalada",
        text: "Mochi Burgers instalada correctamente"

      });

    }

  }

  /* SI NO EXISTE */

  else {

    Swal.fire({

      icon: "info",

      title: "Instalar App",

      html: `

      <div style="font-size:16px">

      En Chrome Android:<br><br>

      <b>1.</b> Presiona los <b>3 puntos ⋮</b><br><br>

      <b>2.</b> Presiona:<br><br>

      <b>"Agregar a pantalla principal"</b>

      </div>

      `

    });

  }

});

/* REGISTER SERVICE WORKER */

if("serviceWorker" in navigator){

  window.addEventListener("load", () => {

    navigator.serviceWorker.register("./service-worker.js")
    .then(() => {

      console.log("Service Worker registrado");

    })

    .catch(error => {

      console.log(error);

    });

  });

}