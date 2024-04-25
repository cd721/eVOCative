
(function ($) {
  let quizForm = $('#defToWordForm');
  let buttonDef0 = $("#buttonDef0");
  let buttonDef1 = $("#buttonDef1");
  let buttonDef2 = $("#buttonDef2");
  let buttonDef3 = $("#buttonDef3");
  let buttons = [buttonDef0, buttonDef1, buttonDef2, buttonDef3];
  quizForm.submit(function (event) {
    event.preventDefault();

    let selectedIndex;
    for (let i = 0; i < buttons.length; i++) {
      if (buttons[i].is(':checked')) {
        selectedIndex = i;
      }
    }


    //Send data to server for processing so user can't do some hacky stuff on the client side to 
    //mess with their score
    let requestConfig = {
      method: 'POST',
      url: `/quiz/definitionToWord`,
      selectedIndex: selectedIndex
    };

    $.ajax(requestConfig).then(function (data) {
      console.log(data.correct);
      console.log(data.correctIndex);

      quizVerificationToWord(data.correctIndex, selectedIndex);

    });
  });

  function quizVerificationToWord(correctInd, buttonUserClicked) {

    
    let buttonDef0 = document.getElementById("buttonDef0");
    let buttonDef1 = document.getElementById("buttonDef1");
    let buttonDef2 = document.getElementById("buttonDef2");
    let buttonDef3 = document.getElementById("buttonDef3");

    let messageSpace = document.getElementById("messageSpace")
      ;

    const youGotIt = document.createElement("p");
    youGotIt.hidden = true;
    youGotIt.innerHTML = "That's correct! You got it!";
    
    messageSpace.append(youGotIt);

    const youWrong = document.createElement("p");
    youWrong.hidden = true;
    
    youWrong.innerHTML = "Sorry, that's incorrect";
    
    messageSpace.append(youWrong);

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



    if (buttonUserClicked === correctInd) {


      youGotIt.hidden = false;
    } else {


      youWrong.hidden = false;
    }





  }


})(window.jQuery);;