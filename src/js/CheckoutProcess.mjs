import { getLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

function displayOrderSummaryTemplate(subtotal, tax, shipping, total) {
  return `
    <h2>Order Summary</h2>
    <p>Subtotal: $${subtotal.toFixed(2)}</p>
    <p>Tax: $${tax.toFixed(2)}</p>
    <p>Shipping: $${shipping.toFixed(2)}</p>
    <p>Total: $${total.toFixed(2)}</p>
`}

export default class CheckoutProcess {
  constructor(formId) {
    this.form = document.getElementById(formId);
  }

  initZipListener(){
        const zipInput = document.querySelector('#zip');

        zipInput.addEventListener('blur', async () => {
            const subtotal = this.handleSubtotal();
            const { tax, shipping } = this.handleTaxShipping(subtotal);
            const total = subtotal + tax + shipping;
            this.displayOrderSummary(subtotal, tax, shipping, total);
        });
    }

  handleSubtotal() {
    const cartItems = getLocalStorage('so-cart')
    let subtotal = 0;
    if (cartItems && Array.isArray(cartItems)) {
      subtotal = cartItems.reduce((total, item) => total + (item.FinalPrice || 0), 0);
    }
    return subtotal;
  }

//Normally tax and shipping would be calculated according to the destination address. There would be a look up process that would figure out the right values to use. To keep it simple, use the same formulas for all orders.

// Tax: Use 6% sales tax on the subtotal amount.
// Shipping: Use $10 for the first item plus $2 for each additional item after that.
  handleTaxShipping(subtotal) {
    const taxRate = 0.06;
    const cartItems = getLocalStorage('so-cart')
    // itemCount will be updated once quantity logic is implemented
    const itemCount = cartItems ? cartItems.length : 0;
    const tax = subtotal * taxRate;
    const shipping = itemCount > 0 ? 10 + (itemCount - 1) * 2 : 0;
    return { tax, shipping };
  }

  displayOrderSummary(subtotal, tax, shipping, total) {
    const summaryContainer = document.querySelector('#dyn_order_info');
    summaryContainer.innerHTML = displayOrderSummaryTemplate(subtotal, tax, shipping, total);
  }
  // takes the items currently stored in the cart (localstorage) and returns them in a simplified form.
  packageItems(cartItems) {
    // convert the list of products from localStorage to the simpler form required for the checkout process.
    // An Array.map would be perfect for this process.
    return cartItems.map(item => ({
      id: item.Id,
      name: item.Name,
      price: item.FinalPrice,
      quantity: item.Quantity || 1
  }))}


  async checkout(event) {
    event.preventDefault(); // prevent the default form submission behavior from the webservice

    // get the form element data by the form name which is already stored in this.form
    // convert the form data to a JSON order object using the formDataToJSON function
    const formData = formDataToJSON(this.form);
    const subtotal = this.handleSubtotal();
    const { tax, shipping } = this.handleTaxShipping(subtotal);
    const orderTotal = subtotal + tax + shipping;
    // get the cart items from local storage
    const cartItems = getLocalStorage('so-cart') || [];
    const packagedItems = this.packageItems(cartItems);
    // populate the JSON order object with the order Date, orderTotal, tax, shipping, and list of items
    const cleanCardNumber = formData.cardNumber? formData.cardNumber.replace(/\D/g, ''): '1234123412341234';
    let exp = formData.expiration || '1/30';
    if (exp.startsWith('0')) {
      exp = exp.slice(1); // remove leading zero
    }

    const orderData = {
      orderDate: new Date().toISOString(),
      fname: formData.fname || 'Jane',
      lname: formData.lname || 'Doe',
      street: formData.street || '123 street',
      city: formData.city || 'city',
      state: formData.state || 'ID',
      zip: formData.zip || '00000',
      cardNumber: cleanCardNumber,
      expiration: formData.expiration || '1/30',
      code: formData.code || '123',
      items: packagedItems,
      orderTotal: parseFloat(orderTotal.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      shipping: parseFloat(shipping.toFixed(2))
    };


    

      console.log('Sending order data:', orderData);

    // call the checkout method in the ExternalServices module and send it the JSON order data.
     const externalService = new ExternalServices();

    try {
      const result = await externalService.submitOrder(orderData);
      console.log("Order submitted successfully:", result);
      // You can also update UI here to show success message or redirect
    } catch (error) {
      console.error("Error submitting order:", error);
      // Show error message to user
    }
}
}

// takes a form element and returns an object where the key is the "name" of the form input.
function formDataToJSON(formElement) {
  const formData = new FormData(formElement),
    convertedJSON = {};

  formData.forEach(function (value, key) {
    convertedJSON[key] = value;
  });

  return convertedJSON;
}
