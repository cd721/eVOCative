
// (function () {
const form = document.getElementById("tag-filter-form");
const tagsTextArea = document.getElementById('tagFilter');
const postsList = document.getElementById("postsList");
if (form) {
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const tagString = tagsTextArea.value;
        let tagsUserWantsToSee;
        if (tagsTextArea.value) {
            tagsUserWantsToSee = tagString.split(",");
            tagsUserWantsToSee = tagsUserWantsToSee.map(tag => tag.trim());
        }

        //Clear the existing posts that are there
        if (postsList) {

            let postLiElements = postsList.children[0].children;
            let postArticles = document.querySelectorAll(".post");
            for (let i = 0; i < postArticles.length; i++) {
                let id = postArticles[i].id;
                let tagAside = document.querySelector(`article#${id} aside`);
                let tagList = tagAside.innerHTML;


                for (let tagUserWants of tagsUserWantsToSee) {
                    if (!tagList.includes(tagUserWants)) {
                        postArticles[i].hidden = true;
                    }
                }

            }



        }




    });
}

//});