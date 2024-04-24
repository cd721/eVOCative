
// buttons.forEach(button => button.addEventListener("submit", (event) => {
//   event.preventDefault();
//   quizVerificationToWord()


// }));
function quizVerificationToWord(word, def, correctInd) {
  let buttonDef0 = document.getElementById("buttonDef1");
  let buttonDef1 = document.getElementById("buttonDef2");
  let buttonDef2 = document.getElementById("buttonDef3");
  let buttonDef3 = document.getElementById("buttonDef4");
  let buttons = [buttonDef0, buttonDef1, buttonDef2, buttonDef3];
  if (word.definition === def) {
    // do some funny db stuff to update user's averages
  } else {
    // do some other funny stuff to update user's averages
  }

  if (correctInd === 0) {
    buttonDef0.style.color = "green";
    buttonDef1.style.color = "red";
    buttonDef2.style.color = "red";
    buttonDef3.style.color = "red";
  } else if (correctInd === 1) {
    buttonDef0.style.color = "red";
    buttonDef1.style.color = "green";
    buttonDef2.style.color = "red";
    buttonDef3.style.color = "red";
  } else if (correctInd === 2) {
    buttonDef0.style.color = "red";
    buttonDef1.style.color = "red";
    buttonDef2.style.color = "green";
    buttonDef3.style.color = "red";
  } else if (correctInd === 3) {
    buttonDef0.style.color = "red";
    buttonDef1.style.color = "red";
    buttonDef2.style.color = "red";
    buttonDef3.style.color = "green";
  }

  const youGotIt = document.createElement("p");
  youGotIt.innerHTML = "That's correct! You got it!";

  const youWrong = document.createElement("p");

  youGotIt.innerHTML = "Sorry, that's incorrect";


  document.append(youGotIt);
  document.append(youWrong);

}


