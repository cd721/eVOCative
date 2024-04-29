
(function ($) {
  let quizForm = $('#quizForm');
  let buttonDef0 = $("#button0");
  let buttonDef1 = $("#button1");
  let buttonDef2 = $("#button2");
  let buttonDef3 = $("#button3");

  let buttons = [buttonDef0, buttonDef1, buttonDef2, buttonDef3];

  let wordBeingPlayed = $("#wordBeingPlayed");
  let definitionBeingPlayed = $("#definitionBeingPlayed");
  
  if (wordBeingPlayed) {
    wordBeingPlayed = wordBeingPlayed.html();
  } else if (definitionBeingPlayed) {
    definitionBeingPlayed = definitionBeingPlayed.html();
  }

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
    let requestConfig;
    if (wordBeingPlayed) {
       requestConfig = {
        method: 'POST',
        url: `/quiz/definitionToWord`,
        selectedIndex: selectedIndex,
        wordBeingPlayed: wordBeingPlayed,
      };
    } else if (definitionBeingPlayed) {
       requestConfig = {
        method: 'POST',
        url: `/quiz/wordToDefinition`,
        selectedIndex: selectedIndex,
        definitionBeingPlayed: definitionBeingPlayed
      };
    }

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