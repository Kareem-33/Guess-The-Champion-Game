let tries = 5;
let currentTry = 1;

// prettier-ignore
// Random Words
let words = ["Aatrox","Ahri","Akali","Akshan","Alistar","Amumu","Anivia","Annie","Aphelios","Ashe","Aurelion Sol","Aurora","Azir","Bard","Bel'Veth","Blitzcrank","Brand","Braum","Briar","Caitlyn","Camille","Cassiopeia","Cho'Gath","Corki","Darius","Diana","Dr. Mundo","Draven","Ekko","Elise","Evelynn","Ezreal","Fiddlesticks","Fiora","Fizz","Galio","Gangplank","Garen","Gnar","Gragas","Graves","Gwen","Hecarim","Heimerdinger","Hwei","Illaoi","Irelia","Ivern","Janna","Jarvan IV","Jax","Jayce","Jhin","Jinx","K'Sante","Kai'Sa","Kalista","Karma","Karthus","Kassadin","Katarina","Kayle","Kayn","Kennen","Kha'Zix","Kindred","Kled","Kog'Maw","LeBlanc","Lee Sin","Leona","Lillia","Lissandra","Lucian","Lulu","Lux","Malphite","Malzahar","Maokai","Master Yi","Milio","Miss Fortune","Mordekaiser","Morgana","Naafiri","Nami","Nasus","Nautilus","Neeko","Nidalee","Nilah","Nocturne","Nunu & Willump","Olaf","Orianna","Ornn","Pantheon","Poppy","Pyke","Qiyana","Quinn","Rakan","Rammus","Rek'Sai","Rell","Renata Glasc","Renekton","Rengar","Riven","Rumble","Ryze","Samira","Sejuani","Senna","Seraphine","Sett","Shaco","Shen","Shyvana","Singed","Sion","Sivir","Skarner","Smolder","Sona","Soraka","Swain","Sylas","Syndra","Tahm Kench","Taliyah","Talon","Taric","Teemo","Thresh","Tristana","Trundle","Tryndamere","Twisted Fate","Twitch","Udyr","Urgot","Varus","Vayne","Veigar","Vel'Koz","Vex","Vi","Viego","Viktor","Vladimir","Volibear","Warwick","Wukong","Xayah","Xerath","Xin Zhao","Yasuo","Yone","Yorick","Yuumi","Zac","Zed","Zeri","Ziggs","Zilean","Zoe","Zyra"];

let word = words[Math.floor(Math.random() * words.length)].toUpperCase();
let chars = word.length;
// let chars = 6;
let hints = 1;
if (chars > 3 && chars < 6) {
  hints = 2;
}
else if (chars > 5 && chars < 11) {
  hints = 3;
}
else if (chars > 10) {
  hints = 4;
}
console.log(word);

function generateInputs() {
  let triesDiv = document.querySelector("section .game .tries");
  let hintsCount = document.querySelector("section .rules .hintCount span");
  // Generate the tries divs
  for (let i = 1; i <= tries; i++) {
    let tryDiv = document.createElement("div");
    tryDiv.classList.add(`try-${i}`);
    if (i != currentTry) tryDiv.classList.add("disabled-inputs");
    let tryNum = document.createElement("p");
    tryNum.textContent = `Try ${i}`;
    tryDiv.append(tryNum);
    // Generate the input fields
    for (let j = 1; j <= chars; j++) {
      let inputField = document.createElement("input");
      inputField.type = "text";
      inputField.maxLength = 1;
      inputField.classList.add(`try-${i}-letter-${j}`);
      tryDiv.append(inputField);
    }
    triesDiv.append(tryDiv);
  }

  // disable other inputs
  let disabledInputs = document.querySelectorAll(".disabled-inputs input");
  disabledInputs.forEach((e) => (e.disabled = true));

  // handle navigation
  let inputs = document.querySelectorAll("input");
  inputs[0].focus();
  inputs.forEach((input, index) => {
    input.addEventListener("input", (e) => {
      input.value = input.value.toUpperCase();
      if (input.value.length == 1) {
        if (index < inputs.length) inputs[index + 1].focus();
      }
    });
    input.addEventListener("keydown", (e) => {
      if (e.key == "ArrowLeft") {
        if (index > 0) inputs[index - 1].focus();
      } else if (e.key == "ArrowRight") {
        if (index < inputs.length) inputs[index + 1].focus();
      } else if (e.key == "Backspace") {
        input.value = "";
        if (index > 0) inputs[index - 1].focus();
      }
      else if(e.key == "Enter"){
        checking();
      }
    });
  });

  hintsCount.innerHTML = hints;
}

