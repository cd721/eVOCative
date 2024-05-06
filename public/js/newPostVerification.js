// The purpose of this file is to verify that all fields are filled out before submitting a new post

const form = document.getElementById("new-post-form");

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
    var titleInput = document.querySelector('input[name="title"]').value.trim();
    let titleLimit = 50;
    var postInput = document
      .querySelector('textarea[name="post"]')
      .value.trim();
    var tagsInput = document.querySelector('input[name="tags"]').value.trim();

    try {
      validateTitle(titleInput, titleLimit);
    } catch (e) {
      displayError("postTitle", e);
      valid = false;
    }

    try {
      validateGen("Post", postInput);
    } catch (e) {
      displayError("postContent", e);
      valid = false;
    }

    try {
      validateTags(tagsInput);
      if (tagsInput.length > 100) throw `Error: tags cannot be more than 100 characters.`;
    } catch (e) {
      displayError("postTags", e);
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
  if (input.length > 250) throw `${label} cannot be more than 250 characters!`;
}

function validateTitle(title, limit) {
  validateGen("Title", title);
  if (title.length > limit)
    throw `Error: Title cannot have more than ${limit} characters!`;
}

function validateTags(tags) {
  validateGen("Tags", tags);
  tags = tags.split(",");
  if (!Array.isArray(tags)) throw `Error: Tags must be an array`;
  if (tags.length === 0) throw `Error: Tags cannot be empty`;
  for (let str of tags) {
    if (typeof str !== "string")
      throw `Error: All elements of tags must be strings`;
    str = str.trim();
    if (str.length === 0)
      throw `Error: Elements in tags cannot be empty or just spaces`;
  }
}
