//state - empty variable to contain movies from db.json
let movieLib = []

//page load event to fetch data from db.json/api
window.addEventListener("load", () => {
    $.get("http://localhost:3000/movies").then((data) => {
        movieLib = data
        renderMovies()
        
    })
})

const movieContainer = $('#movieRow')

function renderMovies() {
    movieContainer.empty();
    let star = ""
    movieContainer.append(
        movieLib.map(movie => {
            if (movie.rating == 1) {
                star = "⭐"
            } else if (movie.rating == 2){
                star = "⭐⭐"
            } else if (movie.rating == 3) {
                star ="⭐⭐⭐"
            }else if (movie.rating == 4) {
                star ="⭐⭐⭐⭐"
            }else if (movie.rating == 5){
                star ="⭐⭐⭐⭐⭐"
            } else {
                star = ""
            }
            const div = $(`
            <div class="col">
            <div class="card m-2" style="width: 18rem;">
                <!-- <div class="card-img-container" style="background-image: url('images/Sample.jpg');"></div> -->
                <img src="${movie.poster}" class="card-img-top" alt="Movie Image">
                <div class="card-body">
                  <h5 class="card-title" id="movieTitle">${movie.name}</h5>
                  <p class="card-text" id="description"><b>Overview:</b> ${movie.overview}</p>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item" id="movieDirector"><b>Director:</b> ${movie.director}</li>
                  <li class="list-group-item" id="movieRating"><b>Rating:</b> ${star}</li>
                </ul>
                <button class="btn btn-outline-success my-1" id="updateButton">Update</button> 
                <button class="btn btn-outline-danger" id="deleteButton">Delete</button> 
              </div>
            </div>
            `)
            div.find("#deleteButton").on("click", () => 
            deleteMovie(movie.id))
            div.find("#updateButton").on("click", () =>
            launchModal(movie.id))
            return div;

            
        })
    )
}

function deleteMovie(id) {
    const indexToDelete = movieLib.findIndex(movie => movie.id === id)
    movieLib.splice(indexToDelete, 1)
    $.ajax("http://localhost:3000/movies/" + id, {method: "DELETE"})

    renderMovies()
}

function launchModal(id) {
    const indexToUpdate = movieLib.findIndex(movie => movie.id === id)
    const myModal = new bootstrap.Modal(document.getElementById('updateModal'))
    myModal.show()
    $('#modalSubmit').on("click", (event) => { 
    event.preventDefault()
    updateMovie(id)
    })
     
}

function updateMovie(id) {
    const myModal = new bootstrap.Modal(document.getElementById('updateModal'));
    const indexToUpdate = movieLib.findIndex(movie => movie.id === id)
    if ($('#modalMovieName').val() !== ""){
        movieLib[indexToUpdate].name = $('#modalMovieName').val()
    }
    if ($('#modalDirector').val() !== ""){
        movieLib[indexToUpdate].director = $('#modalDirector').val()
    }
    if ($('#modalOverview').val() !== "") {
        movieLib[indexToUpdate].overview = $('#modalOverview').val()
    }
    if ($('#modalPoster').val() !== "") {
        movieLib[indexToUpdate].poster = $('#modalPoster').val()
    }
    if ($('#modalRating').val() !== "") {
        movieLib[indexToUpdate].rating = $('#modalRating').val()
    }

    $.ajax({
        url: "http://localhost:3000/movies/" + id,
        method: "PUT",
        data: movieLib[indexToUpdate],      
    });
   
    renderMovies();
    
    myModal.hide();
}


$('#submit').on('click', function() {
    $.post("http://localhost:3000/movies/", {
      name: $('#movieName').val(),
      director: $('#director').val(),
      overview: $('#overview').val(),
      poster: $('#poster').val(),
      rating: $('#rating').val()
     
      
    })
    renderMovies()
  })