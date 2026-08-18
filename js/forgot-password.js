/* =========================================================
EVER JOY COMICS
FORGOT PASSWORD
========================================================= */

/* =========================================================

1. INITIALIZE
   ========================================================= */

document.addEventListener(
"DOMContentLoaded",
initializeForgotPassword
);

/* =========================================================
2. INITIALIZE PAGE
========================================================= */

function initializeForgotPassword() {

const form =
    document.getElementById(
        "forgotPasswordForm"
    );


if (!form) {

    return;

}


setupPasswordToggle(
    "newPassword",
    "toggleNewPassword"
);


setupPasswordToggle(
    "confirmNewPassword",
    "toggleConfirmNewPassword"
);


form.addEventListener(
    "submit",
    handleForgotPasswordSubmit
);

}

/* =========================================================
3. PASSWORD TOGGLE
========================================================= */

function setupPasswordToggle(
inputId,
buttonId
) {

const input =
    document.getElementById(
        inputId
    );


const button =
    document.getElementById(
        buttonId
    );


if (
    !input ||
    !button
) {

    return;

}


button.addEventListener(
    "click",
    () => {

        const isPassword =
            input.type === "password";


        input.type =
            isPassword
                ? "text"
                : "password";


        button.textContent =
            isPassword
                ? "Hide"
                : "Show";


        button.setAttribute(
            "aria-label",
            isPassword
                ? "Hide password"
                : "Show password"
        );

    }
);

}

/* =========================================================
4. SUBMIT
========================================================= */

function handleForgotPasswordSubmit(
event
) {

event.preventDefault();


clearForgotPasswordMessage();


const emailInput =
    document.getElementById(
        "forgotPasswordEmail"
    );


const passwordInput =
    document.getElementById(
        "newPassword"
    );


const confirmPasswordInput =
    document.getElementById(
        "confirmNewPassword"
    );


const submitButton =
    document.getElementById(
        "forgotPasswordSubmit"
    );


if (
    !emailInput ||
    !passwordInput ||
    !confirmPasswordInput
) {

    return;

}


const email =
    emailInput.value
        .trim()
        .toLowerCase();


const newPassword =
    passwordInput.value;


const confirmPassword =
    confirmPasswordInput.value;


/* =====================================================
   EMAIL
   ===================================================== */

if (!email) {

    showForgotPasswordMessage(
        "Please enter your email address.",
        "error"
    );

    return;

}


if (
    !emailInput.checkValidity()
) {

    showForgotPasswordMessage(
        "Please enter a valid email address.",
        "error"
    );

    return;

}


/* =====================================================
   PASSWORD
   ===================================================== */

if (!newPassword) {

    showForgotPasswordMessage(
        "Please enter a new password.",
        "error"
    );

    return;

}


if (
    newPassword.length < 8
) {

    showForgotPasswordMessage(
        "Your new password must be at least 8 characters.",
        "error"
    );

    return;

}


if (
    newPassword !==
    confirmPassword
) {

    showForgotPasswordMessage(
        "The passwords do not match.",
        "error"
    );

    return;

}


/* =====================================================
   CHECK AUTH SYSTEM
   ===================================================== */

if (
    typeof findEverJoyUserByEmail !==
    "function"
) {

    showForgotPasswordMessage(
        "The authentication system could not be loaded.",
        "error"
    );

    return;

}


const user =
    findEverJoyUserByEmail(
        email
    );


if (!user) {

    showForgotPasswordMessage(
        "No Ever Joy account was found with that email.",
        "error"
    );

    return;

}


/* =====================================================
   UPDATE PASSWORD
   ===================================================== */

const users =
    getEverJoyUsers();


const userIndex =
    users.findIndex(
        existingUser =>
            existingUser.id === user.id
    );


if (
    userIndex === -1
) {

    showForgotPasswordMessage(
        "Unable to update this account.",
        "error"
    );

    return;

}


users[userIndex].password =
    newPassword;


saveEverJoyUsers(
    users
);


/* =====================================================
   SUCCESS
   ===================================================== */

if (submitButton) {

    submitButton.disabled =
        true;

    submitButton.textContent =
        "Password Updated ✓";

}


showForgotPasswordMessage(
    "Your password has been reset successfully. You can now log in.",
    "success"
);


setTimeout(
    () => {

        window.location.href =
            "./login.html";

    },
    900
);

}

/* =========================================================
5. MESSAGE
========================================================= */

function showForgotPasswordMessage(
message,
type
) {

const element =
    document.getElementById(
        "forgotPasswordMessage"
    );


if (!element) {

    return;

}


element.textContent =
    message;


element.className =
    `auth-message ${type}`;

}

/* =========================================================
6. CLEAR MESSAGE
========================================================= */

function clearForgotPasswordMessage() {

const element =
    document.getElementById(
        "forgotPasswordMessage"
    );


if (!element) {

    return;

}


element.textContent =
    "";


element.className =
    "auth-message";

}