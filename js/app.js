/*    Tarot Readings TODO:

Add title / logo

Make app documentation w/ gloabl vars & what they do, function names & params, explain each func, list all objects & their properties

Tell user when spread is complete & encourage them to look over their results

Display card position, name, img, and meaning

Update card imgs to be unique on the front

Update card display to show the correct image
   Display the cards reversed / upright

Create imgs for the spreads
   Have the spreads' img appear when its' spread is selected
   Have imgs' cards "fill in" the spread as they are selected by user

Add about / how to use page

Split js file into other smaller files - animation, display / remove, loading info

*/

"use strict";
   // Global Variable Declarations
let deck = [];
let images = [];
let spreads = [];
let selSpread; // Track selected spread
let selCards = []; // Track selected cards
   // Objects
function Card(name, suit, element, astrology, answer, position, id, upright, reversed) {
   this.name = name;
   this.suit = suit;
   this.element = element;
   this.astrology = astrology;
   this.answer = answer;
   this.position = position;
   this.id = id;
   this.upright = upright;
   this.reversed = reversed;
}
function Spread(name, numOfCards, spreadMap) {
   this.name = name;
   this.numOfCards = numOfCards;
   this.spreadMap = spreadMap;
}
function Element(name, zodiac, association, gender, realm, season, direction) {
   this.name = name;
   this.zodiac = zodiac;
   this.association = association;
   this.gender = gender;
   this.realm = realm;
   this.season = season;
   this.direction = direction;
}

/*
   -- ELEMENTS --
*/
async function loadElements() {
   const response = await fetch("res/elements.txt");
   const text = await response.text();
   const elementsInfo = text.split(/\n/);
   let elements = [];

   elementsInfo.forEach(element => {
      // Get element info
      let elementStr = String(element);
      let name = elementStr.slice(0, elementStr.indexOf(" ")).trim();
      let zodiac = elementStr.slice(elementStr.indexOf("A-") + 2, elementStr.indexOf("A-")).trim();
      let association = elementStr.slice(elementStr.indexOf("A-") + 2, elementStr.indexOf("G-")).trim();
      let gender = elementStr.slice(elementStr.indexOf("G-") + 2, elementStr.indexOf("R-")).trim();
      let realm = elementStr.slice(elementStr.indexOf("R-") + 2, elementStr.indexOf("S-")).trim();
      let season = elementStr.slice(elementStr.indexOf("S-") + 2, elementStr.indexOf("D-")).trim();
      let direction = elementStr.slice(elementStr.indexOf("D-") + 2, elementStr.length).trim();

      // Create new element
      let newElement = new Element(name, zodiac, association, gender, realm, season, direction);
      elements.push(newElement);
   });
}

/*
-- SPREADS --
*/
async function loadSpreads() {
   const response = await fetch("res/spreads.txt");
   const text = await response.text();
   const spreadInfo = text.split(/\n/);
   spreads = [];

   spreadInfo.forEach(spread => {
      let spreadMap = new Map();
      spreadMap.clear();
      // Get spread name & number of cards it has
      let spreadStr = String(spread);
      let name = spreadStr.slice(0, spreadStr.indexOf("N-")).trim();
      let numOfCards = Number(spreadStr.slice(spreadStr.indexOf("N-") + 2, spreadStr.indexOf("N-") + 5).trim());
      // Get card representaions
      if (numOfCards > 1) {
         for (let i = 1; i < numOfCards + 1; i++) {
            let cardNum = String(i);
            let representaion = spreadStr.slice(spreadStr.indexOf(i + "-") + 3, spreadStr.indexOf(((i + 1) + "-"))).trim();
            spreadMap.set(cardNum, representaion);
         }
      }
      // Create new spread
      let newSpread = new Spread(name, numOfCards, spreadMap);
      spreads.push(newSpread);
   });
   showSpreads(spreads);
}

