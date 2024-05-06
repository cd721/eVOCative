// The purpose of this file is to verify that all fields are filled out before submitting a new ticket

const form = document.getElementById("new-ticket");

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
    var issueInput = document
      .querySelector('input[name="issue"]')
      .value.trim();
    var typeInput = document.querySelector('select[name="type"]').value.trim();

    try {
      validateGen("Issue", issueInput);
    } catch (e) {
      displayError("issue", e);
      valid = false;
    }

    try {
      validateType(typeInput);
    } catch (e) {
      displayError("type", e);
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

function validateType(type) {
  if (!type) throw `Error: Type not provided.`;
  if (typeof type !== "string") throw `Error: Type must be of type string`;
  type = type.trim();
  if (type.length === 0) throw `Error: Type cannot be empty or just spaces`;
  if (
    type !== "new vocab" &&
    type !== "report a user" &&
    type !== "report a post/comment" &&
    type !== "bug fix" &&
    type !== "update/remove vocab" &&
    type !== "feature request"
  ) {
    throw `Error: Type must be one of the predefined types`;
  }
}
