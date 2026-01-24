import ProductData from './ProductData.mjs'
import ProductList from './ProductList.mjs'
import { loadHeaderFooter, getParam, qs } from './utils.mjs'

loadHeaderFooter()

const category = getParam('category')
// first create an instance of the ProductData class.
const dataSource = new ProductData()
// then get the element you want the product list to render in
const listElement = document.querySelector('.product-list')
// then create an instance of the ProductList class and send it the correct information.
const myList = new ProductList(category, dataSource, listElement)
// finally call the init method to show the products
myList.init()

// set the category title
const capitalizedCategory = category
  ? category.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  : ''
qs('.title.highlight').textContent = capitalizedCategory
