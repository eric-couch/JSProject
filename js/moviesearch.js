const OMDBAPIUrl = "https://www.omdbapi.com/?apikey=";
const OMDBAPIKey = "86c39163";
let SearchTitle = "";
let MoviePoster = "https://img.omdbapi.com/?apikey=86c39163&i="

document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    const button = document.getElementById('searchbtn');
    button.addEventListener('click', (event) => {
        console.log('button clicked');
        (async () => {
            const movies = await getMovies();
            console.log(movies);
            const favMovieList = document.getElementById('favMovieList');
            //favMovieList.firstElementChild.innerHTML = '';
            movies.Search.forEach((movie) => {
                console.log(movie.Title);
                BuildMovieCard(movie);
            });
        })();
    });
});

function BuildMovieCard(movie) {
    const { Title, Year, imdbID, Type, Poster } = movie;
    const movieCard = document.getElementById('movieCard');
    let movieCardClone = movieCard.cloneNode(true);
    movieCardClone.querySelector('#moviePoster').src = MoviePoster + imdbID;
    movieCardClone.querySelector('#cardBody').firstElementChild.innerText = `${Title} (${Year})`;
    let favButton = movieCardClone.querySelector('#favbtn');
    if (favButton != null) {
        movieCardClone.querySelector('#favbtn').addEventListener('click', (event) => {
            UpdateFavoriteMovies(movie);
        });
    }
    //favMovieList.firstElementChild.appendChild(movieCardClone);
    favMovieList.appendChild(movieCardClone);
    movieCardClone.style.display = 'inline';
}

function UpdateFavoriteMovies(movie) {
    let jsonString = localStorage.getItem('favMovieList');
    console.log(jsonString);
        if (jsonString === null) {
            jsonString = '[]';
        }
        let favoriteMovies = JSON.parse(jsonString);
        favoriteMovies.push(movie);
        console.log(favoriteMovies);
        localStorage.setItem('favMovieList', JSON.stringify(favoriteMovies));
}

const getMovies = async () => {
    SearchTitle = document.getElementById('searchTerm').value;
    const searchURL = `${OMDBAPIUrl}${OMDBAPIKey}&s=${SearchTitle}`;
    const response = await fetch(searchURL);
    return await response.json();
  };