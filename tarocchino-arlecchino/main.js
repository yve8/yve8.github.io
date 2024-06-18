const cardNumber = document.getElementById("cardnumber");
const drawBtn = document.getElementById("draw");

/* custom buttons for number input */
const numberNav = document.createElement("div");
numberNav.classList.add("numbernav");
const numberUp = document.createElement("button");
numberUp.classList.add("increment", "plus");
numberUp.textContent = "+";
numberNav.appendChild(numberUp);
const numberDown = document.createElement("button");
numberDown.classList.add("increment", "minus");
numberDown.textContent = "-";
numberNav.appendChild(numberDown);
cardNumber.after(numberNav);

function increment(input, number) {
    // add the given number to the current value of the input
    const newValue = Number(input.value) + number;
    // only increment if it won't put the value past the minimum or maximum
    const max = input.getAttribute("max");
    const min = input.getAttribute("min");
    if (newValue <= max && newValue >= min) {
        input.value = newValue;
    }
}

numberUp.addEventListener("click", () => {increment(cardNumber, 1)});
numberDown.addEventListener("click",() => {increment(cardNumber, -1)});

/* RETRIEVING DATA */
// create variable to store all cards
let deck; 
// get json information
const requestURL = "https://raw.githubusercontent.com/yve8/tarocchino-arlecchino/main/tarocchinoarlecchino.json"
const request = new Request(requestURL);

const getJSON = async url => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    const data = response.json();
    return data;
}

// assign the array from the JSON to the allCards variable
getJSON(requestURL)
.then(data => {deck = data.tarocchinoarlecchino})
.catch(error => console.error(error));

/* CARD READING FUNCTIONS */
const spread = document.querySelector(".spread");
const cardBackSrc = "./images/card-back.PNG";
const cardSlots = document.querySelectorAll(".cardslot");

// function to generate a single random number from 0 to the number of cards in the deck

function randomCardNumber() {
  return Math.floor(Math.random()*(deck.length + 1));
}

// array to store drawn cards
const drawnCards = [];
// 0 for upright, 1 for reversed
const reversalStatus = [];

// first the user clicks a button to "draw" three cards

// function to draw three cards to begin reading
function drawCards(num) {
    // add numbers to the array
    for (i = 0; i < num; i++) {
      // generate a random number
      let newRandomCard = randomCardNumber();
      // as long as that number is already in the array, keep regenerating a random number
      while (drawnCards.indexOf(newRandomCard) !== -1) {
        newRandomCard = randomCardNumber();
      }
      // before adding the number to the array
      drawnCards.push(newRandomCard);
      // pick 0 or 1 to determine if card is upright or reversed
      reversalStatus.push(Math.floor(Math.random()*2));
      // add card slots and make card backs appear in each
      const slot = document.createElement("div");
      slot.classList.add("cardslot");
      slot.dataset.index = i;
      const img = document.createElement("img");
      img.classList.add("cardimg");
      img.setAttribute("src", cardBackSrc);
      slot.appendChild(img);
      spread.appendChild(slot);
      // now the cards are clickable
      slot.addEventListener("click", flipCard);
    }
    
  };
// then the user can flip over each card one by one

function flipCard(e) {
    const slot = e.currentTarget
    // use index to determine which card was flipped
    const index = slot.dataset.index;
    // get the corresponding number from the array
    const cardNumber = drawnCards[index];
    // and then get that card number from the deck
    const myCard = deck[cardNumber];
    // change the image
    const img = slot.querySelector("img");
    img.setAttribute("src", `./images/${myCard.src}`);
    // reversal status and keywords
    const reversal = document.createElement("p");
    reversal.setAttribute("lang", "en");
    reversal.classList.add("reversal");
    const keywords = document.createElement("h3");
    keywords.setAttribute("lang", "fr");
    keywords.classList.add("keywords");
    const synonyms = document.createElement("p");
    synonyms.setAttribute("lang", "en");
    synonyms.classList.add("synonyms");
    // rotate if the card is reversed
    if (reversalStatus[index] == 1) {
        img.style.transform = "rotate(180deg)";
        reversal.textContent = "Reversed";
        keywords.textContent = `${myCard.reversedfr}`;
        synonyms.textContent = `${myCard.reversedsynonyms}`;
    } else {
        reversal.textContent = "Upright";
        keywords.textContent = `${myCard.uprightfr}`;
        synonyms.textContent = `${myCard.uprightsynonyms}`;
    }
    // add text information
    const details = document.createElement("div");
    details.classList.add("details");
    e.currentTarget.appendChild(details);
    // number and title in french
    const titleFR = document.createElement("h2");
    titleFR.setAttribute("lang", "fr");
    titleFR.classList.add("titlefr");
    titleFR.textContent = `${myCard.number}. ${myCard.titlefr}`;
    details.appendChild(titleFR);
    // english title
    const titleEN = document.createElement("p");
    titleEN.setAttribute("lang", "en");
    titleEN.classList.add("titleen");
    titleEN.textContent = `${myCard.titleen}`;
    details.appendChild(titleEN);
    details.appendChild(reversal);
    details.appendChild(keywords);
    details.appendChild(synonyms);
    // remove event listener so function doesn't run on future clicks
    slot.removeEventListener("click", flipCard);
}

// clear the reading before a new one
function clearCards() {
    // empty the arrays
    drawnCards.length = 0;
    reversalStatus.length = 0;
    // remove all content from the slots
    while (spread.firstChild) {
            spread.removeChild(spread.lastChild);
        }
    } 

// draw cards on click
drawBtn.addEventListener("click", () => {
    if (!cardNumber.value) {
        const message = document.createElement("p");
        message.textContent = "Please choose a number of cards."
        spread.appendChild(message);
    } else {
        clearCards();
        drawCards(cardnumber.value);
    }
});
