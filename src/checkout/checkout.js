import CheckoutProcess from "./CheckoutProcess.mjs";
import { submitOrder } from "../js/ExternalServices.mjs";

const checkout = new CheckoutProcess("so-cart", ".order-summary");
checkout.init();

const zipInput = document.querySelector("#zip");
zipInput.addEventListener("blur", () => {
  checkout.calculateOrderTotal();
});

const form = document.querySelector("#checkout-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!form.checkValidity()) {
    alert("Please fill in all fields.");
    return;
  }

  const order = {
    items: checkout.list,
    total: checkout.orderTotal
  };

  try {
    await submitOrder(order);
    alert("Order successfully submitted!");
  } catch (error) {
    alert("Error submitting order.");
  }
});
