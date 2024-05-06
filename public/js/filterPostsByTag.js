const tagButtons = document.getElementsByClassName('tag-button');
const posts = document.getElementsByClassName('individual-post');

for (let i = 0; i < tagButtons.length; i++) {
  tagButtons[i].addEventListener('click', function() {
        const tag = this.getAttribute('data-tag');
        this.classList.toggle('active');

        // create set of active tags
        const activeTags = new Set();
        const activeTagButtons = document.querySelectorAll('.tag-button.active');
        for (let button of activeTagButtons) {
            activeTags.add(button.getAttribute('data-tag'));
        }

        // filter the posts
        for (let post of posts) {
            const postTagsElements = post.querySelectorAll('.forum-tags li');
            let hasMatchingTag = false;

            // check if post has a matching tag
            for (let postTagElement of postTagsElements) {
                if (activeTags.has(postTagElement.textContent)) {
                    hasMatchingTag = true;
                    break;
                }
            }

            // show/hide posts
            if (hasMatchingTag || activeTags.size === 0) {
                post.style.display = "";
            } else {
                post.style.display = "none";
            }
          
        }
    });
}

