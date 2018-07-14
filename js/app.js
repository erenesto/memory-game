/*
 * Create a list that holds all of your cards
 */

// window.onload = function(){
//   document.getElementById('modalBtn').click();
// }

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

const gameLevel = function (level) {
  pairs = levels[level].pairs;
  poor = levels[level].poor;
  bad = levels[level].bad;
  deck.classList.remove("easy", "medium", "hard");
  deck.classList.add(levels[level].type);
}

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

const trimArray = array => {
  let newArray = array.slice();
  // trim array as needed
  while (newArray.length > pairs) {
    let randomIndex = Math.floor(Math.random() * newArray.length);
    newArray.splice(randomIndex, 1);
  }
  return newArray;
};

const makeCard = function(data, level) {
  const cardsArr = [];

  let trimmedArr = trimArray(data, level);

  trimmedArr.forEach(card => {
    cardsArr.push(new Card(card, 1));
    cardsArr.push(new Card(card, 2));
  });

  return cardsArr;
}

const displayCardsOnBoard = function(cardsArr) {
  cardsArr.forEach(card => {
    document.getElementById('deck').innerHTML += card.markup;
  });
  document.getElementById('deck').innerHTML += pauseDiv;
}

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

const startTimer = function() {
  timer.start();
  timer.addEventListener('secondsUpdated', function (e) {
    document.getElementById('timer').textContent = timer.getTimeValues().toString();
  });
}

const clickOnCard = function(cardsArr) {
  cardsArr.forEach(card => {
    let clickedOne = document.querySelector(`#${card.listId}`);

    clickedOne.onclick = function clickCardEvent() {
      if(clickedCards.length < 2) {
        let byId = document.getElementById(`${card.listId}`);
        if(!firstClick.id) {
          firstClick = card;
          clickedCards.push(card);
          byId.classList.add('open');
          moves++;
          document.querySelector('.moves').textContent = moves;
          if (moves > poor )  {
            document.querySelector('.poor').style.display ='none';
            stars = 2;
          }
          if (moves > bad) {
            document.querySelector('.bad').style.display ='none';
            stars = 1;
          }
          console.log(stars);
          return;
        } else if(firstClick.id && !secondClick.id && firstClick.listId !== card.listId) {
          secondClick = card;
          clickedCards.push(card);
          byId.classList.add('open');
          if(secondClick.id && firstClick.id && firstClick.id === secondClick.id) {
            //match
            matchedCards.push(secondClick, firstClick);
            document.getElementById(`${firstClick.listId}`).classList.add('match');
            document.getElementById(`${secondClick.listId}`).classList.add('match');

            if(cardsArr.length == matchedCards.length) {
              gameOver();
            }

            console.log(cardsArr);
            console.log(matchedCards);

            this.onclick = null;
            if(clickedCards.length === 2) {
              clickedCards = [];
            }
            firstClick = {};
            secondClick = {};
          } else if (secondClick.id && firstClick.id &&  firstClick.id !== secondClick.id) {
            //unmatch
            document.getElementById(`${firstClick.listId}`).classList.add('unmatch');
            document.getElementById(`${secondClick.listId}`).classList.add('unmatch');
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

document.querySelector('.restart').addEventListener('click', function(e) {
  restart();
});

document.querySelector('.pause').addEventListener('click', function(e) {
  pause();
});
document.querySelector('.continue').addEventListener('click', function(e) {
  continueGame();
});
document.querySelector('.new-game').addEventListener('click', function(e) {
  pickLevel();
});

const pause = function () {
  timer.pause();
  document.querySelector('.pause').style.display = 'none';
  document.querySelector('.continue').style.display = 'block';
  document.querySelector('.paused').style.display = 'block';
}

const continueGame = function () {
  timer.start();
  document.querySelector('.pause').style.display = 'block';
  document.querySelector('.continue').style.display = 'none';
  document.querySelector('.paused').style.display = 'none';
}

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

const gameOver = function () {
  timer.stop();
  document.querySelector('.pause').style.display = 'none';
  document.querySelector('.continue').style.display = 'none';
  document.querySelector('.restart').style.display = 'none';
  document.querySelector('.new-game').style.display = 'block';
  vex.dialog.confirm({
    message: `Congrats! You just won the game with ${moves} moves and ${stars}/3 star rating. Do you want to play again?`,
    callback: function (value) {
      if(value) {
        pickLevel();
      }
    }
  });
}

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



