
const BASE_URL = 'http://localhost:3000/films';

// Fetch and display the first movie's details on page load
const loadFirstMovie = () => fetch(`${BASE_URL}/1`).then(res => res.json()).then(showMovieDetails);

// Fetch and display the list of all movies in the menu
const loadMovies = () => {
  fetch(BASE_URL)
    .then(res => res.json())
    .then(movies => {
      const filmList = document.getElementById('films');
      filmList.innerHTML = '';  // Clear placeholder

      movies.forEach(movie => {
        const li = document.createElement('li');
        li.className = 'film item';
        li.innerHTML = `<span>${movie.title}</span> <button class="ui red button" style="margin-left: 10px;">Delete</button>`;
        
        li.querySelector('span').addEventListener('click', () => showMovieDetails(movie)); // Click to show details
        li.querySelector('button').addEventListener('click', (e) => {
          e.stopPropagation();
          deleteMovie(movie.id, li);
        });

        filmList.appendChild(li);
      });
    });
};

// Display movie details in the center panel
const showMovieDetails = (movie) => {
  document.getElementById('poster').src = movie.poster;
  document.getElementById('title').textContent = movie.title;
  document.getElementById('runtime').textContent = `${movie.runtime} minutes`;
  document.getElementById('film-info').textContent = movie.description;
  document.getElementById('showtime').textContent = movie.showtime;

  const availableTickets = movie.capacity - movie.tickets_sold;
  const buyButton = document.getElementById('buy-ticket');
  document.getElementById('ticket-num').textContent = `${availableTickets} remaining tickets`;
  
  buyButton.textContent = availableTickets > 0 ? 'Buy Ticket' : 'Sold Out';
  buyButton.disabled = availableTickets === 0;

  buyButton.onclick = () => availableTickets > 0 && purchaseTicket(movie);
};

// Handle ticket purchase
const purchaseTicket = (movie) => {
  fetch(`${BASE_URL}/${movie.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tickets_sold: movie.tickets_sold + 1 })
  })
  .then(res => res.json())
  .then(showMovieDetails);
};

// Handle movie deletion
const deleteMovie = (id, element) => {
  fetch(`${BASE_URL}/${id}`, { method: 'DELETE' })
    .then(res => res.ok && element.remove());
};

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  loadFirstMovie();
  loadMovies();
});
