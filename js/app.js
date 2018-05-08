/*
 * Create a list that holds all of your cards
 */

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
    poor: 6,
    bad: 10
  },
  medium: {
    type: "medium",
    pairs: 8,
    poor: 10,
    bad: 14
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
let pairs = 8;
let stars = 3;
let started;
let moves = 0;
let timer;
let poor;
let bad;
const main = document.querySelector("#main");
const deck = document.querySelector("#deck");
const startScreen = document.querySelector("#startScreen");
const easyBtn = document.querySelector("#easyBtn");
const medBtn = document.querySelector("#medBtn");
const hardBtn = document.querySelector("#hardBtn");
const starsDiv = document.querySelector('.stars');


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
}
medBtn.onclick = () => {
  startScreen.style.display = 'none';
  main.style.display = 'block';
  start(cardData, "medium");
}
hardBtn.onclick = () => {
  startScreen.style.display = 'none';
  main.style.display = 'block';
  start(cardData, "hard");
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
          }
          if (moves > bad) {
            document.querySelector('.bad').style.display ='none';
          }
          return;
        } else if(firstClick.id && !secondClick.id && firstClick.listId !== card.listId) {
          secondClick = card;
          clickedCards.push(card);
          byId.classList.add('open');
          if(secondClick.id && firstClick.id && firstClick.id === secondClick.id) {
            //match
            document.getElementById(`${firstClick.listId}`).classList.add('match');
            document.getElementById(`${secondClick.listId}`).classList.add('match');
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

const start = function (cards, level) {
  gameLevel(level);
  let cardArray = makeCard(cardData, level);
  shuffle(cardArray);
  displayCardsOnBoard(cardArray);
  clickOnCard(cardArray);
  ratings();
}