import { getLocalStorage, loadHeaderFooter } from './utils.mjs'

loadHeaderFooter();

function renderCartContents() {
  const cartItems = getLocalStorage('so-cart')

  if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
    document.querySelector('.product-list').innerHTML =
      '<p>Your cart is empty.</p>'
    return
  }

  const htmlItems = cartItems.map((item) => cartItemTemplate(item))
  document.querySelector('.product-list').innerHTML = htmlItems.join('')
}

function cartItemTemplate(item) {
  const imgSrc = item.Images?.PrimaryMedium || '/images/default-thumb.jpg';
  const name = item.NameWithoutBrand || 'Unknown Product';
  const color = item.Colors?.[0]?.ColorName || 'N/A';
  const price = item.FinalPrice?.toFixed(2) || '0.00';

  return `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img src="${imgSrc}" alt="${name}" />
    </a>
    <a href="#">
      <h2 class="card__name">${name}</h2>
    </a>
    <p class="cart-card__color">${color}</p>
    <p class="cart-card__quantity">qty: 1</p>
    <p class="cart-card__price">$${price}</p>
  </li>`;
}


renderCartContents()
