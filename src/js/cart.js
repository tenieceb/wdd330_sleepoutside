import { getLocalStorage, loadHeaderFooter } from './utils.mjs'

loadHeaderFooter()

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
  const finalPrice = item.FinalPrice ?? 0;
  const msrp = item.SuggestedRetailPrice ?? null;

  let msrpHtml = '';
  let discountHtml = '';

  if (msrp && msrp > finalPrice) {
    const savings = msrp - finalPrice;
    const percentOff = Math.round((savings / msrp) * 100);

    msrpHtml = `<p class="cart-card__msrp">$${msrp.toFixed(2)}</p>`;
    discountHtml = `<p class="cart-card__discount">
      Save $${savings.toFixed(2)} (${percentOff}% off)
    </p>`;
  }

  return `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img src="${imgSrc}" alt="${name}" />
    </a>
    <a href="#">
      <h2 class="card__name">${name}</h2>
    </a>
    <p class="cart-card__color">${color}</p>
    <p class="cart-card__quantity">qty: 1</p>

    ${msrpHtml}
    <p class="cart-card__price">$${finalPrice.toFixed(2)}</p>
    ${discountHtml}
  </li>`;
}


renderCartContents()
