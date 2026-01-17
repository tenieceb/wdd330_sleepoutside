//Purpose:generate a list of product cards in HTML from an array.
import { renderListWithTemplate } from './utils.mjs';

function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="product_pages/?product=${product.Id}">
      <img src="${product.image}" alt="Image of ${product.NameWithoutBrand}">
      <h2 class="card__brand">${product.Brand.Name}</h2>
      <h3 class="card__name">${product.NameWithoutBrand}</h3>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`
}

export default class ProductList {
    constructor(category, dataSource, listElement) {
        // You passed in this information to make the class as reusable as possible.
        // Being able to define these things when you use the class will make it very flexible
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
    }
    async init() {
        // use the datasource to get the list of products. getProductsByCategory will return a promise! use await or .then() to process it
        const products = await this.dataSource.getData();
        // the products are needed before rendering the HTML
        this.renderProductList(products);
    }

  renderProductList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }
}
