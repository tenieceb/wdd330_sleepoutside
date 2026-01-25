const baseURL =
  import.meta.env?.VITE_SERVER_URL ||
  'https://byui-cse.github.io/cse341-course/';

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Bad Response');
  }
}

export default class ProductData {
  constructor(baseURLParam) {
    this.baseURL = baseURLParam || baseURL;
  }

  async getData(category) {
    const response = await fetch(
      `${this.baseURL}products/search/${category}`
    );
    const data = await convertToJson(response);
    return data.Result;
  }

  async findProductById(id) {
    const response = await fetch(`${this.baseURL}product/${id}`);
    if (!response.ok) {
      throw new Error(`Product with id ${id} not found`);
    }
    const product = await convertToJson(response);
    return product.Result;
  }
}