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


let firstClick = [];
let secondClick = [];
let pairs = 8;
let stars = 3;
let matches;
let started;
let moves = 0;
let timer;
let poor;
let bad;

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

const trimArray = array => {
  let newArray = array.slice();
  // trim array as needed
  while (newArray.length > pairs) {
    let randomIndex = Math.floor(Math.random() * newArray.length);
    newArray.splice(randomIndex, 1);
  }
  return newArray;
};

const makeCard = function(data) {
  const cardsArr = [];

  let trimmedArr = trimArray(data);

  trimmedArr.forEach(card => {
    cardsArr.push(new Card(card, 1));
    cardsArr.push(new Card(card, 2));
  });

  return cardsArr;
}

const displayCardsOnBoard = function(cardsArr) {
  cardsArr.forEach(card => {
    document.getElementById('deck').innerHTML += card.markup;

    document.getElementById('deck').addEventListener('click', function(e) {
      if(e.target && e.target.matches(`#${card.listId}`)) {

        checkMatches(card);
      }
    });

  });
}

const checkMatches = function(card) {
  console.log(card);
  let byId = document.getElementById(`${card.listId}`);

  if(!firstClick.id) {
    firstClick = card;
    byId.classList.add('open');
    moves++;
    document.querySelector('.moves').textContent = moves;
    return;
  } else if(!secondClick.id && firstClick.listId !== card.listId) {
    secondClick = card;
    byId.classList.add('open');

  }


  if(secondClick.id && firstClick.id !== secondClick.id) {
    unmatch();
  } else {
    match();
    // matches++;
    // if(matches === pairs) {
    //   finishGame();
    // }
  }
}

const match = function() {
  document.getElementById(`${firstClick.listId}`).classList.add('match');
  document.getElementById(`${secondClick.listId}`).classList.add('match');
  firstClick = {};
  secondClick = {};
}
const unmatch = function() {
  document.getElementById(`${firstClick.listId}`).classList.add('unmatch');
    document.getElementById(`${secondClick.listId}`).classList.add('unmatch');
    setTimeout(() => {
      document.getElementById(`${firstClick.listId}`).classList.remove('open');
      document.getElementById(`${secondClick.listId}`).classList.remove('open');
      document.getElementById(`${firstClick.listId}`).classList.remove('unmatch');
      document.getElementById(`${secondClick.listId}`).classList.remove('unmatch');
      firstClick = {};
      secondClick = {};
    }, 1000);
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



const start = function (cards) {
  let cardArray = makeCard(cardData);
  shuffle(cardArray);
  displayCardsOnBoard(cardArray);
}

start(cardData);