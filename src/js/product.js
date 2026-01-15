import { setLocalStorage } from './utils.mjs'
import ProductData from './ProductData.mjs'

const dataSource = new ProductData('tents')

function addProductToCart(product) {
  let cart = getLocalStorage('cart')

  if (!Array.isArray(cart)) {
    cart = []
  }

  cart.push(product)

  setLocalStorage('cart', cart)
}

function getLocalStorage(key) {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : null
}

function setLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}
// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id)
  addProductToCart(product)
}

// add listener to Add to Cart button
document.getElementById('addToCart').addEventListener('click', addToCartHandler)
