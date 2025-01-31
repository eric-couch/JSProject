const OMDBAPIUrl = "https://www.omdbapi.com/?apikey=";
const OMDBAPIKey = "86c39163";
let SearchTitle = "";
let MoviePoster = "https://img.omdbapi.com/?apikey=86c39163&i="
let curPage = 1;
let totalPages = 1;

document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    const button = document.getElementById('searchbtn');
    button.addEventListener('click', (event) => {
        console.log('button clicked');
        (async () => {
            await UpdatePage();
        })();
    });
    const prevButton = document.getElementById('prevBtn');
    prevButton.addEventListener('click', (event) => {
        console.log('prev button clicked');
        
        if (curPage > 1 && totalPages > 1) {
            curPage--;
            (async () => {
                await UpdatePage();
            })();
        }
    });
    const nextButton = document.getElementById('nextBtn');
    nextButton.addEventListener('click', (event) => {
        console.log('next button clicked');
        
        if (curPage < totalPages) {
            curPage++;
            (async () => {
                await UpdatePage();
            })();
        }
    });
});

function UpdateNavBar(totalResults) {
    console.log(`updating nav bar with total: ${totalResults}`);
    const navBar = document.querySelector('#searchListNav');
    const navBarPrev = navBar.querySelector('#pages');
    navBarPrev.innerText = `Page ${curPage} of ${parseInt(totalResults/10)}`;
    navBar.style.visibility = 'visible';
}

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
    movieCardClone.style.display = 'grid';
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

const UpdatePage = async () => {
    const movies = await getMovies(curPage);
    console.log(movies);
    const favMovieList = document.getElementById('favMovieList');
    favMovieList.innerHTML = '';
    const totalResults = movies.totalResults;
    totalPages = parseInt(totalResults/10);
    movies.Search.forEach((movie) => {
        console.log(movie.Title);
        BuildMovieCard(movie);
    });
    UpdateNavBar(totalResults);
};

const getMovies = async (curPage) => {
    SearchTitle = document.getElementById('searchTerm').value;
    const searchURL = `${OMDBAPIUrl}${OMDBAPIKey}&s=${SearchTitle}&page=${curPage}`;
    const response = await fetch(searchURL);
    return await response.json();
  };