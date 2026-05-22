/* =========================
ALERTAS BONITAS
========================= */

function showSuccess(message){

  Swal.fire({

    icon:'success',

    title:'Éxito',

    text:message,

    background:'#18181b',

    color:'#fff',

    confirmButtonColor:'#f97316',

    confirmButtonText:'Aceptar'

  });

}

function showError(message){

  Swal.fire({

    icon:'error',

    title:'Error',

    text:message,

    background:'#18181b',

    color:'#fff',

    confirmButtonColor:'#ef4444',

    confirmButtonText:'Cerrar'

  });

}

function showWarning(message){

  Swal.fire({

    icon:'warning',

    title:'Aviso',

    text:message,

    background:'#18181b',

    color:'#fff',

    confirmButtonColor:'#f59e0b',

    confirmButtonText:'Entendido'

  });

}

/* =========================
DATA
========================= */

const productList = [

  {
    name:'Classic Burger',
    price:180
  },

  {
    name:'Double Smash',
    price:260
  },

  {
    name:'Doner',
    price:480
  },

  {
    name:'Alitas bañadas en salsa especial',
    price:220
  },

  {
    name:'Sandwich de Pescado',
    price:45
  },

  {
    name:'Sandwich de Pollo',
    price:90
  },

  {
    name:'Cocacola',
    price:25
  }

];

let inventory =
  JSON.parse(localStorage.getItem('inventory')) || [];

let invoices =
  JSON.parse(localStorage.getItem('invoices')) || [];

let salesData =
  JSON.parse(localStorage.getItem('salesData')) || [];

const inventoryTable =
  document.getElementById('inventoryTable');

const invoiceProducts =
  document.getElementById('invoiceProducts');

const invoiceTotal =
  document.getElementById('invoiceTotal');

const salesAmount =
  document.getElementById('salesAmount');

const invoiceCount =
  document.getElementById('invoiceCount');

/* =========================
MODAL
========================= */

function openInventoryModal(){

  document
    .getElementById('inventoryModal')
    .classList.remove('hidden');

  document
    .getElementById('inventoryModal')
    .classList.add('flex');

}

function closeInventoryModal(){

  document
    .getElementById('inventoryModal')
    .classList.add('hidden');

  document
    .getElementById('inventoryModal')
    .classList.remove('flex');

}

/* =========================
INVENTARIO
========================= */

function addIngredient(){

  const name =
    document.getElementById('ingredientName').value;

  const qty =
    Number(
      document.getElementById('ingredientQty').value
    );

  const unit =
    document.getElementById('ingredientUnit').value;

  if(name.trim() === ''){

    showError('Ingrese nombre');

    return;

  }

  inventory.push({
    id:Date.now(),
    name,
    qty,
    unit
  });

  localStorage.setItem(
    'inventory',
    JSON.stringify(inventory)
  );

  renderInventory();

  closeInventoryModal();

  showSuccess('Ingrediente agregado');

  document.getElementById('ingredientName').value = '';
  document.getElementById('ingredientQty').value = '';
  document.getElementById('ingredientUnit').value = '';

}

function renderInventory(filtered = inventory){

  inventoryTable.innerHTML = '';

  filtered.forEach(item => {

    inventoryTable.innerHTML += `

      <tr>

        <td>${item.name}</td>

        <td>${item.qty}</td>

        <td>${item.unit}</td>

        <td class="${
          item.qty <= 5
          ? 'text-red-400'
          : 'text-green-400'
        } font-bold">

          ${
            item.qty <= 5
            ? 'Bajo'
            : 'Bien'
          }

        </td>

        <td>

          <button
            onclick="deleteIngredient(${item.id})"
            class="bg-red-500 px-4 py-2 rounded-xl">

            Eliminar

          </button>

        </td>

      </tr>

    `;

  });

}