function showSpreads(spreads) {
   // Display spread names in select list
   let spreadSelect = document.getElementById
   ("spread-select");
   spreads.forEach(spread => {
      let name = spread.name;
      let option = document.createElement("option");
      option.textContent = name;
      option.value = name;
      spreadSelect.appendChild(option);
   });
}

/*
-- MEANINGS --
*/
async function loadMeanings() {
   const response = await fetch("res/meanings.txt");
   const text = await response.text();
   const meaningsInfo = text.split(/\n/);
   let meanings = [];

   meaningsInfo.forEach(meaning => {
      // Get meanings
      let meaningStr = String(meaning);
      if (meaningStr.length > 10) {
         meanings.push(meaningStr);
      }
   });
   loadDeck(meanings);
}

/*
-- DECK --
*/
async function loadDeck(meanings) {
   const response = await fetch("res/cards.txt");
   const text = await response.text();
   const deckInfo = text.split(/\n/);
   deck = [];
   let suit = "";
   let id = 0;

   deckInfo.forEach(card => {
      // Get suit
      let cardStr = String(card).slice(0, card.indexOf("E-")).trim();
      switch(cardStr) {
         case "Wands":
         case "Pentacles":
         case "Cups":
         case "Swords":
            suit = cardStr;
         break;
         default:
            // Assign meanings
            let meaningStr = meanings[id];
            let upright = meaningStr.slice(0, meaningStr.indexOf("R-")).trim();
            let reversed = meaningStr.slice(meaningStr.indexOf("R-") + 2, meaningStr.length).trim();
            // Assign id
            id++;
            createCard(card, suit, id, upright, reversed);
      }
   });
   updateDeck();
}

function updateDeck() {
   let shuffleID = 0;

   deck.forEach(card => {
      shuffleID++;
      card.shuffleID = shuffleID;

      // Show card imgs if they dont exist already
      if (images.length != 78) {
         showDeck(card);
      }
   });
}

function showDeck(card) {
   let img = document.createElement('img');
      img.src = "res/images/cardBack.png";
      img.id = card.shuffleID;
      img.className = "cardImg";
      img.style.zIndex = card.shuffleID;
         // Event listeners
      // Change images on hover
      img.addEventListener("mouseover", function hoverCard(elem) {
         // Only update card img if clickable is in classList
         let clickable = elem.target.classList.contains('clickable');
         if (clickable) {
            elem.target.src = "res/images/cardHover.png";
         }
      });
      img.addEventListener("mouseleave", function leaveCard(elem) {
         // Only update card img if clicked is not in classList
         let clicked = elem.target.classList.contains('clicked');
         if (!clicked) {
            elem.target.src = "res/images/cardBack.png";
         }
      });
      // Find chosen card in array & call updateCard
      img.addEventListener("click", function getCard(elem) {
         // Only allow user to select clickable cards, if card is not clickable, do nothing
         let clickable = elem.target.classList.contains('clickable');
         if (clickable) {
            // Only allow user to select a card once, for already selected cards, do nothing
            let clicked = elem.target.classList.contains('clicked');
            if (!clicked) {
               let card = deck.find(card => card.shuffleID == elem.target.id);
               let img = elem.target;
               updateCard(card, img);
            }
         }
      });
   document.getElementById('card-container').appendChild(img);
   // Add img to array
   images.push(img);
}

/*
-- CARD --
*/
function createCard(card, suit, id, upright, reversed) {
   let cardStr = String(card);
   // Get name
   let name = cardStr.slice(0, cardStr.indexOf("E-")).trim();
   switch(suit) {
      case "Wands":
      case "Pentacles":
      case "Cups":
      case "Swords":
         name = name + " of " + suit;
   }
   let element = cardStr.slice(cardStr.indexOf("E-") + 2, cardStr.indexOf("A-")).trim();
   let astrology = cardStr.slice(cardStr.indexOf("A-") + 2, cardStr.indexOf("R-")).trim();
   let answer = cardStr.slice(cardStr.indexOf("R-") + 2, cardStr.length).trim();

   // Create new card
   let newCard = new Card(name, suit, element, astrology, answer, "Upright", id, upright, reversed);
   deck.push(newCard);
}

