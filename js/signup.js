/* =========================================================
   EVER JOY COMICS
   SIGN UP PAGE
   ========================================================= */


/* =========================================================
   1. INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const form =
            document.getElementById(
                "signupForm"
            );


        if (!form) {

            return;

        }


        setupPasswordToggle(
            "signupPassword",
            "toggleSignupPassword"
        );


        setupPasswordToggle(
            "signupConfirmPassword",
            "toggleConfirmPassword"
        );


        setupSignupForm(
            form
        );

    }
);


/* =========================================================
   2. PASSWORD TOGGLE
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
   3. SIGNUP FORM
   ========================================================= */

function setupSignupForm(
    form
) {

    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            clearSignupMessage();


            /* =============================================
               COLLECT FORM DATA
               ============================================= */

            const username =
                document
                    .getElementById(
                        "signupUsername"
                    )
                    ?.value
                    .trim();


            const email =
                document
                    .getElementById(
                        "signupEmail"
                    )
                    ?.value
                    .trim()
                    .toLowerCase();


            const password =
                document
                    .getElementById(
                        "signupPassword"
                    )
                    ?.value
                    || "";


            const confirmPassword =
                document
                    .getElementById(
                        "signupConfirmPassword"
                    )
                    ?.value
                    || "";


            const gender =
                document.querySelector(
                    'input[name="gender"]:checked'
                )?.value
                || "";


            const dateOfBirth =
                document
                    .getElementById(
                        "signupBirthday"
                    )
                    ?.value
                    || "";


            const creatorCode =
                document
                    .getElementById(
                        "signupCreatorCode"
                    )
                    ?.value
                    .trim()
                    || "";


            const terms =
                document
                    .getElementById(
                        "signupTerms"
                    )
                    ?.checked
                    || false;



            /* =============================================
               BASIC VALIDATION
               ============================================= */

            if (!username) {

                showSignupMessage(
                    "Please choose a username.",
                    "error"
                );

                return;

            }


            if (
                username.length < 3 ||
                username.length > 30
            ) {

                showSignupMessage(
                    "Username must be between 3 and 30 characters.",
                    "error"
                );

                return;

            }


            if (
                !/^[a-zA-Z0-9_]+$/.test(
                    username
                )
            ) {

                showSignupMessage(
                    "Username can only contain letters, numbers, and underscores.",
                    "error"
                );

                return;

            }


            if (!email) {

                showSignupMessage(
                    "Please enter your email address.",
                    "error"
                );

                return;

            }


            if (
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                    email
                )
            ) {

                showSignupMessage(
                    "Please enter a valid email address.",
                    "error"
                );

                return;

            }


            if (
                password.length < 8
            ) {

                showSignupMessage(
                    "Your password must contain at least 8 characters.",
                    "error"
                );

                return;

            }


            if (
                password !==
                confirmPassword
            ) {

                showSignupMessage(
                    "Passwords do not match.",
                    "error"
                );

                return;

            }


            if (!gender) {

                showSignupMessage(
                    "Please select your gender.",
                    "error"
                );

                return;

            }


            if (!dateOfBirth) {

                showSignupMessage(
                    "Please enter your date of birth.",
                    "error"
                );

                return;

            }


            if (!terms) {

                showSignupMessage(
                    "You must agree to the Terms of Service and Privacy Policy.",
                    "error"
                );

                return;

            }



            /* =============================================
               CHECK AUTH SYSTEM
               ============================================= */

            if (
                typeof createEverJoyUser !==
                "function"
            ) {

                showSignupMessage(
                    "The authentication system could not be loaded. Please refresh the page.",
                    "error"
                );

                return;

            }



            /* =============================================
               CHECK EXISTING EMAIL
               ============================================= */

            if (
                typeof findEverJoyUserByEmail ===
                "function"
                &&
                findEverJoyUserByEmail(
                    email
                )
            ) {

                showSignupMessage(
                    "An account with this email already exists.",
                    "error"
                );

                return;

            }



            /* =============================================
               CHECK EXISTING USERNAME
               ============================================= */

            if (
                typeof findEverJoyUserByUsername ===
                "function"
                &&
                findEverJoyUserByUsername(
                    username
                )
            ) {

                showSignupMessage(
                    "This username is already taken.",
                    "error"
                );

                return;

            }



            /* =============================================
               CREATE ACCOUNT
               ============================================= */

            const submitButton =
                document.getElementById(
                    "signupSubmit"
                );


            if (submitButton) {

                submitButton.disabled =
                    true;

                submitButton.textContent =
                    "Creating account...";

            }


            const result =
                createEverJoyUser({

                    username:
                        username,

                    email:
                        email,

                    password:
                        password,

                    gender:
                        gender,

                    dateOfBirth:
                        dateOfBirth,

                    creatorCode:
                        creatorCode

                });



            /* =============================================
               HANDLE FAILURE
               ============================================= */

            if (
                !result ||
                !result.success
            ) {

                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        "Create Account";

                }


                showSignupMessage(
                    result?.message ||
                    "Could not create your account.",
                    "error"
                );

                return;

            }



            /* =============================================
               LOG USER IN
               ============================================= */

            if (
                typeof setEverJoyCurrentUser ===
                "function"
            ) {

                setEverJoyCurrentUser(
                    result.user
                );

            }



            /* =============================================
               SUCCESS MESSAGE
               ============================================= */

            const successMessage =
                result.user?.creator?.enabled
                    ? "Creator account created successfully. Welcome to Ever Joy! ✨"
                    : "Account created successfully. Welcome to Ever Joy! ✨";


            showSignupMessage(
                successMessage,
                "success"
            );


            if (submitButton) {

                submitButton.textContent =
                    "Account Created ✓";

            }



            /* =============================================
               OPEN PROFILE
               ============================================= */

            setTimeout(
                () => {

                    window.location.href =
                        "../reader/profile.html";

                },
                800
            );

        }
    );

}


/* =========================================================
   4. MESSAGE
   ========================================================= */

function showSignupMessage(
    message,
    type
) {

    const element =
        document.getElementById(
            "signupMessage"
        );


    if (!element) {

        return;

    }


    element.textContent =
        message;


    element.className =
        `signup-message ${type}`;

}


/* =========================================================
   5. CLEAR MESSAGE
   ========================================================= */

function clearSignupMessage() {

    const element =
        document.getElementById(
            "signupMessage"
        );


    if (!element) {

        return;

    }


    element.textContent =
        "";


    element.className =
        "signup-message";

}