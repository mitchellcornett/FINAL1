let express = require('express');
let router = express.Router();
let fs = require("fs");

// array that holds the games
let serverGameArray = [];

// game object (holds all the information for game)
let gameObject = function(pName, pDev, pYear, pReview, pGenre){
    this.name = pName;
    this.dev = pDev;
    this.year = pYear;
    this.review = pReview;
    this.genre = pGenre;
    this.id = Math.floor(Math.random() * 1000000);
}

let fileManager = {
  read: function() {
  let rawData = fs.readFileSync('objectdata.json');
  let goodData = JSON.parse(rawData);
  serverGameArray = goodData;
  },

  write: function() {
    let data = JSON.stringify(serverGameArray);
    fs.writeFileSync('objectdata.json', data);
  },

  validData: function() {
    let rawData = fs.readFileSync('objectdata.json');
    if(rawData.length < 1) {
      return false;
    }
    else {
      return true;
    }
  }
};

// examples to be pushed
if(!fileManager.validData()) {
  serverGameArray.push(new gameObject("Granblue Fantasy", "Cygames", "2014", "This game is great!", "Role Playing"));
  serverGameArray.push(new gameObject("Donkey Kong", "Nintendo", "1981", "A classic!", "Misc."));
  fileManager.write();
}
else {
  fileManager.read();
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html');
});

/* Get all games */
router.get('/getAllGames', function(req, res) {
  fileManager.read();
  res.status(200).json(serverGameArray);
});

/* Add one new game */
router.post('/addGame', function(req, res){
  const newReview = req.body;
  serverGameArray.push(newReview);
  fileManager.write();
  res.status(200).json(newReview);
});

// deletes a game
router.delete('/DeleteGame/:ID', (req, res) => {
  const delID = req.params.ID;
  let pointer = GetObjectPointer(delID);
  if(pointer == -1){
    console.log("not found");
    return res.status(500).json({
      status: "error - no such ID"
    });
  }
  else {
    serverGameArray.splice(pointer, 1);
    fileManager.write();
    res.send('Movie with ID: ' + delID + ' deleted!');
}
});

function GetObjectPointer(whichID){
  for(i=0; i< serverGameArray.length; i++){
      if(serverGameArray[i].id == whichID){
          return i;
      }
  }
  return -1;
}

module.exports = router;
