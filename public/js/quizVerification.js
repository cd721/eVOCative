
// buttons.forEach(button => button.addEventListener("submit", (event) => {
//   event.preventDefault();
//   quizVerificationToWord()


// }));
function quizVerificationToWord(word, def, correctInd) {
  let buttonDef1 = document.getElementById("buttonDef1");
let buttonDef2 = document.getElementById("buttonDef2");
let buttonDef3 = document.getElementById("buttonDef3");
let buttonDef4 = document.getElementById("buttonDef4");
let buttons = [buttonDef1, buttonDef2, buttonDef3, buttonDef4];
  if (word.definition === def) {
    // do some funny db stuff to update user's averages
  } else {
    // do some other funny stuff to update user's averages
  }

  if (correctInd === 1) {
    buttonDef1.style.color = "green";
    buttonDef2.style.color = "red";
    document.getElementById("buttonDef3").style.color = "red";
    document.getElementById("buttonDef4").style.color = "red";
  } else if (correctInd === 2) {
    buttonDef1.style.color = "red";
    buttonDef2.style.color = "green";
    document.getElementById("buttonDef3").style.color = "red";
    document.getElementById("buttonDef4").style.color = "red";
  } else if (correctInd === 3) {
    buttonDef1.style.color = "red";
    buttonDef2.style.color = "red";
    document.getElementById("buttonDef3").style.color = "green";
    document.getElementById("buttonDef4").style.color = "red";
  } else if (correctInd === 4) {
    buttonDef1.style.color = "red";
    buttonDef2.style.color = "red";
    document.getElementById("buttonDef3").style.color = "red";
    document.getElementById("buttonDef4").style.color = "green";
  }
}


