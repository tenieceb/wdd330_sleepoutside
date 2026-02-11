class Movie {
  constructor(id, title, status, rating) {
    this.id = id;
    this.title = title;
    this.status = status;
    this.rating = rating;
  }
}

class MovieTracker {
  constructor() {
    this.movies = [];
    this.filter = "All";
    this.editId = null;
    this.listElement = document.getElementById("movieList");
    this.init();
  }

  async init() {
    const stored = localStorage.getItem("movies");
    if (stored) {
      this.movies = JSON.parse(stored);
    } else {
      const res = await fetch("/src/json/movies.json");
      this.movies = await res.json();
      this.save();
    }
    this.render();
  }

  save() {
    localStorage.setItem("movies", JSON.stringify(this.movies));
  }

  addOrUpdate(title, status, rating) {
    if (this.editId) {
      const movie = this.movies.find(m => m.id === this.editId);
      movie.title = title;
      movie.status = status;
      movie.rating = rating;
      this.editId = null;
    } else {
      this.movies.push(
        new Movie(Date.now(), title, status, rating)
      );
    }
    this.save();
    this.render();
  }

  delete(id) {
    this.movies = this.movies.filter(m => m.id !== id);
    this.save();
    this.render();
  }

  edit(movie) {
    document.getElementById("title").value = movie.title;
    document.getElementById("status").value = movie.status;
    document.getElementById("rating").value = movie.rating;
    this.editId = movie.id;
  }

  setFilter(value) {
    this.filter = value;
    this.render();
  }

  render() {
    this.listElement.innerHTML = "";

    const filtered =
      this.filter === "All"
        ? this.movies
        : this.movies.filter(m => m.status === this.filter);

    filtered.forEach(movie => {
      const li = document.createElement("li");

      li.innerHTML = `
        <div class="movie-info">
          <strong>${movie.title}</strong><br>
          ${movie.status} | ⭐ ${movie.rating || "N/A"}
        </div>
        <div class="actions">
          <button onclick="tracker.edit(${JSON.stringify(movie).replace(/"/g, '&quot;')})">Edit</button>
          <button class="delete" onclick="tracker.delete(${movie.id})">Delete</button>
        </div>
      `;

      this.listElement.appendChild(li);
    });
  }
}

const tracker = new MovieTracker();

document.getElementById("addBtn").addEventListener("click", () => {
  const title = document.getElementById("title").value.trim();
  const status = document.getElementById("status").value;
  const rating = document.getElementById("rating").value;

  if (!title) return;

  tracker.addOrUpdate(title, status, rating);

  document.getElementById("title").value = "";
  document.getElementById("rating").value = "";
});

window.setFilter = (value) => tracker.setFilter(value);