// Handle Checking
let buttons = document.querySelectorAll(".buttons button");
let checkBtn = document.querySelector(".buttons button.check");
let hintBtn = document.querySelector(".buttons button.hint");
function checking(){
  let successGuess = true;
  for(let i = 1; i <= chars; i++){
    const currentInput = document.querySelector(`.try-${currentTry}-letter-${i}`);
    const currentChar = currentInput.value.toUpperCase();
    const actualLetter = word[i-1];
    if(currentChar == actualLetter){
      currentInput.classList.add("in-place");
    }
    else if(word.includes(currentChar) && currentChar != ""){
      currentInput.classList.add("not-in-place");
      successGuess = false;
    }
    else{
      currentInput.classList.add("wrong");
      successGuess = false;
    }
  }

  let playAgain = document.querySelector(".again");
  let resultDiv = document.querySelector(".rules div.result");
  if(successGuess){
    let allTries = document.querySelectorAll(".tries > div");
    allTries.forEach((tryDiv) => tryDiv.classList.add("disabled-inputs"));
    buttons.forEach(btn => btn.disabled = true);
    resultDiv.innerHTML = `You Won! The Champion Is <span>${word}</span>`;
    resultDiv.style.display = "block";
    playAgain.style.display = "block";
  }
  else{
    document.querySelector(`.try-${currentTry}`).classList.add("disabled-inputs");
    let currentInputs = document.querySelectorAll(`.try-${currentTry} input`);
    currentInputs.forEach(input => input.disabled = true);

    currentTry++;

    let nextTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
    nextTryInputs.forEach((input) => (input.disabled = false));

    let nextTry = document.querySelector(`.try-${currentTry}`);
    if(nextTry){
      nextTry.classList.remove("disabled-inputs");
      nextTryInputs[0].focus();
    }
    else {
      buttons.forEach(btn => btn.disabled = true);
      resultDiv.innerHTML = `You Lost The Champion Is <span>${word}</span>`;
      resultDiv.style.display = "block";
      playAgain.style.display = "block";
    }
  }
}

function doHint(){
  if(hints > 0){
    hints--;
    document.querySelector("section .rules .hintCount span").innerHTML = hints;
    const enabledInputs = document.querySelectorAll("input:not([disabled])");
    const emptyEnabledInputs = Array.from(enabledInputs).filter((input) => input.value === "");
    if(emptyEnabledInputs.length > 0){
      let randIndex = Math.floor(Math.random() * emptyEnabledInputs.length);
      let randInput = emptyEnabledInputs[randIndex];
      let indexToFill = Array.from(enabledInputs).indexOf(randInput);
      if(indexToFill != -1) randInput.value = word[indexToFill];
    }
  }
  if (hints === 0) {
    hintBtn.disabled = true;
  }
}

let playAgain = document.querySelector(".again");
let dontKnowBtn = document.querySelector(".dont-know");
hintBtn.addEventListener("click", doHint);
checkBtn.addEventListener("click", checking);
dontKnowBtn.addEventListener("click", function(){
  location.reload();
});
playAgain.addEventListener("click", function(){
  location.reload();
});
window.onload = function () {
  generateInputs();
};
