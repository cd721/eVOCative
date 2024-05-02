
(function ($) {
  let quizForm = $('#quizForm');
  let buttonDef0 = $("#button0");
  let buttonDef1 = $("#button1");
  let buttonDef2 = $("#button2");
  let buttonDef3 = $("#button3");

  let buttons = [buttonDef0, buttonDef1, buttonDef2, buttonDef3];

  let wordBeingPlayed = $("#wordBeingPlayed");
  let definitionBeingPlayed = $("#definitionBeingPlayed");

  let aWordIsBeingPlayed;
  let aDefinitionIsBeingPlayed;


  if (wordBeingPlayed.html()) {
    wordBeingPlayed = wordBeingPlayed.html();
    aWordIsBeingPlayed = true;
    aDefinitionIsBeingPlayed = false;
  } else if (definitionBeingPlayed.html()) {
    definitionBeingPlayed = definitionBeingPlayed.html();
    aWordIsBeingPlayed = false;
    aDefinitionIsBeingPlayed = true;
  }

  const nextQuestion = document.getElementById("nextQuestion");
  nextQuestion.hidden = true;


  const youGotIt = document.getElementById("correct");
  youGotIt.hidden = true;


  const youWrong = document.getElementById("wrong");
  youWrong.hidden = true;



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
    let requestConfig;
    if (aWordIsBeingPlayed) {
      requestConfig = {
        method: 'POST',
        url: `/quiz/definitionToWord`, contentType: 'application/json',
        data: JSON.stringify({
          selectedIndex: selectedIndex,
          wordBeingPlayed: wordBeingPlayed
        })

      };
    } else if (aDefinitionIsBeingPlayed) {
      requestConfig = {
        method: 'POST',
        url: `/quiz/wordToDefinition`, contentType: 'application/json',
        data: JSON.stringify({
          selectedIndex: selectedIndex,
          definitionBeingPlayed: definitionBeingPlayed
        })

      };
    }

    $.ajax(requestConfig).then(function (data) {
      console.log(data.correct);
      console.log(data.correctIndex);

      quizVerificationToWord(data.correctIndex, selectedIndex);

    });
    quizForm.trigger("reset");

  });

  function quizVerificationToWord(correctInd, buttonUserClicked) {




    if (correctInd === 0) {
      $('label[for="button0"]').css('color', 'green');
      $('label[for="button1"]').css('color', 'red');
      $('label[for="button2"]').css('color', 'red');
      $('label[for="button3"]').css('color', 'red');
    } else if (correctInd === 1) {
      $('label[for="button0"]').css('color', 'red');
      $('label[for="button1"]').css('color', 'green');
      $('label[for="button2"]').css('color', 'red');
      $('label[for="button3"]').css('color', 'red');
    } else if (correctInd === 2) {
      $('label[for="button0"]').css('color', 'red');
      $('label[for="button1"]').css('color', 'red');
      $('label[for="button2"]').css('color', 'green');
      $('label[for="button3"]').css('color', 'red');
    } else if (correctInd === 3) {
      $('label[for="button0"]').css('color', 'red');
      $('label[for="button1"]').css('color', 'red');
      $('label[for="button2"]').css('color', 'red');
      $('label[for="button3"]').css('color', 'green');
    }



    if (buttonUserClicked === correctInd) {


      youGotIt.hidden = false;
    } else {


      youWrong.hidden = false;
    }

    nextQuestion.hidden = false;




  }


})(window.jQuery);;