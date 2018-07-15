/*
 * Create a list that holds all of your cards
 */


//cards data
const cardData = [
  { id:'airpod', img: "img/airpod.png" },
  { id:'drums', img: "img/drums.png" },
  { id:'guitar', img: "img/guitar.png" },
  { id:'headphone', img: "img/headphone.png" },
  { id:'mic', img: "img/mic.png" },
  { id:'mic2', img: "img/mic2.png" },
  { id:'note', img: "img/note.png" },
  { id:'player', img: "img/player.png" },
  { id:'piano', img: "img/piano.png" },
  { id:'set', img: "img/set.png" },
  { id:'speaker', img: "img/speaker.png" },
  { id:'tape', img: "img/tape.png" }
];

// an object for 3 seperate game level
const levels = {
  easy: {
    type: "easy",
    pairs: 6,
    poor: 10,
    bad: 14
  },
  medium: {
    type: "medium",
    pairs: 8,
    poor: 14,
    bad: 18
  },
  hard: {
    type: "hard",
    pairs: 12,
    poor: 16,
    bad: 24
  }
};

// main variables
let firstClick = {};
let secondClick = {};
let clickedCards = [];
let matchedCards = [];
let pairs = 8;
let stars = 3;
let started;
let moves = 0;
let timer = new Timer();
let poor;
let bad;
const main = document.querySelector("#main");
const deck = document.querySelector("#deck");
const startScreen = document.querySelector("#startScreen");
const easyBtn = document.querySelector("#easyBtn");
const medBtn = document.querySelector("#medBtn");
const hardBtn = document.querySelector("#hardBtn");
const starsDiv = document.querySelector('.stars');
const pauseDiv = `<div class="paused"> <span>Game Paused !</span></div>`;

// a constructor card object include main card options for every cards.
class Card {
  constructor(card, num) {
    this.id = card.id;
    this.listId = `${this.id}-${num}`;
    this.img = card.img;
    this.markup = `<li class="card" id="${this.listId}">
      <img src="${this.img}" class="card-img" >
    </li>`;

  }
}


//3 buttons for game level, which one clicked it will send level information and size of card array
easyBtn.onclick = () => {
  startScreen.style.display = 'none';
  main.style.display = 'block';
  start(cardData, "easy");
  startTimer();
}
medBtn.onclick = () => {
  startScreen.style.display = 'none';
  main.style.display = 'block';
  start(cardData, "medium");
  startTimer();
}
hardBtn.onclick = () => {
  startScreen.style.display = 'none';
  main.style.display = 'block';
  start(cardData, "hard");
  startTimer();
}

// this fn take the level of game and will set the level option from levels object
const gameLevel = function (level) {
  pairs = levels[level].pairs;
  poor = levels[level].poor;
  bad = levels[level].bad;
  deck.classList.remove("easy", "medium", "hard");
  deck.classList.add(levels[level].type);
}


const trimArray = array => {
  let newArray = array.slice();
  // trim array as needed
  while (newArray.length > pairs) {
    let randomIndex = Math.floor(Math.random() * newArray.length);
    newArray.splice(randomIndex, 1);
  }
  return newArray;
};

// it will take card data and level and will send to trimArray fn to make cards array trim.
// then take it back inside trimmedArray
// then lastly it will make 2 instance of a card for each card using Card constructor. And it will put them in cardsArr
const makeCard = function(data, level) {
  const cardsArr = [];

  let trimmedArr = trimArray(data, level);

  trimmedArr.forEach(card => {
    cardsArr.push(new Card(card, 1));
    cardsArr.push(new Card(card, 2));
  });

  return cardsArr;
}

// creating deck using markup inside Card constructor
const displayCardsOnBoard = function(cardsArr) {
  cardsArr.forEach(card => {
    document.getElementById('deck').innerHTML += card.markup;
  });
  document.getElementById('deck').innerHTML += pauseDiv;
}

// creating markup for level stars
const ratings = function() {
  let starIcons = `<li>
    <i class="fa fa-star"></i>
  </li>
  <li class="bad">
    <i class="fa fa-star"></i>
  </li>
  <li class="poor">
    <i class="fa fa-star"></i>
  </li>`;

  starsDiv.innerHTML = starIcons;

}

// starting timer
const startTimer = function() {
  timer.start();
  timer.addEventListener('secondsUpdated', function (e) {
    document.getElementById('timer').textContent = timer.getTimeValues().toString();
  });
}


