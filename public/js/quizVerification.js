
(function ($) {
  let quizForm = $('#defToWordForm');
  let buttonDef0 = $("#buttonDef0");
  let buttonDef1 = $("#buttonDef1");
  let buttonDef2 = $("#buttonDef2");
  let buttonDef3 = $("#buttonDef3");

  let buttons = [buttonDef0, buttonDef1, buttonDef2, buttonDef3];

  let wordBeingPlayed = $("#wordBeingPlayed").html();
  quizForm.submit(function (event) {
    event.preventDefault();

    quizForm.trigger("reset");

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
      selectedIndex: selectedIndex,
      wordBeingPlayed: wordBeingPlayed
    };

    $.ajax(requestConfig).then(function (data) {
      console.log(data.correct);
      console.log(data.correctIndex);

      quizVerificationToWord(data.correctIndex, selectedIndex);

    });
  });

  function quizVerificationToWord(correctInd, buttonUserClicked) {


    let messageSpace = document.getElementById("messageSpace")
      ;

    const youGotIt = document.createElement("p");
    youGotIt.hidden = true;
    youGotIt.innerHTML = "That's correct! You got it!";

    messageSpace.appendChild(youGotIt);

    const youWrong = document.createElement("p");
    youWrong.hidden = true;

    youWrong.innerHTML = "Sorry, that's incorrect";

    messageSpace.appendChild(youWrong);

    if (correctInd === 0) {
      $('label[for="buttonDef0"]').css('color', 'green');
      $('label[for="buttonDef1"]').css('color', 'red');
      $('label[for="buttonDef2"]').css('color', 'red');
      $('label[for="buttonDef3"]').css('color', 'red');
    } else if (correctInd === 1) {
      $('label[for="buttonDef0"]').css('color', 'red');
      $('label[for="buttonDef1"]').css('color', 'green');
      $('label[for="buttonDef2"]').css('color', 'red');
      $('label[for="buttonDef3"]').css('color', 'red');
    } else if (correctInd === 2) {
      $('label[for="buttonDef0"]').css('color', 'red');
      $('label[for="buttonDef1"]').css('color', 'red');
      $('label[for="buttonDef2"]').css('color', 'green');
      $('label[for="buttonDef3"]').css('color', 'red');
    } else if (correctInd === 3) {
      $('label[for="buttonDef0"]').css('color', 'red');
      $('label[for="buttonDef1"]').css('color', 'red');
      $('label[for="buttonDef2"]').css('color', 'red');
      $('label[for="buttonDef3"]').css('color', 'green');
    }



    if (buttonUserClicked === correctInd) {


      youGotIt.hidden = false;
    } else {


      youWrong.hidden = false;
    }





  }


})(window.jQuery);;