function deleteIngredient(id){

  Swal.fire({

    title:'¿Eliminar ingrediente?',

    icon:'warning',

    background:'#18181b',

    color:'#fff',

    showCancelButton:true,

    confirmButtonColor:'#ef4444',

    cancelButtonColor:'#3f3f46',

    confirmButtonText:'Eliminar',

    cancelButtonText:'Cancelar'

  }).then((result)=>{

    if(result.isConfirmed){

      inventory =
        inventory.filter(item => item.id !== id);

      localStorage.setItem(
        'inventory',
        JSON.stringify(inventory)
      );

      renderInventory();

      showSuccess('Ingrediente eliminado');

    }

  });

}

/* =========================
FACTURA
========================= */

function addProductRow(){

  let options = '';

  productList.forEach(product => {

    options += `
      <option
        value="${product.name}"
        data-price="${product.price}">

        ${product.name} - C$${product.price}

      </option>
    `;

  });

  const tr = document.createElement('tr');

  tr.innerHTML = `

    <td class="p-2">

      <select
        class="productSelect bg-zinc-900 border border-zinc-700 rounded-xl p-3 w-full">

        ${options}

      </select>

    </td>

    <td class="p-2">

      <input
        type="number"
        value="1"
        min="1"
        class="productQty bg-zinc-900 border border-zinc-700 rounded-xl p-3 w-full">

    </td>

    <td class="p-2">

      <input
        type="number"
        class="productPrice bg-zinc-900 border border-zinc-700 rounded-xl p-3 w-full"
        readonly>

    </td>

    <td class="subtotal text-green-400 font-black p-2">
      C$0
    </td>

    <td class="p-2">

      <button
        onclick="removeRow(this)"
        class="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl">

        X

      </button>

    </td>

  `;

  invoiceProducts.appendChild(tr);

  const select =
    tr.querySelector('.productSelect');

  const priceInput =
    tr.querySelector('.productPrice');

  priceInput.value =
    select.options[select.selectedIndex].dataset.price;

  calculateTotal();

}

function updateProductPrices(){

  document.querySelectorAll('#invoiceProducts tr')
  .forEach(row => {

    const select =
      row.querySelector('.productSelect');

    const priceInput =
      row.querySelector('.productPrice');

    const selected =
      select.options[select.selectedIndex];

    priceInput.value =
      selected.dataset.price;

  });

}

function removeRow(button){

  button.parentElement.parentElement.remove();

  calculateTotal();

}

function calculateTotal(){

  let total = 0;

  document.querySelectorAll('#invoiceProducts tr')
  .forEach(row => {

    const qty =
      Number(
        row.querySelector('.productQty').value
      );

    const price =
      Number(
        row.querySelector('.productPrice').value
      );

    const subtotal =
      qty * price;

    row.querySelector('.subtotal').textContent =
      `C$${subtotal}`;

    total += subtotal;

  });

  invoiceTotal.textContent =
    `C$${total}`;

  calculateChange();

}

/* =========================
VUELTO
========================= */

function calculateChange(){

  const total =
    Number(
      invoiceTotal.textContent.replace('C$','')
    );

  const cash =
    Number(
      document.getElementById('cashReceived')?.value || 0
    );

  const change =
    cash - total;

  const changeElement =
    document.getElementById('changeAmount');

  if(changeElement){

    changeElement.textContent =
      `C$${change >= 0 ? change : 0}`;

  }

}

/* =========================
GUARDAR FACTURA
========================= */

let savingInvoice = false;

function saveInvoice(){

  if(savingInvoice){
    return;
  }

  savingInvoice = true;

  const rows =
    document.querySelectorAll('#invoiceProducts tr');

  if(rows.length === 0){

    savingInvoice = false;

    showWarning('Agrega productos');

    return;

  }

  const seller =
    document.getElementById('clientName').value;

  if(seller.trim() === ''){

    savingInvoice = false;

    showError('Ingrese nombre del vendedor');

    return;

  }

  const products = [];

  let total = 0;

  rows.forEach(row => {

    const name =
      row.querySelector('.productSelect').value;

    const qty =
      Number(
        row.querySelector('.productQty').value
      );

    const price =
      Number(
        row.querySelector('.productPrice').value
      );

    const subtotal =
      qty * price;

    total += subtotal;

    products.push({
      name,
      qty,
      price,
      subtotal
    });

  });

  const invoice = {

    id:'FAC-' + Date.now(),

    seller:seller,

    total:`C$${total}`,

    numericTotal:total,

    date:new Date().toLocaleString(),

    products

  };

  invoices.push(invoice);

  localStorage.setItem(
    'invoices',
    JSON.stringify(invoices)
  );

  salesData.push(total);

  localStorage.setItem(
    'salesData',
    JSON.stringify(salesData)
  );

  renderSoldProducts();

  renderInvoiceHistory();

  updateStats();

  updateChart();

  showSuccess('Factura guardada correctamente');

  invoiceProducts.innerHTML = '';

  addProductRow();

  calculateTotal();

  document.getElementById('clientName').value = '';

  setTimeout(() => {

    savingInvoice = false;

  }, 1000);

}

