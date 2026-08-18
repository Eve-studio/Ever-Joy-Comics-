/* =========================================================
   EVER JOY COMICS
   LOGIN PAGE
   =========================================================

   Handles:
   - Login validation
   - Shared authentication
   - Reader accounts
   - Creator accounts
   - Current-user session
   - Safe redirect to profile
   ========================================================= */


/* =========================================================
   1. INITIALIZE LOGIN PAGE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const loginForm =
            document.getElementById(
                "loginForm"
            );


        if (!loginForm) {
            return;
        }


        setupLoginPasswordToggle();

        setupLoginForm();

    }
);


/* =========================================================
   2. PASSWORD TOGGLE
   ========================================================= */

function setupLoginPasswordToggle() {

    const passwordInput =
        document.getElementById(
            "loginPassword"
        );


    const toggleButton =
        document.getElementById(
            "toggleLoginPassword"
        );


    if (
        !passwordInput ||
        !toggleButton
    ) {
        return;
    }


    toggleButton.addEventListener(
        "click",
        () => {

            const isPassword =
                passwordInput.type ===
                "password";


            passwordInput.type =
                isPassword
                    ? "text"
                    : "password";


            toggleButton.textContent =
                isPassword
                    ? "Hide"
                    : "Show";


            toggleButton.setAttribute(
                "aria-label",
                isPassword
                    ? "Hide password"
                    : "Show password"
            );

        }
    );

}


/* =========================================================
   3. LOGIN FORM
   ========================================================= */

function setupLoginForm() {

    const form =
        document.getElementById(
            "loginForm"
        );


    const emailInput =
        document.getElementById(
            "loginEmail"
        );


    const passwordInput =
        document.getElementById(
            "loginPassword"
        );


    const message =
        document.getElementById(
            "loginMessage"
        );


    const submitButton =
        document.getElementById(
            "loginSubmit"
        );


    if (
        !form ||
        !emailInput ||
        !passwordInput
    ) {
        return;
    }


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            clearLoginMessage(
                message
            );


            const email =
                emailInput.value
                    .trim()
                    .toLowerCase();


            const password =
                passwordInput.value;


            /* ---------------------------------------------
               BASIC VALIDATION
               --------------------------------------------- */

            if (!email) {

                showLoginMessage(
                    message,
                    "Please enter your email address.",
                    "error"
                );

                emailInput.focus();

                return;

            }


            if (
                !emailInput.checkValidity()
            ) {

                showLoginMessage(
                    message,
                    "Please enter a valid email address.",
                    "error"
                );

                emailInput.focus();

                return;

            }


            if (!password) {

                showLoginMessage(
                    message,
                    "Please enter your password.",
                    "error"
                );

                passwordInput.focus();

                return;

            }


            /* ---------------------------------------------
               CHECK AUTH SYSTEM
               --------------------------------------------- */

            if (
                typeof loginEverJoyUser !==
                "function"
            ) {

                showLoginMessage(
                    message,
                    "Authentication system is unavailable.",
                    "error"
                );

                return;

            }


            /* ---------------------------------------------
               DISABLE BUTTON
               --------------------------------------------- */

            if (submitButton) {

                submitButton.disabled =
                    true;

                submitButton.textContent =
                    "Logging in...";

            }


            /* ---------------------------------------------
               LOGIN
               --------------------------------------------- */

            let result;

            try {

                result =
                    loginEverJoyUser(
                        email,
                        password
                    );

            }

            catch (error) {

                console.error(
                    "Ever Joy: Login error.",
                    error
                );


                showLoginMessage(
                    message,
                    "Something went wrong while logging in.",
                    "error"
                );


                restoreLoginButton(
                    submitButton
                );


                return;

            }


            /* ---------------------------------------------
               LOGIN FAILED
               --------------------------------------------- */

            if (
                !result ||
                result.success !== true ||
                !result.user
            ) {

                showLoginMessage(
                    message,
                    result?.message ||
                    "Unable to log in.",
                    "error"
                );


                restoreLoginButton(
                    submitButton
                );


                return;

            }


            /* ---------------------------------------------
               IMPORTANT:
               MAKE ABSOLUTELY SURE THE CURRENT USER
               SESSION WAS SAVED.
               --------------------------------------------- */

            let sessionSaved =
                false;


            try {

                sessionSaved =
                    setEverJoyCurrentUser(
                        result.user
                    );

            }

            catch (error) {

                console.error(
                    "Ever Joy: Could not create login session.",
                    error
                );

            }


            if (!sessionSaved) {

                showLoginMessage(
                    message,
                    "Login succeeded, but your session could not be saved.",
                    "error"
                );


                restoreLoginButton(
                    submitButton
                );


                return;

            }


            /* ---------------------------------------------
               VERIFY SESSION
               --------------------------------------------- */

            const loggedInUser =
                getEverJoyCurrentUser();


            if (!loggedInUser) {

                showLoginMessage(
                    message,
                    "Your login session could not be created. Please try again.",
                    "error"
                );


                restoreLoginButton(
                    submitButton
                );


                return;

            }


            /* ---------------------------------------------
               SUCCESS MESSAGE
               --------------------------------------------- */

            showLoginMessage(
                message,
                loggedInUser.accountType === "creator"
                    ? "Welcome back, Creator. Opening your profile..."
                    : "Welcome back. Opening your profile...",
                "success"
            );


            /* ---------------------------------------------
               REDIRECT
               --------------------------------------------- */

            setTimeout(
                () => {

                    window.location.replace(
                        "../reader/profile.html"
                    );

                },
                300
            );


            /* ---------------------------------------------
               FALLBACK
               ---------------------------------------------

               If the browser somehow refuses to navigate,
               don't leave the button stuck forever.
            */

            setTimeout(
                () => {

                    if (
                        document.visibilityState !==
                        "hidden"
                    ) {

                        restoreLoginButton(
                            submitButton
                        );

                    }

                },
                3000
            );

        }
    );

}


/* =========================================================
   4. RESTORE LOGIN BUTTON
   ========================================================= */

function restoreLoginButton(
    submitButton
) {

    if (!submitButton) {
        return;
    }


    submitButton.disabled =
        false;


    submitButton.textContent =
        "Log In";

}


/* =========================================================
   5. SHOW MESSAGE
   ========================================================= */

function showLoginMessage(
    element,
    text,
    type
) {

    if (!element) {
        return;
    }


    element.textContent =
        text;


    element.className =
        `account-message ${type}`;

}


/* =========================================================
   6. CLEAR MESSAGE
   ========================================================= */

function clearLoginMessage(
    element
) {

    if (!element) {
        return;
    }


    element.textContent =
        "";


    element.className =
        "account-message";

}