// The purpose of this file is to verify that all fields are filled out before submitting a new comment

const form = document.getElementById("submit-comment");

if (form) {
  form.addEventListener("submit", function (event) {
    function displayError(elementId, errorText) {
      // elements MUST HAVE FORMAT 'error_<input_name>' in html else this won't work!
      // well it doesn't have to, but it makes it easier
      const element = document.getElementById(`error_${elementId}`);
      element.textContent = errorText;

      // makes the input border red, delete this if it's too much red
      const input = document.getElementById(`${elementId}`);
      input.style.border = "1px solid red";
    }

    function resetErrors() {
      elements = document.querySelectorAll(".error_text");
      for (let i = 0; i < elements.length; i++) {
        elements[i].textContent = "";
      }

      // clears the red border, if any
      const inputs = document.querySelectorAll("input");
      for (let i = 0; i < inputs.length; i++) {
        inputs[i].style.border = "";
      }
    }

    resetErrors();
    let valid = true;

    // Get all the input fields
    var commentInput = document
      .querySelector('textarea[name="comment"]')
      .value.trim();

    try {
      validateGen("Comment", commentInput);
      if (commentInput.length > 250) throw `Error: Comment must be less than 250 characters.`;
    } catch (e) {
      displayError("comment", e);
      valid = false;
    }

    if (!valid) {
      event.preventDefault();
    }
  });
}

// helpers

function validateGen(label, input) {
  if (!input) throw `${label} must be provided!`;
  if (typeof input !== "string") throw `${label} must be of type string!`;
  input = input.trim();
  if (input.length === 0) throw `${label} cannot be empty or just spaces!`;
}