/* =========================
ELIMINAR FACTURA
========================= */

function deleteInvoice(id){

  const invoice =
    invoices.find(item => item.id === id);

  if(!invoice){
    return;
  }

  Swal.fire({

    title:'¿Eliminar factura?',

    text:'Esta acción no se puede deshacer',

    icon:'warning',

    background:'#18181b',

    color:'#fff',

    showCancelButton:true,

    confirmButtonColor:'#ef4444',

    cancelButtonColor:'#3f3f46',

    confirmButtonText:'Eliminar',

    cancelButtonText:'Cancelar'

  }).then((result)=>{

    if(result.isConfirmed){

      invoices =
        invoices.filter(item => item.id !== id);

      localStorage.setItem(
        'invoices',
        JSON.stringify(invoices)
      );

      const totalToRemove =
        invoice.numericTotal ||
        Number(invoice.total.replace('C$',''));

      const index =
        salesData.indexOf(totalToRemove);

      if(index > -1){

        salesData.splice(index,1);

      }

      localStorage.setItem(
        'salesData',
        JSON.stringify(salesData)
      );

      renderSoldProducts();

      renderInvoiceHistory();

      updateStats();

      updateChart();

      showSuccess('Factura eliminada');

    }

  });

}

/* =========================
HISTORIAL FACTURAS
========================= */

function renderInvoiceHistory(){

  const container =
    document.getElementById('invoiceHistory');

  if(!container){
    return;
  }

  container.innerHTML = '';

  [...invoices].reverse().forEach(invoice => {

    container.innerHTML += `

      <div class="bg-zinc-900 rounded-2xl p-5 flex justify-between items-center gap-4 flex-wrap">

        <div>

          <h1 class="text-orange-400 font-black text-xl">
            ${invoice.id}
          </h1>

          <p class="text-zinc-400">
            ${invoice.seller}
          </p>

          <p class="text-zinc-500">
            ${invoice.date}
          </p>

        </div>

        <div class="text-right">

          <h1 class="text-green-400 text-2xl font-black">
            ${invoice.total}
          </h1>

        </div>

      </div>

    `;

  });

}

/* =========================
PRODUCTOS VENDIDOS
========================= */

function renderSoldProducts(){

  const container =
    document.getElementById('soldProducts');

  if(!container){
    return;
  }

  container.innerHTML = '';

  [...invoices].reverse().forEach(invoice => {

    let items = '';

    invoice.products.forEach(product => {

      items += `
        <p>
          • ${product.name}
          x${product.qty}
        </p>
      `;

    });

    container.innerHTML += `

      <div class="bg-zinc-900 rounded-2xl p-5">

        <div class="flex justify-between items-start gap-4">

          <div>

            <h1 class="text-xl font-black text-orange-400">
              ${invoice.id}
            </h1>

            <p class="text-zinc-400 mt-2">
              Vendedor:
              ${invoice.seller}
            </p>

            <p class="text-zinc-500">
              ${invoice.date}
            </p>

          </div>

          <button
            onclick="deleteInvoice('${invoice.id}')"
            class="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl font-bold">

            Eliminar

          </button>

        </div>

        <div class="mt-4 space-y-2">
          ${items}
        </div>

        <h2 class="text-2xl font-black text-green-400 mt-4">
          ${invoice.total}
        </h2>

      </div>

    `;

  });

}

/* =========================
EXPORTAR INVENTARIO
========================= */

