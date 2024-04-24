// (function () {
const form = document.getElementById("tag-filter-form");
const clearForm = document.getElementById("clear-filtered-tags");
const tagsTextArea = document.getElementById("tagFilter");
const postsList = document.getElementById("posts_list");
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

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
        let postSection = postPreviews[i].querySelector(".individual_post");
        let id = postSection.id;
        let tagAs = [...document.querySelectorAll(`section#${id} li a`)];
        let tagList = tagAs.map((a) => a.innerHTML);

        for (let tagUserWants of tagsUserWantsToSee) {
          if (!tagList.includes(tagUserWants)) {
            $(`#${id}`).hide();
          } else {
            $(`#${id}`).show();
          }
        }
      }
    }

    tagsTextArea.value = "";
  });
}

if (clearForm) {
  clearForm.addEventListener("submit", (event) => {
    event.preventDefault();

    //Reset the existing posts that are there
    if (postsList) {
      // let postLiElements = postsList.children[0].children;
      let postPreviews = document.querySelectorAll(".post_preview");
      for (let i = 0; i < postPreviews.length; i++) {
        let postSection = postPreviews[i].querySelector(".individual_post");
        let id = postSection.id;
        $(`#${id}`).show();
      }
    }

    tagsTextArea.value = "";
  });
}

//});
