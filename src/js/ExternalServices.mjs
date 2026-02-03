export default class ExternalServices {
    constructor(category) {
    this.category = category;
    this.path = `../json/${this.category}.json`;
  }
  getData() {
    return fetch(this.path)
      .then(convertToJson)
      .then((data) => data);
  }
  async findProductById(id) {
    const products = await this.getData();
    return products.find((item) => item.Id === id);
  }
}
export async function submitOrder(order) {
  const response = await fetch(
    "http://wdd330-backend.onrender.com/checkout",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(order)
    }
  );

  async function convertToJson(res) {
  const jsonResponse = await res.json();

  if (res.ok) {
    return jsonResponse;
  } else {
    // send server error details forward
    throw {
      name: 'servicesError',
      message: jsonResponse
    };
  }
}

  if (!response.ok) {
    throw new Error("Order submission failed");
  }

  return await response.json();
}