function exportInventory(){

  if(inventory.length === 0){

    showWarning('No hay inventario');

    return;

  }

  let content = 'Ingrediente,Cantidad,Unidad\n';

  inventory.forEach(item => {

    content += `${item.name},${item.qty},${item.unit}\n`;

  });

  const blob =
    new Blob([content], { type:'text/csv' });

  const url =
    URL.createObjectURL(blob);

  const a =
    document.createElement('a');

  a.href = url;

  a.download = 'inventario.csv';

  a.click();

  URL.revokeObjectURL(url);

}

/* =========================
WHATSAPP
========================= */

function sendWhatsApp(){

  const client =
    document.getElementById('clientName').value || 'Cliente';

  const phone =
    document.getElementById('clientPhone').value;

  if(phone.trim() === ''){

    showWarning('Ingrese número de teléfono');

    return;

  }

  const rows =
    document.querySelectorAll('#invoiceProducts tr');

  let message =
    `🍔 *MOCHI BURGERS*%0A%0A`;

  message +=
    `👤 Cliente: ${client}%0A%0A`;

  let total = 0;

  rows.forEach(row => {

    const product =
      row.querySelector('.productSelect').value;

    const qty =
      Number(
        row.querySelector('.productQty').value
      );

    const price =
      Number(
        row.querySelector('.productPrice').value
      );

    const subtotal =
      qty * price;

    total += subtotal;

    message +=
      `• ${product} x${qty} = C$${subtotal}%0A`;

  });

  message +=
    `%0A💰 TOTAL: C$${total}`;

  window.open(
    `https://wa.me/${phone}?text=${message}`,
    '_blank'
  );

}

/* =========================
BORRAR FACTURAS
========================= */

function clearInvoices(){

  Swal.fire({

    title:'¿Borrar todas las facturas?',

    icon:'warning',

    background:'#18181b',

    color:'#fff',

    showCancelButton:true,

    confirmButtonColor:'#ef4444',

    cancelButtonColor:'#3f3f46',

    confirmButtonText:'Borrar',

    cancelButtonText:'Cancelar'

  }).then(result => {

    if(result.isConfirmed){

      invoices = [];

      salesData = [];

      localStorage.removeItem('invoices');

      localStorage.removeItem('salesData');

      renderSoldProducts();

      renderInvoiceHistory();

      updateStats();

      updateChart();

      showSuccess('Facturas eliminadas');

    }

  });

}

/* =========================
FILTRAR VENTAS
========================= */

function filterSalesByDate(){

  const selectedDate =
    document.getElementById('salesDate').value;

  const container =
    document.getElementById('filteredSales');

  container.innerHTML = '';

  if(selectedDate === ''){

    showWarning('Seleccione fecha');

    return;

  }

  const filtered =
    invoices.filter(invoice => {

      return invoice.date.includes(
        new Date(selectedDate)
        .toLocaleDateString()
      );

    });

  if(filtered.length === 0){

    container.innerHTML = `
      <div class="bg-zinc-900 rounded-2xl p-5">
        No hay ventas
      </div>
    `;

    return;

  }

  filtered.forEach(invoice => {

    container.innerHTML += `

      <div class="bg-zinc-900 rounded-2xl p-5">

        <h1 class="text-orange-400 text-xl font-black">
          ${invoice.id}
        </h1>

        <p class="text-zinc-400">
          ${invoice.seller}
        </p>

        <p class="text-green-400 font-black mt-2">
          ${invoice.total}
        </p>

      </div>

    `;

  });

}

/* =========================
PDF
========================= */

