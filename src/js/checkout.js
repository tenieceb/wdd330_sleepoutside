import { loadHeaderFooter } from './utils.mjs'
import CheckoutProcess from './CheckoutProcess.mjs'
import { renderCartContents } from './cart.js'

document.addEventListener('DOMContentLoaded', () => {
  const checkout = new CheckoutProcess('checkoutform')
  const subtotalDisplay = document.getElementById('subtotal')
  const subtotal = checkout.handleSubtotal()
  subtotalDisplay.innerText = `Subtotal: $${subtotal}`
  checkout.initZipListener()
  renderCartContents()

  checkout.form.addEventListener('submit', async (event) => {
    await checkout.checkout(event)
  })
})

loadHeaderFooter()
