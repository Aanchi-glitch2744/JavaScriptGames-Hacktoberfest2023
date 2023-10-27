const cards = document.querySelectorAll('.card');

let matched = 0;
let card1, card2;
let disableDeck = false; // user can interact with the cards 

function flipCard ({target: clickedCard}) {
  // a card is clicked -> flip it
  if (card1 !== clickedCard && !disableDeck) {  // here we're comparing elements not images
    clickedCard.classList.add("flip"); // flip only if 0 or 1 cards are opened i.e., disableDeck = false
    // if its the first card of pair
    if(!card1) { 
      return card1 = clickedCard;
    }
    // else we compare
    card2 = clickedCard;
    disableDeck = true; // while we match user can't flip anymore cards
    let card1Img = card1.querySelector(".back-view img").src;
    let card2Img = card2.querySelector(".back-view img").src;
    matchCards(card1Img, card2Img); // here we're comparing the images
  }
}


function matchCards(img1, img2) {
  if (img1 === img2) { // cards match
    matched++;
    if(matched == 8) {
      setTimeout(() => {
          return shuffleCard();
      }, 1000);
    }
    card1.removeEventListener("click", flipCard);
    card2.removeEventListener("click", flipCard);
    card1 = card2 = "";
    return disableDeck = false;
  }

  // add shake animation
  setTimeout(()=> {
    card1.classList.add("shake");
    card2.classList.add("shake");
  }, 400)

  setTimeout(() =>{
    card1.classList.remove("shake", "flip");
    card2.classList.remove("shake", "flip");
    card1 = card2 = "";
    disableDeck = false;
  }, 1000)
}

// shuffle the cards before the game starts

function shuffleCard() {
  matched = 0;
  card1 = card2 = "";
  disableDeck = false;
  let arr = [1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8];
  arr.sort(()=> Math.random() > 0.5 ? 1 : -1);
  cards.forEach((card, i) => {
    card.classList.remove("flip");
    let imgtg = card.querySelector(".back-view img");
    imgtg.src = `images/img-${arr[i]}.png`;
    card.addEventListener("click", flipCard);
  })
}
  
shuffleCard();

// on click cards should flip 

cards.forEach((card)=>{
  card.addEventListener("click", flipCard);
})

 
