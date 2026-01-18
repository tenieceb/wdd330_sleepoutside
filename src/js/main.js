async function loadTents() {
  try {
    const response = await fetch('src/json/tents.json');
    const tents = await response.json();
    
    // IDs of tents currently shown
    const displayTentIds = ['tent1', 'tent2', 'tent3', 'tent4'];
    
    // Filter tents
    const tentsToDisplay = tents.filter(tent => displayTentIds.includes(tent.id));
    
    // Generate HTML
    const container = document.getElementById('tent-container');
    container.innerHTML = tentsToDisplay.map(tent => `
      <div class="tent-card">
        <img src="${tent.image}" alt="${tent.name}">
        <h3>${tent.name}</h3>
        <p class="price">$${tent.price.toFixed(2)}</p>
        <p>${tent.description}</p>
      </div>
    `).join('');
    
  } catch (error) {
    console.error('Error loading tents:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadTents);