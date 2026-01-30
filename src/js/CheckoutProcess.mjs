import { getLocalStorage } from "./utils.mjs";

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
        const zipInput = document.getElementById('zip');

        zipInput.addEventListener('blur', async () => {
            const subtotal = await this.handleSubtotal();
            const { tax, shipping } = await this.handleTaxShipping(subtotal);
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
  async handleTaxShipping(subtotal) {
    const taxRate = 0.06;
    const cartItems = getLocalStorage('so-cart')
    // itemCount will be updated once quantity logic is implemented
    const itemCount = cartItems ? cartItems.length : 0;
    const tax = subtotal * taxRate;
    const shipping = itemCount > 0 ? 10 + (itemCount - 1) * 2 : 0;
    return { tax, shipping };
  }

  displayOrderSummary(subtotal, tax, shipping, total) {
    const summaryContainer = document.getElementById('dyn_order_info');
    summaryContainer.innerHTML = displayOrderSummaryTemplate(subtotal, tax, shipping, total);
  }}
