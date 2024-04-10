function quizVerificationToWord(word, def, correctInd) {
  if (word.definition === def) {
    // do some funny db stuff to update user's averages
  } else {
    // do some other funny stuff to update user's averages
  }

  if (correctInd === 1) {
    document.getElementById("buttonDef1").style.color = "green";
    document.getElementById("buttonDef2").style.color = "red";
    document.getElementById("buttonDef3").style.color = "red";
    document.getElementById("buttonDef4").style.color = "red";
  } else if (correctInd === 2) {
    document.getElementById("buttonDef1").style.color = "red";
    document.getElementById("buttonDef2").style.color = "green";
    document.getElementById("buttonDef3").style.color = "red";
    document.getElementById("buttonDef4").style.color = "red";
  } else if (correctInd === 3) {
    document.getElementById("buttonDef1").style.color = "red";
    document.getElementById("buttonDef2").style.color = "red";
    document.getElementById("buttonDef3").style.color = "green";
    document.getElementById("buttonDef4").style.color = "red";
  } else if (correctInd === 4) {
    document.getElementById("buttonDef1").style.color = "red";
    document.getElementById("buttonDef2").style.color = "red";
    document.getElementById("buttonDef3").style.color = "red";
    document.getElementById("buttonDef4").style.color = "green";
  }
}
