
(function ($) {
  let quizForm = $('#quizForm');
  let buttonDef0 = $("#button0");
  let buttonDef1 = $("#button1");
  let buttonDef2 = $("#button2");
  let buttonDef3 = $("#button3");
  let submitButton = $('#submitQuiz');

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

  //TODO: convert to jQuery
  const nextQuestion = document.getElementById("nextQuestion");
  nextQuestion.hidden = true;


  const youGotIt = document.getElementById("correct");
  youGotIt.hidden = true;


  const youWrong = document.getElementById("wrong");
  youWrong.hidden = true;

  const theCorrectAnswer = document.getElementById("theCorrectAnswer");
  theCorrectAnswer.hidden = true;



  quizForm.submit(function (event) {
    event.preventDefault();


    let selectedIndex;
    for (let i = 0; i < buttons.length; i++) {
      if (buttons[i].is(':checked')) {
        selectedIndex = i;
      }
    }


    //Check if the selectedIndex is a number (must be 0,1,2,3)
    if (theUserIsTryingToSubmitBadData(selectedIndex, aWordIsBeingPlayed, aDefinitionIsBeingPlayed)) {
      window.location = '/quiz/invalidAnswer';

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
      console.log("Correct: " + data.correct);
      console.log("Correct Index: " + data.correctIndex);

      if (theAnswerIsInvalid(data, aWordIsBeingPlayed, aDefinitionIsBeingPlayed)) {
        window.location = '/quiz/invalidAnswer';
      } else {
        if (aWordIsBeingPlayed || aDefinitionIsBeingPlayed) {
          quizVerification(data.correctIndex, selectedIndex);
        }

      }



    });
    quizForm.trigger("reset");

  });

  function theUserIsTryingToSubmitBadData(selectedIndex
    , aWordIsBeingPlayed, aDefinitionIsBeingPlayed
  ) {

    if(!aWordIsBeingPlayed && !aDefinitionIsBeingPlayed){
      return true;
    }

    if(aWordIsBeingPlayed && aDefinitionIsBeingPlayed){
      return true;
    }

    if (selectedIndex == undefined) {
      return true;
    }
    if (typeof selectedIndex !== 'number') {
      return true;
    }
    if (selectedIndex !== 0
      && selectedIndex !== 1
      && selectedIndex !== 2
      && selectedIndex !== 3) {
      return true;
    }

    return false;

  }

  function theAnswerIsInvalid(data) {
    if (!data) {
      //data is an object
      return true;
    }

    if (data.correct == undefined) {
      return true;
    }

    if (typeof data.correctIndex !== 'number') {
      return true;
    }

    if (data.correctIndex !== 0
      && data.correctIndex !== 1
      && data.correctIndex !== 2
      && data.correctIndex !== 3) {
      return true;
    }

    return false;

  }

  function setButtonColors(labelsInOrder, correctInd) {
    for (let i = 0; i < labelsInOrder.length; i++) {
      if (i === correctInd) {
        labelsInOrder[i].css('color', 'green');
        theCorrectAnswer.innerHTML = `The correct answer was ${labelsInOrder[i].html()}`;

      } else {
        labelsInOrder[i].css('color', 'red');

      }
    }

  }

  function quizVerification(correctInd, buttonUserClicked) {

    const label0 = $('label[for="button0"]');
    const label1 = $('label[for="button1"]');
    const label2 = $('label[for="button2"]')
    const label3 = $('label[for="button3"]');

    const labelsInOrder = [label0, label1, label2, label3];

    setButtonColors(labelsInOrder, correctInd);


    if (buttonUserClicked === correctInd) {
      youGotIt.hidden = false;
    } else {
      theCorrectAnswer.hidden = false;
      youWrong.hidden = false;
    }

    nextQuestion.hidden = false;

    //Disable inputs so the user can't submit quiz again
    $("input:radio").attr('disabled', true);
    submitButton.attr('disabled', true);


  }




})(window.jQuery);;