var express = require('express');
var router = express.Router();

// array that holds the games
let serverGameArray = [];

// game object (holds all the information for game)
let gameObject = function(pName, pDev, pYear, pReview, pGenre){
    this.name = pName;
    this.dev = pDev;
    this.year = pYear;
    this.review = pReview;
    this.genre = pGenre;
    this.id = -1;
}

// examples to be pushed
serverGameArray.push(new gameObject("Granblue Fantasy", "Cygames", "2014", "This game is great!", "Role Playing"));
serverGameArray.push(new gameObject("Donkey Kong", "Nintendo", "1981", "A classic!", "Misc."));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html');
});

router.get('/getAllGames', function(req, res) {
  res.status(200).json(serverGameArray);
});

module.exports = router;
