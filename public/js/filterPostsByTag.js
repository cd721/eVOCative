// (function () {
const form = document.getElementById("tag-filter-form");
const clearForm = document.getElementById("clear-filtered-tags");
const tagsTextArea = document.getElementById("tagFilter");
const postsList = document.getElementById("posts_list");
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    form.reset();


    const tagString = tagsTextArea.value;
    let tagsUserWantsToSee;
    if (tagsTextArea.value) {
      tagsUserWantsToSee = tagString.split(",");
      tagsUserWantsToSee = tagsUserWantsToSee.map((tag) => tag.trim());
    }

    //Clear the existing posts that are there
    if (postsList) {
      let postPreviews = document.querySelectorAll(".post_preview");
      for (let i = 0; i < postPreviews.length; i++) {
        let postSection = postPreviews[i].querySelector(".individual_post")
        let id = postSection.id;
        let tagAs = [...document.querySelectorAll(`section#${id} li a`)];
        let tagList = tagAs.map(a => a.innerHTML);

        for (let tagUserWants of tagsUserWantsToSee) {
          if (!tagList.includes(tagUserWants)) {
            postPreviews[i].classList.add("hidden");
            postPreviews[i].childNodes.forEach(node => node.classList.add("hidden"))

          }
        }
      }
    }


  });
}

if (clearForm) {
  clearForm.addEventListener("submit", (event) => {
    event.preventDefault();
    tagsTextArea.value = "";

    //Reset the existing posts that are there
    if (postsList) {
      // let postLiElements = postsList.children[0].children;
      let postPreviews = document.querySelectorAll(".post_preview");
      for (let i = 0; i < postPreviews[i].length; i++) {

        postPreviews[i].classList.remove("hidden");
        postPreviews[i].childNodes.forEach(node => node.classList.add("hidden"))

      }
    }
  });
}

//});
