let movies = [];
const movieList = document.getElementById("movieList");
const addBtn = document.getElementById("addBtn");

// Load movies from localStorage or JSON
async function init() {
  const stored = localStorage.getItem("movies");

  if (stored) {
    movies = JSON.parse(stored);
  } else {
    const response = await fetch("/src/json/movies.json");
    movies = await response.json();
    saveMovies();
  }

  displayMovies();
}

function saveMovies() {
  localStorage.setItem("movies", JSON.stringify(movies));
}

function displayMovies() {
  movieList.innerHTML = "";

  movies.forEach(movie => {
    const li = document.createElement("li");

    li.innerHTML = `
      <strong>${movie.title}</strong> 
      (${movie.status}) 
      ⭐ ${movie.rating || "N/A"}
      <button data-id="${movie.id}" class="deleteBtn">Delete</button>
    `;

    movieList.appendChild(li);
  });

  addDeleteEvents();
}

function addMovie() {
  const title = document.getElementById("title").value;
  const status = document.getElementById("status").value;
  const rating = document.getElementById("rating").value;

  if (!title) return;

  const newMovie = {
    id: Date.now(),
    title,
    status,
    rating
  };

  movies.push(newMovie);
  saveMovies();
  displayMovies();

  document.getElementById("title").value = "";
  document.getElementById("rating").value = "";
}

function deleteMovie(id) {
  movies = movies.filter(movie => movie.id != id);
  saveMovies();
  displayMovies();
}

function addDeleteEvents() {
  document.querySelectorAll(".deleteBtn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      deleteMovie(e.target.dataset.id);
    });
  });
}

addBtn.addEventListener("click", addMovie);

init();
