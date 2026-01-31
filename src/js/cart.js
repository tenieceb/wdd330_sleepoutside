import { getLocalStorage, loadHeaderFooter } from './utils.mjs'

loadHeaderFooter()

export function renderCartContents() {
  const cartItems = getLocalStorage('so-cart')

  const cartFooter = document.querySelector('.cart-footer')
  const cartTotalElem = document.querySelector('.cart-total')

  if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
    document.querySelector('.product-list').innerHTML =
      '<p>Your cart is empty.</p>'
    if (cartFooter) cartFooter.classList.add('hide')
    return
  }

  // Render cart items
  const htmlItems = cartItems.map((item) => cartItemTemplate(item))
  document.querySelector('.product-list').innerHTML = htmlItems.join('')

  // Calculate total price
  const total = cartItems.reduce((sum, item) => sum + (item.FinalPrice ?? 0), 0)

  // Show total and unhide footer container
  if (cartTotalElem && cartFooter) {
    cartTotalElem.textContent = `Total: $${total.toFixed(2)}`
    cartFooter.classList.remove('hide')
  }
}


function cartItemTemplate(item) {
  const imgSrc = item.Images?.PrimaryMedium || '/images/default-thumb.jpg'
  const name = item.NameWithoutBrand || 'Unknown Product'
  const color = item.Colors?.[0]?.ColorName || 'N/A'
  const finalPrice = item.FinalPrice ?? 0
  const msrp = item.SuggestedRetailPrice ?? null

  let msrpHtml = ''
  let discountHtml = ''

  if (msrp && msrp > finalPrice) {
    const savings = msrp - finalPrice
    const percentOff = Math.round((savings / msrp) * 100)

    msrpHtml = `<p class="cart-card__msrp">$${msrp.toFixed(2)}</p>`
    discountHtml = `<p class="cart-card__discount">
      Save $${savings.toFixed(2)} (${percentOff}% off)
    </p>`
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
  </li>`
}

renderCartContents()
