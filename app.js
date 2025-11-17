// ✅ BASIC LEVEL JAVASCRIPT CODE (No advanced syntax)

const apiKey = "615669f94b3595f3426493eeb1f34607";
const imageBaseUrl = "https://image.tmdb.org/t/p/w342";

// Get references from HTML
const searchBtn = document.getElementById("searchBtn");
const movieInput = document.getElementById("movieInput");
const resultsSection = document.getElementById("resultsSection");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const movieDetails = document.getElementById("movieDetails");
const recs = document.getElementById("recs");
const similar = document.getElementById("similar");
const recHeading = document.getElementById("recHeading");
const simHeading = document.getElementById("simHeading");

searchBtn.addEventListener("click", function () {
  const query = movieInput.value.trim();
  if (query === "") return;

  resultsSection.style.display = "block";
  loading.style.display = "block";
  error.innerText = "";
  movieDetails.innerHTML = "";
  recs.innerHTML = "";
  similar.innerHTML = "";
  recHeading.style.display = "none";
  simHeading.style.display = "none";

  const url =
    "https://api.themoviedb.org/3/search/movie?api_key=" +
    apiKey +
    "&query=" +
    encodeURIComponent(query);

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      loading.style.display = "none";

      if (!data.results || data.results.length === 0) {
        error.innerText = "Movie not found.";
        return;
      }

      const movie = data.results[0];
      const title = movie.title;
      const year = movie.release_date ? movie.release_date.slice(0, 4) : "N/A";
      const overview = movie.overview || "No overview available.";
      const poster = movie.poster_path
        ? imageBaseUrl + movie.poster_path
        : "https://via.placeholder.com/300x450?text=No+Image";

      movieDetails.innerHTML =
        '<img src="' +
        poster +
        '" alt="' +
        title +
        '" />' +
        '<div class="meta">' +
        '<h2>' +
        title +
        " (" +
        year +
        ")</h2>" +
        "<p>" +
        overview +
        "</p></div>";

      fetchRecommendations(movie.id);
      fetchSimilar(movie.id);
    })
    .catch(function (err) {
      loading.style.display = "none";
      error.innerText = "Something went wrong.";
      console.error(err);
    });
});

function fetchRecommendations(id) {
  const url =
    "https://api.themoviedb.org/3/movie/" +
    id +
    "/recommendations?api_key=" +
    apiKey;

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.results && data.results.length > 0) {
        recHeading.style.display = "block";
        data.results.slice(0, 6).forEach(function (movie) {
          recs.innerHTML += createCard(movie);
        });
      }
    });
}

function fetchSimilar(id) {
  const url =
    "https://api.themoviedb.org/3/movie/" + id + "/similar?api_key=" + apiKey;

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.results && data.results.length > 0) {
        simHeading.style.display = "block";
        data.results.slice(0, 6).forEach(function (movie) {
          similar.innerHTML += createCard(movie);
        });
      }
    });
}

function createCard(movie) {
  const poster = movie.poster_path
    ? imageBaseUrl + movie.poster_path
    : "https://via.placeholder.com/300x450?text=No+Image";
  const title = movie.title || "Untitled";
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "N/A";

  return (
    '<div class="card">' +
    '<img src="' +
    poster +
    '" alt="' +
    title +
    '" />' +
    '<div class="title">' +
    title +
    '</div><div class="year">' +
    year +
    "</div></div>"
  );
}