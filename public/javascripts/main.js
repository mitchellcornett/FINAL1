// array that holds the games
let gameArray = [];

// game object (holds all the information for game)
let gameObject = function(pName, pDev, pYear, pReview, pGenre){
    this.name = pName;
    this.dev = pDev;
    this.year = pYear;
    this.review = pReview;
    this.genre = pGenre;
    this.id = Math.floor(Math.random() * 1000000);
}

// examples to be pushed
// gameArray.push(new gameObject("Granblue Fantasy", "Cygames", "2014", "This game is great!", "Role Playing"));
// gameArray.push(new gameObject("Donkey Kong", "Nintendo", "1981", "A classic!", "Misc."));

// code runs when dom is loaded
document.addEventListener("DOMContentLoaded", function (event) {
    
    // assign html elements to javascript variables
    let gameName = document.getElementById("gameName");
    let gameDev = document.getElementById("gameDev");
    let gameYear = document.getElementById("gameYear");
    let gameReview = document.getElementById("gameReview");
    let selectGenre = "";
    
    // creates the list on the list page of the html
    createList();

    // called whenever the add button is pressed
    document.getElementById("addButton").addEventListener("click", function(){
        
        // pushes a new game to the game array
        let newReview = new gameObject(gameName.value, gameDev.value, gameYear.value, gameReview.value, selectGenre);
        gameArray.push(newReview);

        // clears the values of the forms in the html form
        gameName.value = "";
        gameDev.value = "";
        gameYear.value = "";
        gameReview.value = "";

        // Send to server
        $.ajax({
            url: "/addGame",
            type: "POST",
            data: JSON.stringify(newReview),
            contentType:"application/json; charset=utf-8",
            success: function (result) {
                console.log(result);
                document.location.href = "index.html#list";
            },
            error: function (xhr, textStatus, errorThrown) {  
                alert(`Server could not add review: ` + newReview.name);
                alert(textStatus + " " + errorThrown);
            }
        });

        // recreates the list in the list page of the html
        createList();
    });

    // called when delete button is pressed
    document.getElementById("deleteButton").addEventListener("click", function () {
        let gameID = localStorage.getItem('id');
        $.ajax({
            type: "DELETE",
            url: "/DeleteGame/" +gameID,
            success: function(result){
                alert(result);
            },
            error: function (xhr, textStatus, errorThrown) { 
                alert("Server could not delete game with ID " + gameID)
            } 
        });
            
    });

    // changes the selectGenre varialbe to whatever the value is of the select-genre tag is in the html
    $(document).bind("change", "#select-genre", function (event, ui) {
        selectGenre = document.getElementById("select-genre").value;
    });

    // loads the content from the game array to the details page
    $(document).on("pagebeforeshow", "#details", function (event){
        let localID = localStorage.getItem('id');

        $.get("/getAllGames", function(data, status){
            gameArray = data;

            let index = gameArray.findIndex(function(x){return x.id.toString() === localID});

            // if a user goes straight into this page without something in local storage it will hang, so this is to send them to the home page
            if (localID === null){
                document.location.href = "index.html#home"
            } else {
                document.getElementById("gameDetailsName").innerHTML = `Title: ${gameArray[index].name}`
                document.getElementById("gameDetailsDeveloper").innerHTML = `Developer: ${gameArray[index].dev}`
                document.getElementById("gameDetailsYear").innerHTML = `Released: ${gameArray[index].year}`
                document.getElementById("gameDetailsGenre").innerHTML = `Genre: ${gameArray[index].genre}`
                document.getElementById("gameDetailsReview").innerHTML = `Review: ${gameArray[index].review}`
            }
        });
    });

});

function createList(){
    // clears the list in the list page of the html
    let gameList = document.getElementById("gameList");
    gameList.innerHTML = "";

    $.get("/getAllGames", function(data, status){
        gameArray = data;
    

    // for every element in the array, create an li element and append it to the ul
    for (let i = 0; i < gameArray.length; i++){
        let listElement = document.createElement('li');
        listElement.innerHTML = `(${gameArray[i].id}) ${gameArray[i].name} - ${gameArray[i].dev}: ${gameArray[i].year} [${gameArray[i].genre}]`
        listElement.addEventListener('click', function() {
            localStorage.setItem('id', gameArray[i].id);
            document.location.href = "index.html#details"
        });
        gameList.appendChild(listElement);
    }
    });
};