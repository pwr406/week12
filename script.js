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
    const modalBody = $('#modalBody')
    const form =$(
       `<form>
        <div class="col mb-3">
          <label for="movieName" class="form-label">Movie Name</label>
          <input type="text" class="form-control" id="modalMovieName" aria-describedby="movieHelp">
          <div id="movieHelp" class="form-text">Let's find your movie</div>
        </div>
        <div class="col mb-3">
          <label for="director" class="form-label">Director</label>
          <input type="text" class="form-control" id="modalDirector">
        </div>
        <div class="col mb-3">
            <label for="overview" class="form-label">Brief Overview:</label>
            <textarea class="form-control" id="modalOverview" style="height: 100px"></textarea>
          </div>
          <div class="col mb-3">
            <label for="poster" class="form-label">URL of poster</label>
            <input type="text" class="form-control" id="modalPoster" aria-describeby="posterHelp">
            <div id="posterHelp" class="form-text">Please use <a href="https://www.themoviedb.org/"> themoviedb.org</a> to find the link for your movie poster</div>
          </div>  
        <div class="col-10 d-flex align-items-end mb-3">
        <select class="form-select me-3" aria-label="rating" id="modalRating">
            <option selected>Select your rating for the movie</option>
            <option value="1">⭐</option>
            <option value="2">⭐⭐</option>
            <option value="3">⭐⭐⭐</option>
            <option value="4">⭐⭐⭐⭐</option>
            <option value="5">⭐⭐⭐⭐⭐</option>
          </select>
          <button type="submit" class="btn btn-outline-primary" id="modalSubmit">Submit</button>
        </div>
    </form>        
    `)

    const selectedMovie = movieLib[indexToUpdate];
    form.find('#modalMovieName').val(selectedMovie.name);
    form.find('#modalDirector').val(selectedMovie.director);
    form.find('#modalOverview').val(selectedMovie.overview);
    form.find('#modalPoster').val(selectedMovie.poster);
    form.find('#modalRating').val(selectedMovie.rating);

    modalBody.empty().append(form);
  

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