const clickOnCard = function(cardsArr) {
  // loop in cardsArr
  cardsArr.forEach(card => {
    let clickedOne = document.querySelector(`#${card.listId}`);

    // when a card clicked
    clickedOne.onclick = function clickCardEvent() {
      //check if clickedCards array length < 2
      // because clicked cards will push in this array as seperate objects as for checking if they are same or not
      // after that clickedCards will empty for new check
      if(clickedCards.length < 2) {
        // keep this clicked card
        let byId = document.getElementById(`${card.listId}`);


        if(!firstClick.id) { //if there is no firstclick object in clickedCards
          // make it clicked card object
          firstClick = card;
          // push it to clicked card array
          clickedCards.push(card);
          // add it open class for open the card
          byId.classList.add('open');
          // add 1 to moves counter
          moves++;
          document.querySelector('.moves').textContent = moves;

          //this is for checking game level and moves for how many stars you will have
          if (moves > poor )  {
            document.querySelector('.poor').style.display ='none';
            stars = 2;
          }
          if (moves > bad) {
            document.querySelector('.bad').style.display ='none';
            stars = 1;
          }
          return;
        } else if(firstClick.id && !secondClick.id && firstClick.listId !== card.listId) { //if there is firstclick obj and if there is no secondClick object in clickedCards - its for second click

          // make it second clicked card object
          secondClick = card;
          // push it to clicked card array
          clickedCards.push(card);
          // add it open class for open the card
          byId.classList.add('open');


          if(secondClick.id && firstClick.id && firstClick.id === secondClick.id) { // if two cards are same call match fn
            //match
            match();
          } else if (secondClick.id && firstClick.id &&  firstClick.id !== secondClick.id) { // if two cards are not same same call unmatch fn
            //unmatch
            unmatch();
          }

          //if two cards are same
          function match() {
            // push two objects into matchedcards arr
            matchedCards.push(secondClick, firstClick);
            // add match class of them for make them green
            document.getElementById(`${firstClick.listId}`).classList.add('match');
            document.getElementById(`${secondClick.listId}`).classList.add('match');
            //make them not clickable
            this.onclick = null;

            // check if the cards arr and matched arr lengts are same for finish the game.
            // if same, finish game.
            if(cardsArr.length == matchedCards.length) {
              gameOver();
            }

            // if clickedCards has two object then make it and objects empty for new check
            if(clickedCards.length === 2) {
              clickedCards = [];
            }
            firstClick = {};
            secondClick = {};
          }

          //if two cards not same
          function unmatch() {
            // add them unmatch class for make them red.
            document.getElementById(`${firstClick.listId}`).classList.add('unmatch');
            document.getElementById(`${secondClick.listId}`).classList.add('unmatch');

              // after 700ms close the cards
              setTimeout(() => {
                document.getElementById(`${firstClick.listId}`).classList.remove('open', 'unmatch');
                document.getElementById(`${secondClick.listId}`).classList.remove('open', 'unmatch');
                firstClick = {};
                secondClick = {};
                if(clickedCards.length === 2) {
                  clickedCards = [];
                }
              }, 700);
          }
        }
      }
    };
  });

}

// Shuffle function from http://stackoverflow.com/a/2450976
const shuffle = function (array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

//when click restart button call restart fn
document.querySelector('.restart').addEventListener('click', function(e) {
  restart();
});
//when click pause button call pause fn
document.querySelector('.pause').addEventListener('click', function(e) {
  pause();
});
//when click continue button call continueGame fn
document.querySelector('.continue').addEventListener('click', function(e) {
  continueGame();
});
//when click new game button call pickLevel fn for picking new game level
document.querySelector('.new-game').addEventListener('click', function(e) {
  pickLevel();
});


// to make timer pause, and show paused text on deck
const pause = function () {
  timer.pause();
  document.querySelector('.pause').style.display = 'none';
  document.querySelector('.continue').style.display = 'block';
  document.querySelector('.paused').style.display = 'block';
}

// continue timer and game
const continueGame = function () {
  timer.start();
  document.querySelector('.pause').style.display = 'block';
  document.querySelector('.continue').style.display = 'none';
  document.querySelector('.paused').style.display = 'none';
}

// to restart game. it will open a modal and ask for check if you want to really restart game.
const restart = function () {
  timer.pause();
  vex.dialog.confirm({
    message: `Do you want to restart the game ?`,
    callback: function (value) {
      if(value) {
        timer.stop();
        document.querySelector('.pause').style.display = 'block';
        document.querySelector('.continue').style.display = 'none';
        pickLevel();
      } else {
        timer.start();
      }
    }
  });
}

// when the game over it will stop timer
// it will take end time to show in modal
// it will open modal and show to player stats and it will ask for start a new game
const gameOver = function () {
  timer.stop();
  document.querySelector('.pause').style.display = 'none';
  document.querySelector('.continue').style.display = 'none';
  document.querySelector('.restart').style.display = 'none';
  document.querySelector('.new-game').style.display = 'block';
  let endTime = document.getElementById('timer').textContent;
  vex.dialog.confirm({
    message: `Congrats! You just won the game with ${moves} moves and ${stars}/3 star rating. Your finish time is ${endTime}. Do you want to play again?`,
    callback: function (value) {
      if(value) {
        pickLevel();
      }
    }
  });
}


// this is for choosing level screen. some cleaning options for restart game or new game.
const pickLevel = function  () {
  startScreen.style.display = 'block';
  main.style.display = 'none';
  cardsArr = [];
  deck.innerHTML = "";
  moves = 0;
  stars = 3;
  document.querySelector('.moves').textContent = 'No';
  firstClick = {};
  secondClick = {};
  clickedCards = [];
  matchedCards = [];
  document.getElementById('timer').textContent = "00:00:00";
  document.querySelector('.pause').style.display = 'block';
  document.querySelector('.new-game').style.display = 'none';
  document.querySelector('.restart').style.display = 'block';
}

// starting game
const start = function (cards, level) {
  gameLevel(level);
  let cardArray = makeCard(cardData, level);
  shuffle(cardArray);
  displayCardsOnBoard(cardArray);
  clickOnCard(cardArray);
  ratings();
}

window.onload = function() {
  pickLevel();
  vex.defaultOptions.className = 'vex-theme-flat-attack';
  vex.dialog.buttons.YES.text = 'Yes!';
  vex.dialog.buttons.NO.text = 'No';
}



