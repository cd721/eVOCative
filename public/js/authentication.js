// this script basically just adds the red error messages whenever the user is missing something at login/register

document.addEventListener("DOMContentLoaded", function() {
    function displayError(elementId, errorText) {
        // elements MUST HAVE FORMAT 'error_<input_name>' in html else this won't work!
        // well it doesn't have to, but it makes it easier
        const element = document.getElementById(`error_${elementId}`);
        element.textContent = errorText;

        // makes the input border red, delete this if it's too much red
        const input = document.getElementById(`${elementId}`);
        input.style.border = '1px solid red';
    }

    function resetErrors() {
        elements = document.querySelectorAll('.error_text');
        for (let i = 0; i < elements.length; i++) {
            elements[i].textContent = '';
        }

        // clears the red border, if any
        const inputs = document.querySelectorAll('input');
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].style.border = '';
        }
    }

    function validateRegister() {
        resetErrors();
        let valid = true;

        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        try {
            validateGen('First Name', firstName);
            if (/\d/.test(firstName)) throw `First name cannot contain a number!`;
        } catch (e) {
            displayError('firstName', e);
            valid = false;
        }

        try {
            validateGen('Last Name', lastName);
            if (/\d/.test(lastName)) throw `Last name cannot contain a number!`;
        } catch (e) {
            displayError('lastName', e);
            valid = false;
        }

        try {
            validateGen('Email', email);
            if (email.split("@").length < 2) throw `You must provide a valid email address!`;
        } catch (e) {
            displayError('email', e);
            valid = false;
        }

        try {
            validateGen('Username', username);
        } catch (e) {
            displayError('username', e);
            valid = false;
        }

        try {
            validateGen('Password', password);
        } catch (e) {
            displayError('password', e);
            valid = false;
        }

        try {
            validateGen('Confirmation', confirmPassword);
            if (confirmPassword !== password) throw 'Passwords must match!';
        } catch (e) {
            displayError('confirmPassword', e);
            valid = false;
        }

        // if it reaches here, that means hopefully no mistakes
        return valid;
    }

    function validateLogin() {
        resetErrors();
        let valid = true;
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        try {
            validateGen('Username', username);
        } catch (e) {
            displayError('username', e);
            valid = false;
        }

        try {
            validateGen('Password', password);
        } catch (e) {
            displayError('password', e);
            valid = false;
        }

        return valid;
    }


    const loginForm = document.getElementById('signin');
    const registerForm = document.getElementById('signup');

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            if(!validateLogin()) {
                event.preventDefault();
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            if(!validateRegister()) {
                event.preventDefault();
            }
        });
    }
});

// have helpers here, because you can't import

function validateGen(label, input) {
    if(!input) throw `${label} must be provided!`;
    if(typeof input !== 'string') throw `${label} must be of type string!`;
    input = input.trim();
    if(input.length === 0) throw `${label} cannot be empty or just spaces!`;
}