async function downloadPDF(){

  const rows =
    document.querySelectorAll('#invoiceProducts tr');

  if(rows.length === 0){

    showWarning('Agrega productos');

    return;

  }

  const { jsPDF } = window.jspdf;

  const doc = new jsPDF();

  const now = new Date();

  const seller =
    document.getElementById('clientName').value || 'Sin vendedor';

  const invoiceNumber =
    'FAC-' + Date.now();

  let total = 0;

  doc.setFillColor(255,255,255);

  doc.rect(0,0,210,300,'F');

  try{

    doc.addImage(
      '1.jpeg',
      'JPEG',
      65,
      10,
      80,
      50
    );

  }catch(e){}

  doc.setFontSize(28);

  doc.text(
    'MOCHI BURGERS',
    105,
    75,
    { align:'center' }
  );

  doc.setFontSize(18);

  doc.text(
    'Factura de Venta',
    105,
    88,
    { align:'center' }
  );

  doc.setFontSize(15);

  doc.text(
    `Factura: ${invoiceNumber}`,
    20,
    115
  );

  doc.text(
    `Fecha: ${now.toLocaleDateString()}`,
    20,
    128
  );

  doc.text(
    `Hora: ${now.toLocaleTimeString()}`,
    20,
    141
  );

  doc.text(
    `Vendedor: ${seller}`,
    20,
    154
  );

  doc.line(20,170,190,170);

  doc.text('Producto',20,183);

  doc.text('Cant',105,183);

  doc.text('Total',165,183);

  doc.line(20,190,190,190);

  let y = 205;

  rows.forEach(row => {

    const product =
      row.querySelector('.productSelect').value;

    const qty =
      Number(
        row.querySelector('.productQty').value
      );

    const price =
      Number(
        row.querySelector('.productPrice').value
      );

    const subtotal =
      qty * price;

    total += subtotal;

    doc.text(product,20,y);

    doc.text(String(qty),110,y);

    doc.text(`C$${subtotal}`,160,y);

    y += 15;

  });

  doc.line(20,y,190,y);

  doc.setFontSize(24);

  doc.text(
    `TOTAL: C$${total}`,
    20,
    y + 20
  );

  doc.save('factura-mochi-burgers.pdf');

  showSuccess('PDF descargado');

}

/* =========================
STATS
========================= */

function updateStats(){

  let total = 0;

  let products = 0;

  let topProductCounter = {};

  invoices.forEach(invoice => {

    total += Number(
      invoice.total.replace('C$','')
    );

    invoice.products.forEach(product => {

      products += product.qty;

      if(!topProductCounter[product.name]){

        topProductCounter[product.name] = 0;

      }

      topProductCounter[product.name] += product.qty;

    });

  });

  salesAmount.textContent =
    `C$${total}`;

  invoiceCount.textContent =
    invoices.length;

  const productsCount =
    document.getElementById('productsCount');

  if(productsCount){

    productsCount.textContent =
      products;

  }

  const todaySales =
    document.getElementById('todaySales');

  if(todaySales){

    todaySales.textContent =
      `C$${total}`;

  }

  let topProduct = 'Ninguno';

  let max = 0;

  for(let product in topProductCounter){

    if(topProductCounter[product] > max){

      max = topProductCounter[product];

      topProduct = product;

    }

  }

  const topProductElement =
    document.getElementById('topProduct');

  if(topProductElement){

    topProductElement.textContent =
      topProduct;

  }

  const lastSale =
    document.getElementById('lastSale');

  if(lastSale){

    lastSale.textContent =
      invoices.length
      ? invoices[invoices.length - 1].total
      : '---';

  }

}

/* =========================
CHART
========================= */

let chart;

function updateChart(){

  const ctx =
    document.getElementById('salesChart');

  if(!ctx){
    return;
  }

  if(chart){

    chart.destroy();

  }

  chart = new Chart(ctx, {

    type:'bar',

    data:{

      labels:
        salesData.map((_,i)=>`Venta ${i+1}`),

      datasets:[{

        label:'Ventas',

        data:salesData,

        backgroundColor:'#f97316'

      }]

    },

    options:{

      responsive:true,

      plugins:{
        legend:{
          labels:{
            color:'white'
          }
        }
      },

      scales:{

        x:{
          ticks:{
            color:'white'
          }
        },

        y:{
          ticks:{
            color:'white'
          }
        }

      }

    }

  });

}

