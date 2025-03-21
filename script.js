const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwOTlhMWIxMzAyMmNiYmUwNjliNzBiZDkwMzQzNWY2YyIsIm5iZiI6MTc0MDA2MzIzOS41MDU5OTk4LCJzdWIiOiI2N2I3NDIwNzExZmYwMzQwOWVjNDBlMDgiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.AAukO8OZNDYHHIVkJn1jT7RzSKAbxTiY2LPzFuL-otA';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

const options = {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
    }
};

// Fetch data from TMDB
async function fetchMovies(endpoint) {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, options);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

// Create movie card
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    
    const image = document.createElement('img');
    image.src = `${IMAGE_BASE_URL}/w500${movie.poster_path}`;
    image.alt = movie.title;
    
    card.appendChild(image);
    return card;
}

// Set up hero section
async function setupHero() {
    const movies = await fetchMovies('/movie/now_playing');
    if (!movies.length) {
        const hero = document.getElementById('hero');
        hero.innerHTML = `
            <div class="hero-content">
                <h1>Error Loading Content</h1>
                <p>Please make sure you have added a valid TMDB API key to the application.</p>
            </div>
        `;
        return;
    }
    
    const heroMovie = movies[Math.floor(Math.random() * movies.length)];
    
    const hero = document.getElementById('hero');
    hero.style.backgroundImage = `linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 100%), 
                                 url(${IMAGE_BASE_URL}/original${heroMovie.backdrop_path})`;
    
    const heroContent = document.createElement('div');
    heroContent.className = 'hero-content';
    heroContent.innerHTML = `
        <h1>${heroMovie.title}</h1>
        <p>${heroMovie.overview}</p>
        <div class="hero-buttons">
            <button class="hero-button play-button">
                <i class="fas fa-play"></i> Play
            </button>
            <button class="hero-button more-info-button">
                <i class="fas fa-info-circle"></i> More Info
            </button>
        </div>
    `;
    
    hero.appendChild(heroContent);
}

// Populate movie lists
async function populateMovieLists() {
    if (!API_KEY) {
        const sections = document.querySelectorAll('.movie-list');
        sections.forEach(section => {
            section.innerHTML = '<p class="error-message">Please add your TMDB API key to load movies.</p>';
        });
        return;
    }
    // Trending movies
    const trending = await fetchMovies('/trending/movie/week');
    const trendingContainer = document.getElementById('trending');
    trending.forEach(movie => {
        trendingContainer.appendChild(createMovieCard(movie));
    });

    // Top rated movies
    const topRated = await fetchMovies('/movie/top_rated');
    const topRatedContainer = document.getElementById('topRated');
    topRated.forEach(movie => {
        topRatedContainer.appendChild(createMovieCard(movie));
    });

    // Popular movies
    const popular = await fetchMovies('/movie/popular');
    const popularContainer = document.getElementById('popular');
    popular.forEach(movie => {
        popularContainer.appendChild(createMovieCard(movie));
    });
}

// Initialize the application
async function init() {
    await setupHero();
    await populateMovieLists();
}

// Start the app when the page loads
document.addEventListener('DOMContentLoaded', init); 