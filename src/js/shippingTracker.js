const form = document.getElementById("trackingForm");
const shipmentList = document.getElementById("shipmentList");

let shipments = JSON.parse(localStorage.getItem("shipments")) || [];

function saveShipments() {
  localStorage.setItem("shipments", JSON.stringify(shipments));
}

function renderShipments() {
  shipmentList.innerHTML = "";

  if (shipments.length === 0) {
    shipmentList.innerHTML = "<p>No shipments added yet.</p>";
    return;
  }

  shipments.forEach((shipment, index) => {
    const div = document.createElement("div");
    div.classList.add("shipment-card");

    div.innerHTML = `
      <h4>Order: ${shipment.orderId}</h4>
      <p><strong>Carrier:</strong> ${shipment.carrier}</p>
      <p><strong>Status:</strong> ${shipment.status}</p>
      <button onclick="deleteShipment(${index})">Delete</button>
    `;

    shipmentList.appendChild(div);
  });
}

window.deleteShipment = function(index) {
  shipments.splice(index, 1);
  saveShipments();
  renderShipments();
};

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const orderId = document.getElementById("orderId").value;
  const carrier = document.getElementById("carrier").value;
  const status = document.getElementById("status").value;

  shipments.push({ orderId, carrier, status });

  saveShipments();
  renderShipments();
  form.reset();
});

renderShipments();
