import CheckoutProcess from "./CheckoutProcess.mjs";
import { submitOrder } from "../js/ExternalServices.mjs";
import { alertMessage } from "../js/utils.mjs";

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  try {
    await submitOrder(order);

    // ✅ HAPPY PATH
    localStorage.removeItem("so-cart");
    window.location.href = "/checkout/success.html";

  } catch (err) {
    // 😢 UNHAPPY PATH
    if (err.name === "servicesError") {
      err.message.errors.forEach(error => {
        alertMessage(error.message);
      });
    } else {
      alertMessage("Something went wrong. Please try again.");
    }
  }
});


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