function updateCard(card, img) {
      // Preventions
   // No changing spreads or shuffling mid-session
   toggleSelSpread(false);
   toggleShuffle(false);

      // Update array
   selCards.push(card);
      // Update Img
   // Remove hover effects, show card as selected
   img.classList.remove('clickable');
   img.classList.add('clicked');
   img.src = "res/images/cardSelect.png";

   clearMessage("repP");
   if (selSpread.numOfCards == selCards.length) {
      // Spread complete
      toggleCardClickable(false);
      showSelCards();
   } else {
      // Spread incomplete
      showRepresentaion();
   }
}

/*
-- SHUFFLE --
*/
function shuffle() {
   // Randomize array in-place w/ Durstenfeld shuffle alg
   for (let i = deck.length - 1; i > 0; i--) {
         let j = Math.floor(Math.random() * (i + 1));
         let card = deck[i];
         deck[i] = deck[j];
         deck[j] = card;
         if (Math.round(Math.random()) == 0) {
            card.position = "Reversed";
         } else {
            card.position = "Upright";
         }
   }
   updateDeck();
   animateIn();
}

/*
-- DISPLAY --
*/
function showMessage(message) {
   let container = document.getElementById("spread");
   let msgP = document.createElement("p");
   let msg = document.createTextNode(message);
   msgP.id = "msgP";
   msgP.appendChild(msg);
   container.appendChild(msgP);
}

function clearMessage(id) {
   let container = document.getElementById("spread");
   let element = document.getElementById(id);
   if (container.contains(element)) {
      container.removeChild(element);
   }
}

function showSelectedSpread(spread) {
   // Set selected spread
   selSpread = spread;
   selCards = [];
   let container = document.getElementById("spread");
   let spreadP = document.createElement("p");
   let msg = document.createTextNode(spread.name + " - Choose " + spread.numOfCards);
   spreadP.id = "spreadP";
   spreadP.appendChild(msg);
   container.appendChild(spreadP);

   if (spread.numOfCards > 1) {
      showRepresentaion();
   }
}

function showRepresentaion() {
   let cardsSelected = selCards.length + 1;
   let spreadMap = selSpread.spreadMap;
   let container = document.getElementById("spread");
   let repP = document.createElement("p");
   let msg = document.createTextNode("Card " + cardsSelected + " - " + spreadMap.get(String(cardsSelected)));
   repP.id = "repP";
   repP.appendChild(msg);
   container.appendChild(repP);
}

function showSelCards() {
   selCards.forEach(card => {
         // Get card info
      let position = card.position;
      let name = card.name;
      let answer = card.answer;
      let meaning = card.upright;
      if (card.position == "Reversed") {
         answer = "No";
         meaning = card.reversed;
      }
         // Display current card info
      let container = document.getElementById("card");
      // Name
      let cName = document.createElement("p");
      let nameMsg = document.createTextNode(position + " " + name);
      cName.id = "cName";
      cName.appendChild(nameMsg);
      // Meaning
      let cMeaning = document.createElement("p");
      let meaningMsg = document.createTextNode(meaning);
      cMeaning.id = "cMeaning";
      cMeaning.appendChild(meaningMsg);
      // Display
      container.appendChild(cName);
      container.appendChild(cMeaning);
   });
}

function clearCardInfo() {
   if (selSpread.numOfCards == selCards.length){
      let container = document.getElementById("card");
      for (let i = 1; i < selCards.length + 1; i++) {
         let cName = document.getElementById("cName");
         let cMeaning = document.getElementById("cMeaning");
         container.removeChild(cName);
         container.removeChild(cMeaning);
      }
   }
}

function resetSelCards() {
   selCards = [];

   images.forEach(img => {
      img.classList.remove('clicked');
      img.src = "res/images/cardBack.png";
   });
}

/*
-- TOGGLE BTNs / CARDIMGs --
*/
function toggleReset(state) {
   const btnReset = document.getElementById("reset");
   if (state) {
      btnReset.classList.remove('disabled');
      btnReset.disabled = false;
   } else {
      btnReset.classList.add('disabled');
      btnReset.disabled = true;
   }
}