/* =========================
PRINT
========================= */
function printTicket() {

  const rows =
    document.querySelectorAll('#invoiceProducts tr');

  if(rows.length === 0){

    showWarning('Agrega productos');

    return;

  }

  const seller =
    document.getElementById('clientName').value || 'Sin vendedor';

  const phone =
    document.getElementById('clientPhone').value || '-';

  const date =
    document.getElementById('invoiceDate').value ||
    new Date().toLocaleDateString();

  const invoiceNumber =
    'FAC-' + Date.now();

  let total = 0;

  let productsHTML = '';

  rows.forEach(row => {

    const product =
      row.querySelector('.productSelect').value;

    const qty =
      Number(
        row.querySelector('.productQty').value
      );

    const price =
      Number(
        row.querySelector('.productPrice').value
      );

    const subtotal =
      qty * price;

    total += subtotal;

    productsHTML += `

      <tr>

        <td class="product">
          ${product}
        </td>

        <td class="center">
          ${qty}
        </td>

        <td class="right">
          C$${subtotal}
        </td>

      </tr>

    `;

  });

  const ticket =
    window.open('', '', 'width=320,height=900');

  ticket.document.write(`

    <!DOCTYPE html>

    <html lang="es">

    <head>

      <meta charset="UTF-8">

      <title>Ticket</title>

      <style>

        *{

          margin:0;
          padding:0;
          box-sizing:border-box;

        }

        @page{

          size:80mm auto;
          margin:0;

        }

        body{

          width:80mm;
          font-family:monospace;
          background:#fff;
          color:#000;
          padding:8px;
          font-size:12px;

        }

        .center{

          text-align:center;

        }

        .logo{

          width:70px;
          height:70px;
          object-fit:cover;
          border-radius:50%;
          margin:auto;
          display:block;
          margin-bottom:8px;

        }

        h1{

          font-size:20px;
          margin-bottom:3px;

        }

        .subtitle{

          font-size:12px;
          margin-bottom:10px;

        }

        .line{

          border-top:1px dashed #000;
          margin:8px 0;

        }

        .info p{

          margin:2px 0;

        }

        table{

          width:100%;
          border-collapse:collapse;
          margin-top:5px;

        }

        th{

          text-align:left;
          padding-bottom:5px;
          font-size:12px;

        }

        td{

          padding:3px 0;
          font-size:12px;

        }

        .product{

          width:50%;

        }

        .right{

          text-align:right;

        }

        .total{

          margin-top:10px;
          font-size:18px;
          font-weight:bold;
          text-align:right;

        }

        .footer{

          text-align:center;
          margin-top:15px;
          font-size:11px;

        }

      </style>

    </head>

    <body>

      <img src="1.jpeg" class="logo">

      <div class="center">

        <h1>MOCHI BURGERS</h1>

        <p class="subtitle">
          FACTURA DE VENTA
        </p>

      </div>

      <div class="line"></div>

      <div class="info">

        <p>
          <b>Factura:</b>
          ${invoiceNumber}
        </p>

        <p>
          <b>Fecha:</b>
          ${date}
        </p>

        <p>
          <b>Vendedor:</b>
          ${seller}
        </p>

        <p>
          <b>Tel:</b>
          ${phone}
        </p>

      </div>

      <div class="line"></div>

      <table>

        <thead>

          <tr>

            <th>Producto</th>
            <th>Cant</th>
            <th class="right">
              Total
            </th>

          </tr>

        </thead>

        <tbody>

          ${productsHTML}

        </tbody>

      </table>

      <div class="line"></div>

      <div class="total">

        TOTAL: C$${total}

      </div>

      <div class="line"></div>

      <div class="footer">

        <p>Gracias por su compra</p>

        <p>MOCHI BURGERS</p>

      </div>

      <script>

        window.onload = () => {

          window.print();

          setTimeout(() => {

            window.close();

          }, 500);

        }

      <\/script>

    </body>

    </html>

  `);

  ticket.document.close();

}
/* =========================
EVENTOS
========================= */

document.addEventListener('input', e => {

  if(
    e.target.classList.contains('productQty')
  ){

    calculateTotal();

  }

  if(
    e.target.id === 'cashReceived'
  ){

    calculateChange();

  }

  if(
    e.target.id === 'searchInventory'
  ){

    const text =
      e.target.value.toLowerCase();

    const filtered =
      inventory.filter(item =>
        item.name.toLowerCase().includes(text)
      );

    renderInventory(filtered);

  }

});

