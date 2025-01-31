const OMDBAPIUrl = "https://www.omdbapi.com/?apikey=";
const OMDBAPIKey = "86c39163";
let SearchTitle = "";
let MoviePoster = "https://img.omdbapi.com/?apikey=86c39163&i="

document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    LoadMovies();
});

function LoadMovies() {
    let jsonString = localStorage.getItem('favMovieList');
    console.log(jsonString);
    if (jsonString != null) {
        let favoriteMovies = JSON.parse(jsonString);
        favoriteMovies.forEach ((movie) => {
            (async () => {
                const movieDetails = await getMovie(movie.imdbID);
                BuildMovieCard(movieDetails);
            })();
        });
    }
}

function BuildMovieCard(movie) {
    const { Title, Year, imdbID, Genre, Plot, Ratings } = movie;
    const movieCard = document.getElementById('movieCard');
    let movieCardClone = movieCard.cloneNode(true);
    movieCardClone.querySelector('#moviePoster').src = MoviePoster + imdbID;
    let cardBody = movieCardClone.querySelector('#cardBody');
    cardBody.firstElementChild.innerText = `${Title} (${Year})`;
    let genre = cardBody.querySelector('#genre');
    genre.innerText = `Genre: ${Genre}`;
    genre.style.fontWeight = 'bold';
    let plot = cardBody.querySelector('#plot');
    plot.innerText = `Plot: ${Plot}`;
    let favButton = movieCardClone.querySelector('#favbtn');
    if (favButton != null) {
        movieCardClone.querySelector('#favbtn').addEventListener('click', (event) => {
            UpdateFavoriteMovies(movie);
        });
    }
    //favMovieList.firstElementChild.appendChild(movieCardClone);
    let removeButton = cardBody.querySelector('#removeMovie');
    if (removeButton != null) {
        removeButton.addEventListener('click', () => {
            RemoveMovie(movie);
        });
    }
    favMovieList.appendChild(movieCardClone);
    movieCardClone.style.display = 'inline';
}

function RemoveMovie(movie) {
    let favMovieList = document.getElementById('favMovieList');
    favMovieList.innerHTML = '';
    let jsonString = localStorage.getItem('favMovieList');
    console.log(jsonString);
    if (jsonString != null) {
        let favoriteMovies = JSON.parse(jsonString);
        let index = favoriteMovies.findIndex((favMovie) => favMovie.imdbID == movie.imdbID);
        if (index > -1) {
            favoriteMovies.splice(index, 1);
            localStorage.setItem('favMovieList', JSON.stringify(favoriteMovies));
            location.reload();
        }
    }
}

const getMovie = async (imdbId) => {
    const movieDetailsURL = `${OMDBAPIUrl}${OMDBAPIKey}&i=${imdbId}`;
    const response = await fetch(movieDetailsURL);
    return await response.json();
  };