function toggleShuffle(state) {
   const btnShuffle = document.getElementById("shuffle");
   if (state) {
      btnShuffle.classList.remove('disabled');
      btnShuffle.disabled = false;
   } else {
      btnShuffle.classList.add('disabled');
      btnShuffle.disabled = true;
   }
}

function toggleSelSpread(state) {
   const selSpread = document.getElementById("spread-select");
   if (state) {
      selSpread.classList.remove('disabled');
      selSpread.disabled = false;
   } else {
      selSpread.classList.add('disabled');
      selSpread.disabled = true;
   }
}

function toggleCardClickable(state) {
   if (state) {
      images.forEach(img => {
         img.classList.add('clickable');
      });
   } else {
      images.forEach(img => {
         img.classList.remove('clickable');
      });
   }
}

/*
-- WINDOW ONLOAD --
*/
window.onload = () => {
      // Declare element variables
   const btnReset = document.getElementById("reset");
   const btnShuffle = document.getElementById("shuffle");
   const selSpread = document.getElementById("spread-select");

      // Call starting functions
   loadSpreads();
   loadMeanings();
   toggleShuffle(false);
   toggleReset(false);
      // Display message
   let msg = "Select a spread";
   showMessage(msg);

/* btnShuffle */
   // Shuffle continuosly while button held
   btnShuffle.addEventListener("mousedown", held);
   btnShuffle.addEventListener("mouseup", released);
   btnShuffle.addEventListener("mouseleave", released);
   let holdID = -1;

   function held() {
      if (holdID == -1) {
            // Update vars.
         resetSelCards();
         holdID = setInterval(whileHeld, 10);
            // Toggle funcs.
         toggleReset(false);
         toggleSelSpread(false);
            // Display message
         clearMessage("msgP");
         clearMessage("spreadP");
         clearMessage("repP");
         msg = "Shuffling . . .";
         showMessage(msg);
      }
   }
   async function released() {
      if (holdID != -1) {
            // Reset vars.
         clearInterval(holdID);
         holdID = -1;
            // Call animation
         await new Promise(resolve => setTimeout(() => resolve(animateOut()), 4000));
            // Toggle funcs.
         toggleReset(true);
         toggleCardClickable(true);
            // Clean message displays
         clearMessage("msgP");
            // Display spread
         let spread = selSpread.value;
         spread = spreads.find(spreadItem => spreadItem.name == spread);
         showSelectedSpread(spread);
      }
   }
   function whileHeld() {
      shuffle();
   }

/* btnReset */
   // Reset card order & all displayed info
   btnReset.addEventListener("click", () => {
      var resetConfirm = confirm("Resetting will remove selected cards, are you sure?");
      if (resetConfirm == true) {
            // Reset deck & selected spread / cards
         loadMeanings();
         selSpread.value = "Select Spread";
            // Clean message displays
         clearMessage("msgP");
         clearMessage("spreadP");
         clearMessage("repP");
         clearCardInfo();
         resetSelCards();
            // Display message
         msg = "Select a spread";
         showMessage(msg);
            // Toggle funcs.
         toggleShuffle(false);
         toggleReset(false);
         toggleCardClickable(false);
         toggleSelSpread(true);
      }
   });

/* selSpread */
   // Select spread
   selSpread.addEventListener("change", async () => {
      clearMessage("repP");
      if (selSpread.value != "Select Spread") {
            // Toggle funcs.
         toggleShuffle(true);

         // Set message
         msg = "Shuffle cards as much as you like by holding the button before choosing, or click for fast shuffle";
      } else {
            // Clean message displays
         clearMessage("spreadP");
            // Toggle funcs.
         toggleShuffle(false);
         toggleReset(false);
         toggleCardClickable(false);

         // Set message
         msg = "Select a spread";
      }
      // Display message
      clearMessage("msgP");
      showMessage(msg);
   });
}