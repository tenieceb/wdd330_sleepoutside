import { getLocalStorage } from "./utils.mjs";

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSubTotal();
  }

  calculateItemSubTotal() {
    let itemCount = 0;
    this.itemTotal = 0;

    this.list.forEach(item => {
      itemCount += item.quantity;
      this.itemTotal += item.price * item.quantity;
    });

    document.querySelector(`${this.outputSelector} #item-count`)
      .innerText = itemCount;

    document.querySelector(`${this.outputSelector} #subtotal`)
      .innerText = `$${this.itemTotal.toFixed(2)}`;
  }

  calculateOrderTotal() {
    // Tax: 6%
    this.tax = this.itemTotal * 0.06;

    // Shipping: $10 first item + $2 each additional
    const itemCount = this.list.reduce(
      (total, item) => total + item.quantity, 0
    );

    this.shipping = itemCount > 0
      ? 10 + (itemCount - 1) * 2
      : 0;

    this.orderTotal = this.itemTotal + this.tax + this.shipping;

    this.displayOrderTotals();
  }

  displayOrderTotals() {
    document.querySelector(`${this.outputSelector} #tax`)
      .innerText = `$${this.tax.toFixed(2)}`;

    document.querySelector(`${this.outputSelector} #shipping`)
      .innerText = `$${this.shipping.toFixed(2)}`;

    document.querySelector(`${this.outputSelector} #order-total`)
      .innerText = `$${this.orderTotal.toFixed(2)}`;
  }
}