document.addEventListener('change', e => {

  if(
    e.target.classList.contains('productSelect')
  ){

    updateProductPrices();

    calculateTotal();

  }

});

/* =========================
INIT
========================= */

renderInventory();

updateStats();

updateChart();

renderSoldProducts();

renderInvoiceHistory();

addProductRow();

window.addEventListener("load", () => {

  setTimeout(() => {

    const nav =
      document.getElementById("bottomNav");

    if(nav){

      nav.classList.remove("opacity-0");

      nav.classList.remove("translate-y-20");

    }

  }, 3000);

});


let vipCoupons =
JSON.parse(localStorage.getItem('vipCoupons')) || [];

let html5QrCode;


// GENERAR CUPON

function generateVipCoupon(){

  const random =
  Math.floor(Math.random() * 999999);

  const code =
  "MOCHI-" + random;

  const coupon = {

    code,
    discount:15,
    used:false

  };

  vipCoupons.push(coupon);

  localStorage.setItem(
    'vipCoupons',
    JSON.stringify(vipCoupons)
  );

  showCoupons();

  Swal.fire({

    icon:'success',
    title:'Cupón generado',
    text:code,
    background:'#111',
    color:'#fff'

  });

}


// MOSTRAR CUPONES

function showCoupons(){

  const container =
  document.getElementById('couponList');

  container.innerHTML = '';

  vipCoupons.forEach(coupon=>{

    container.innerHTML += `

    <div class="bg-zinc-900 border border-zinc-700 rounded-3xl p-5">

      <div class="flex justify-between items-center mb-4">

        <h1 class="text-xl font-black text-yellow-400">
          ${coupon.code}
        </h1>

        <span class="text-green-400 font-bold">
          ${coupon.discount}% OFF
        </span>

      </div>

      <svg id="${coupon.code}"></svg>

      <div class="mt-4 text-sm ${coupon.used ? 'text-red-400' : 'text-green-400'}">

        ${coupon.used ? 'UTILIZADO' : 'DISPONIBLE'}

      </div>

    </div>

    `;

    setTimeout(()=>{

      JsBarcode(`#${coupon.code}`, coupon.code, {

        format:"CODE128",
        lineColor:"#ffffff",
        width:2,
        height:70,
        displayValue:true

      });

    },100);

  });

}


// APLICAR CUPON

function applyCoupon(){

  const code =
  document.getElementById('couponInput').value;

  const coupon =
  vipCoupons.find(c=>c.code === code);

  if(!coupon){

    Swal.fire({

      icon:'error',
      title:'Cupón inválido',
      background:'#111',
      color:'#fff'

    });

    return;

  }

  if(coupon.used){

    Swal.fire({

      icon:'warning',
      title:'Cupón ya utilizado',
      background:'#111',
      color:'#fff'

    });

    return;

  }

  coupon.used = true;

  localStorage.setItem(
    'vipCoupons',
    JSON.stringify(vipCoupons)
  );

  Swal.fire({

    icon:'success',
    title:'Cupón aplicado',
    text:coupon.discount + '% OFF',
    background:'#111',
    color:'#fff'

  });

  showCoupons();

}


// ABRIR SCANNER

function openScanner(){

  document
  .getElementById('scannerModal')
  .classList.remove('hidden');

  document
  .getElementById('scannerModal')
  .classList.add('flex');

  html5QrCode =
  new Html5Qrcode("reader");

  Html5Qrcode.getCameras().then(devices=>{

    if(devices.length){

      html5QrCode.start(

        devices[0].id,

        {
          fps:10,
          qrbox:250
        },

        (decodedText)=>{

          document
          .getElementById('couponInput')
          .value = decodedText;

          applyCoupon();

          closeScanner();

        }

      );

    }

  });

}


// CERRAR SCANNER

function closeScanner(){

  document
  .getElementById('scannerModal')
  .classList.add('hidden');

  document
  .getElementById('scannerModal')
  .classList.remove('flex');

  if(html5QrCode){

    html5QrCode.stop();

  }

}


showCoupons();