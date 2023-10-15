const words = [
    {
        "word": "pocket",
        "hint": "A bag for carrying small things"
    },
    {
        "word": "needle",
        "hint": "A thin & sharp metal pin"
    },
    {
        "word": "expert",
        "hint": "Person with extensive knowledge"
    },
    {
        "word": "statement",
        "hint": "A declaration of something"
    },
    {
        "word": "library",
        "hint": "Place containing collection of books"
    },
    {
        "word": "second",
        "hint": "It comes after first"
    },
    {
        "word": "mobile",
        "hint": "They are also called as movable species"
    },
    {
        "word": "laptop",
        "hint": "A device used to code program"
    },
    {
        "word": "addition",
        "hint": "The process of adding numbers"
    },
    {
        "word": "number",
        "hint": "Math symbols used for counting"
    },
    {
        "word": "apple",
        "hint": "A fruit that is red or green and often used to make pies."
    },
    {
        "word": "banana",
        "hint": "A long, curved fruit that is yellow when ripe."
    },
    {
        "word": "cherry",
        "hint": "A small, round fruit that is typically red or black."
    },
    {
        "word": "orange",
        "hint": "A citrus fruit that is orange in color."
    },
    {
        "word": "grape",
        "hint": "A small, juicy fruit that can be green, red, or purple."
    }
]


const wordText = document.querySelector(".word"),
hintText = document.querySelector(".hint span"),
inputField = document.querySelector("input");
const refreshBtn = document.querySelector(".refresh-word"),
checkBtn = document.querySelector(".check-word");
let correctWord;

const initGame = () =>{
    let randomObj = words[Math.floor(Math.random() * words.length)];
    let wordArray = randomObj.word.split("");
    for(let i = wordArray.length - 1; i > 0; i--){
        let j = Math.floor(Math.random() * (i + 1));
        [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
    }
    wordText.innerText = wordArray.join("");
    hintText.innerText = randomObj.hint;
    correctWord = randomObj.word.toLowerCase();
    inputField.value="";
    inputField.setAttribute("maxlength", correctWord.length);
    console.log(randomObj);
}

const checkword = ()=>{
    let userWord = inputField.value.toLocaleLowerCase();
    if (!userWord) return alert("Please enter a correct word.");
    if(userWord !== correctWord) return alert(`Oops! ${userWord} is not a correct word.`);
    else alert(`Congrats! ${userWord} is a correct word.`);
    initGame();
}


initGame();


refreshBtn.addEventListener("click", initGame);
checkBtn.addEventListener("click", checkword);
