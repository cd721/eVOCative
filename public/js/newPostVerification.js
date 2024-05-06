document.addEventListener("DOMContentLoaded", function() {
    function displayError(elementId, errorText) {
        const errorElement = document.getElementById(`error_${elementId}`);
        const inputElement = document.getElementById(elementId);
        errorElement.textContent = errorText;
        inputElement.style.border = '1px solid red';
    }
    
    function resetErrors() {
        elements = document.querySelectorAll('.error_text');
        for (let i = 0; i < elements.length; i++) {
            elements[i].textContent = '';
        }

        const inputs = document.querySelectorAll('input, textarea');
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].style.border = '';
        }
    }

    function validatePostForm() {
        resetErrors();
        let valid = true;
        const title = document.getElementById('postTitle').value.trim();
        const post = document.getElementById('postContent').value.trim();
        const tags = document.getElementById('postTags').value.trim();

        if (!title) {
            displayError('postTitle', 'Title is required');
            valid = false;
        }

        if (!post) {
            displayError('postContent', 'Post content is required');
            valid = false;
        }

        if (!tags) {
            displayError('postTags', 'At least one tag is required');
            valid = false;
        }

        return valid;
    }

    const newPostForm = document.getElementById('new-post-form');
    if (newPostForm) {
        newPostForm.addEventListener('submit', function(event) {
            if (!validatePostForm()) {
                event.preventDefault();
            }
        });
    }

});
