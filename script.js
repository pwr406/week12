//state - empty variable to contain movies from db.json
let movieLib = []
// variable to hold the row that the movies will be displayed into on HTML
const movieContainer = $('#movieRow')

//page load event to fetch data from db.json/api
window.addEventListener("load", () => { //event listener to get information from db.json when page is loaded - add information to movieLib Variable
    $.get("http://localhost:3000/movies").then((data) => {
        movieLib = data
        renderMovies() //call renderMovies function to display movies
        
    })
})



//function to make the movies that are in the state render to the movie row
function renderMovies() {
    movieContainer.empty(); //clears out the movie container 
    let star = "" // variable to store how many stars the movie should have - may be not needed
    movieContainer.append( //append the following html to movie container or movie row
        movieLib.map(movie => { //iterate through the movieLib array using map.
            if (movie.rating == 1) { //if/else if statements to convert rating into stars !!Probably not needed now unless pulling data from another source - could use stars as value!!
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
            //creating div varible to store the html cards that are being appended to the movie container. adding values in from each movie in movieLib
            const div = $(`
            <div class="col">
            <div class="card m-2" style="width: 18rem;">
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
            div.find("#deleteButton").on("click", (event) => { //using div.find to find the element with id deleteButton
                event.preventDefault() // !!!!!THIS IS NOT WORKING AS IT SHOULD - PAGE STILL RELOADS!!!!!
            deleteMovie(movie.id) // call deleteMovie function and pass in movie.id for a parameter
            })
            div.find("#updateButton").on("click", (event) => { //adding onclick event to element with id updateButton
                event.preventDefault() // !!!!!THIS IS NOT WORKING AS IT SHOULD - PAGE STILL RELOADS!!!!!
            launchModal(movie.id) //call launchModal function, passing in movie.id for parameter
            })
            return div; // returning the div so it shows
          
            
        })
    )
}

//function to delete movies, takes parameter of id
function deleteMovie(id) {
    const indexToDelete = movieLib.findIndex(movie => movie.id === id) // variable to set what index to delete - call back function uses movie for parameter and get's movie.id and then makes sure it is the same as id that is passed.
    movieLib.splice(indexToDelete, 1) //remove id from movieLib(state).
    $.ajax("http://localhost:3000/movies/" + id, {method: "DELETE"}) //remove id from API

    renderMovies() //call renderMovies to repopulate movie row
}

//function to launch the modal 
function launchModal(id) {
    const indexToUpdate = movieLib.findIndex(movie => movie.id === id) //finding what id the movie is to update
    const myModal = new bootstrap.Modal(document.getElementById('updateModal')) //create modal
    const modalBody = $('#modalBody') //set variable to the modal body
    const form =$( // form for the modal
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

    const selectedMovie = movieLib[indexToUpdate]; //create variable to set what movie in the movieLib we are trying to update.
    form.find('#modalMovieName').val(selectedMovie.name); //set form values to what is already in the movieLib state
    form.find('#modalDirector').val(selectedMovie.director);
    form.find('#modalOverview').val(selectedMovie.overview);
    form.find('#modalPoster').val(selectedMovie.poster);
    form.find('#modalRating').val(selectedMovie.rating);

    modalBody.empty().append(form); //empty the modal body and then append the form.
  

    myModal.show() // show the modal
    $('#modalSubmit').on("click", (event) => { //set event listener on modal
    event.preventDefault() // !!!!!THIS IS NOT WORKING AS IT SHOULD - PAGE STILL RELOADS!!!!!
    updateMovie(id) //call updateMovie function
    })
     
}

//function to update a movie 
function updateMovie(id) {
    const myModal = new bootstrap.Modal(document.getElementById('updateModal'));
    const indexToUpdate = movieLib.findIndex(movie => movie.id === id) //index to update
    //if statements to only update if the form value isn't blank !!!THIS MAY NO LONGER BE NEEDED NOW THAT VALUES ARE BEING PASSED INTO FORM!!!!
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

    $.ajax({ //update db.json
        url: "http://localhost:3000/movies/" + id,
        method: "PUT",
        data: movieLib[indexToUpdate],      
    });
   
    renderMovies(); //render the movies 
    
    myModal.hide(); //hide the modal 
}

//turning on event listener for submit button on form 
$('#submit').on('click', function(event) {
    event.preventDefault()
    $.post("http://localhost:3000/movies/", { //put new movie into db.json
      name: $('#movieName').val(),
      director: $('#director').val(),
      overview: $('#overview').val(),
      poster: $('#poster').val(),
      rating: $('#rating').val()
     
      
    })
    renderMovies() //call RenderMovies
  })