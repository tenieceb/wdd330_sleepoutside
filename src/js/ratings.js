document.addEventListener("DOMContentLoaded", () => {
  const ratings = document.querySelectorAll(".rating");

  ratings.forEach(ratingDiv => {
    const ratingValue = parseInt(ratingDiv.dataset.rating);

    for (let i = 1; i <= 5; i++) {
      const star = document.createElement("span");
      star.innerHTML = "★";

      if (i <= ratingValue) {
        star.classList.add("star");
      }

      ratingDiv.appendChild(star);
    }
  });
});
