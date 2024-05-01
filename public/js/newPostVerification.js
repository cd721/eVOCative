// The purpose of this file is to verify that all fields are filled out before submitting a new post

const form = document.querySelector('.new-post-form');

form.addEventListener('submit', function(event) {
    // Get all the input fields
    var titleInput = document.querySelector('input[name="title"]');
    var postInput = document.querySelector('textarea[name="post"]');
    var tagsInput = document.querySelector('input[name="tags"]');

    if(!titleInput.value){
        event.preventDefault();
        var titleError = document.getElementById('titleError');
        titleError.innerHTML = "Title is required";
        titleError.style.color = "red";
        titleError.classList.remove("hidden");
    }
    else{
        var titleError = document.getElementById('titleError');
        titleError.classList.add("hidden");
    }

    if(!postInput.value){
        event.preventDefault();
        var postError = document.getElementById('postError');
        postError.innerHTML = "Post is required";
        postError.style.color = "red";
        postError.classList.remove("hidden");
    }
    else{
        var postError = document.getElementById('postError');
        postError.classList.add("hidden");
    }

    if(!tagsInput.value){
        event.preventDefault();
        var tagsError = document.getElementById('tagsError');
        tagsError.innerHTML = "Tags are required";
        tagsError.style.color = "red";
        tagsError.classList.remove("hidden");
    }
    else{
        var tagsError = document.getElementById('tagsError');
        tagsError.classList.add("hidden");
    }
  });