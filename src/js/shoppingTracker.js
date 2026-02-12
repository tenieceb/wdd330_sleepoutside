class ShoppingItem {
  constructor(id, name, quantity, status) {
    this.id = id;
    this.name = name;
    this.quantity = quantity;
    this.status = status;
  }
}

class ShoppingTracker {
  constructor() {
    this.items = [];
    this.filter = "All";
    this.editId = null;
    this.list = document.getElementById("itemList");
    this.init();
  }

  async init() {
    const stored = localStorage.getItem("shoppingItems");

    if (stored) {
      this.items = JSON.parse(stored);
    } else {
      const res = await fetch("./json/shoppingItems.json");
      this.items = await res.json();
      this.save();
    }

    this.render();
  }

  save() {
    localStorage.setItem("shoppingItems", JSON.stringify(this.items));
  }

  addOrUpdate(name, quantity, status) {
    if (this.editId) {
      const item = this.items.find(i => i.id === this.editId);
      item.name = name;
      item.quantity = quantity;
      item.status = status;
      this.editId = null;
    } else {
      this.items.push(
        new ShoppingItem(Date.now(), name, quantity, status)
      );
    }

    this.save();
    this.render();
  }

  delete(id) {
    this.items = this.items.filter(i => i.id !== id);
    this.save();
    this.render();
  }

  edit(item) {
    document.getElementById("itemName").value = item.name;
    document.getElementById("quantity").value = item.quantity;
    document.getElementById("status").value = item.status;
    this.editId = item.id;
  }

  setFilter(value) {
    this.filter = value;
    this.render();
  }

  render() {
    this.list.innerHTML = "";

    const filtered =
      this.filter === "All"
        ? this.items
        : this.items.filter(i => i.status === this.filter);

    filtered.forEach(item => {
      const li = document.createElement("li");

      li.innerHTML = `
        <div>
          <strong>${item.name}</strong><br>
          Qty: ${item.quantity} | ${item.status}
        </div>
        <div class="actions">
          <button onclick="tracker.edit(${JSON.stringify(item).replace(/"/g, '&quot;')})">Edit</button>
          <button class="delete" onclick="tracker.delete(${item.id})">Delete</button>
        </div>
      `;

      this.list.appendChild(li);
    });
  }
}

const tracker = new ShoppingTracker();

document.getElementById("saveBtn").addEventListener("click", () => {
  const name = document.getElementById("itemName").value.trim();
  const quantity = document.getElementById("quantity").value;
  const status = document.getElementById("status").value;

  if (!name) return;

  tracker.addOrUpdate(name, quantity, status);

  document.getElementById("itemName").value = "";
  document.getElementById("quantity").value = "";
});

window.setFilter = value
