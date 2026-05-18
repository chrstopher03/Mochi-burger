
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
    name:'Hamburguesa Clásica',
    price:180
  },

  {
    name:'Hamburguesa Doble',
    price:260
  },

  {
    name:'Pizza Familiar',
    price:480
  },

  {
    name:'Pizza Personal',
    price:220
  },

  {
    name:'Coca Cola',
    price:45
  },

  {
    name:'Papas Fritas',
    price:90
  },

  {
    name:'Hot Dog',
    price:110
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

function renderInventory(){

  inventoryTable.innerHTML = '';

  inventory.forEach(item => {

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

      updateStats();

      updateChart();

      showSuccess('Factura eliminada');

    }

  });

}

/* =========================
PRODUCTOS VENDIDOS
========================= */

function renderSoldProducts(){

  const container =
    document.getElementById('soldProducts');

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

  doc.setFontSize(16);

  doc.text(
    'Gracias por su compra',
    105,
    y + 50,
    { align:'center' }
  );

  doc.text(
    'MOCHI BURGERS',
    105,
    y + 60,
    { align:'center' }
  );

  doc.save('factura-mochi-burgers.pdf');

  showSuccess('PDF descargado');

}

/* =========================
STATS
========================= */

function updateStats(){

  let total = 0;

  invoices.forEach(invoice => {

    total += Number(
      invoice.total.replace('C$','')
    );

  });

  salesAmount.textContent =
    `C$${total}`;

  invoiceCount.textContent =
    invoices.length;

}

/* =========================
CHART
========================= */

let chart;

function updateChart(){

  const ctx =
    document.getElementById('salesChart');

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
EVENTOS
========================= */

document.addEventListener('input', e => {

  if(
    e.target.classList.contains('productQty')
  ){

    calculateTotal();

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

addProductRow();

function printTicket() {

  const client =
    document.getElementById("clientName").value || "Cliente";

  const phone =
    document.getElementById("clientPhone").value || "-";

  const date =
    document.getElementById("invoiceDate").value ||
    new Date().toLocaleDateString();

  const rows =
    document.querySelectorAll("#invoiceProducts tr");

  let productsHTML = "";

  let total = 0;

  rows.forEach(row => {

    const inputs = row.querySelectorAll("input, select");

    if(inputs.length >= 3){

      const product =
        inputs[0].value || "Producto";

      const qty =
        parseFloat(inputs[1].value) || 0;

      const price =
        parseFloat(inputs[2].value) || 0;

      const subtotal = qty * price;

      total += subtotal;

      productsHTML += `

        <tr>

          <td style="padding:4px 0;">
            ${product}
          </td>

          <td style="text-align:center;">
            ${qty}
          </td>

          <td style="text-align:right;">
            C$${subtotal.toFixed(2)}
          </td>

        </tr>

      `;
    }

  });

  const ticket = window.open("", "", "width=350,height=700");

  ticket.document.write(`

    <html>

    <head>

      <title>Ticket</title>

      <style>

        body{

          font-family: monospace;
          width: 280px;
          margin:auto;
          padding:10px;
          color:#000;

        }

        .center{

          text-align:center;

        }

        img{

          width:80px;
          height:80px;
          object-fit:cover;
          border-radius:50%;
          margin-bottom:10px;

        }

        h1{

          margin:0;
          font-size:22px;

        }

        p{

          margin:3px 0;
          font-size:12px;

        }

        table{

          width:100%;
          margin-top:10px;
          border-collapse:collapse;

        }

        td{

          font-size:12px;
          padding:2px 0;

        }

        .line{

          border-top:1px dashed #000;
          margin:8px 0;

        }

        .total{

          text-align:right;
          font-size:18px;
          font-weight:bold;
          margin-top:10px;

        }

        @media print{

          body{

            width:80mm;

          }

        }

      </style>

    </head>

    <body>

      <div class="center">

        <img src="1.jpeg">

        <h1>MOCHI BURGERS</h1>

        <p>FACTURA DE VENTA</p>

      </div>

      <div class="line"></div>

      <p><b>Cliente:</b> ${client}</p>

      <p><b>Tel:</b> ${phone}</p>

      <p><b>Fecha:</b> ${date}</p>

      <div class="line"></div>

      <table>

        <thead>

          <tr>

            <td><b>Prod</b></td>
            <td><b>Cant</b></td>
            <td><b>Total</b></td>

          </tr>

        </thead>

        <tbody>

          ${productsHTML}

        </tbody>

      </table>

      <div class="line"></div>

      <div class="total">

        TOTAL: C$${total.toFixed(2)}

      </div>

      <div class="line"></div>

      <p class="center">

        Gracias por su compra

      </p>

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