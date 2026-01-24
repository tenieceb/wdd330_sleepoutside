import { setLocalStorage, getLocalStorage } from './utils.mjs';

export default class ProductDetails {

  constructor(productID, dataSource) {
    this.productID = productID;
    this.product = {};
    this.dataSource = dataSource;
  }

    async init() {
    // use the datasource to get the details for the current product. findProductById will return a promise! use await or .then() to process it
    this.product = await this.dataSource.findProductById(this.productID)
    // the product details are needed before rendering the HTML
    this.renderProductDetails();
    // once the HTML is rendered, add a listener to the Add to Cart button
    // Notice the .bind(this). This callback will not work if the bind(this) is missing. Review the readings from this week on 'this' to understand why.
    document.getElementById('addToCart')
    .addEventListener('click', this.addToCartHandler.bind(this));
  };

addProductToCart() {
  const cartItems = getLocalStorage('so-cart') || [];
  console.log('Before adding, cart items:', cartItems);
  cartItems.push(this.product);
  setLocalStorage('so-cart', cartItems);
  console.log('After adding, cart items:', getLocalStorage('so-cart'));
}

addToCartHandler() {
  console.log('Add to Cart clicked!');
  this.addProductToCart();
}


renderProductDetails() {
    const product = this.product;
    document.querySelector('h2').textContent = product.Brand.Name;
    document.querySelector('h3').textContent = product.NameWithoutBrand;

    const productImage = document.getElementById('productImage');
    productImage.src = product.Images?.PrimaryLarge || '/images/default-large.jpg';
    productImage.alt = product.NameWithoutBrand;

    document.getElementById('productPrice').textContent = document.getElementById('productPrice').textContent = `$${product.FinalPrice.toFixed(2)}`;;
    document.getElementById('productColor').textContent = product.Colors[0].ColorName||'N/A';
    document.getElementById('productDesc').innerHTML = product.DescriptionHtmlSimple;

    const msrpEl = document.getElementById('productMSRP');
const priceEl = document.getElementById('productPrice');
const discountEl = document.getElementById('productDiscount');

priceEl.textContent = `$${product.FinalPrice.toFixed(2)}`;

if (
  product.SuggestedRetailPrice &&
  product.SuggestedRetailPrice > product.FinalPrice
) {
  msrpEl.textContent = `$${product.SuggestedRetailPrice.toFixed(2)}`;

  const savings = product.SuggestedRetailPrice - product.FinalPrice;
  const percentOff = Math.round(
    (savings / product.SuggestedRetailPrice) * 100
  );

  discountEl.textContent = `Save $${savings.toFixed(2)} (${percentOff}% off)`;
} else {
  msrpEl.textContent = '';
  discountEl.textContent = '';
}


    document.getElementById('addToCart').dataset.id = product.Id;
}}